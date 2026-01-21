{
  description = "postgres-meta - A RESTful API for managing your Postgres";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        # For Docker images, we want to target Linux
        pkgsLinux = if pkgs.stdenv.isLinux
          then pkgs
          else nixpkgs.legacyPackages.x86_64-linux;

        # Read package.json to get version and metadata
        packageJson = builtins.fromJSON (builtins.readFile ./package.json);

        # Build the postgres-meta application using a custom derivation for better control
        postgres-meta = pkgsLinux.stdenv.mkDerivation {
          pname = "postgres-meta";
          version = packageJson.version;

          src = ./.;

          nativeBuildInputs = with pkgsLinux; [
            nodejs_20
            nodePackages.npm
          ];

          configurePhase = ''
            export HOME=$TMPDIR
            npm ci
          '';

          buildPhase = ''
            npm run build
            npm prune --omit=dev
          '';

          installPhase = ''
            mkdir -p $out
            cp -r dist $out/dist
            cp -r node_modules $out/node_modules
            cp package.json $out/package.json
          '';

          dontFixup = true;
        };

        # Create a startup script wrapper
        startScript = pkgsLinux.writeShellScriptBin "start-postgres-meta" ''
          export NODE_PATH=${postgres-meta}/node_modules
          exec ${pkgsLinux.nodejs_20}/bin/node ${postgres-meta}/dist/server/server.js
        '';

        # Create a minimal Docker image using streamLayeredImage for better compression
        dockerImage = pkgsLinux.dockerTools.streamLayeredImage {
          name = "nix/postgres-meta";
          tag = "latest";

          # Minimal contents - only nodejs runtime, certificates, and our app
          contents = [
            pkgsLinux.nodejs_20
            pkgsLinux.cacert
            postgres-meta
            startScript
          ];

          # Extra commands to set up the filesystem
          extraCommands = ''
            mkdir -p tmp
            chmod 1777 tmp
          '';

          config = {
            Cmd = [ "${startScript}/bin/start-postgres-meta" ];
            Env = [
              "PG_META_PORT=8080"
              "SSL_CERT_FILE=${pkgsLinux.cacert}/etc/ssl/certs/ca-bundle.crt"
            ];
            WorkingDir = "${postgres-meta}";
            ExposedPorts = {
              "8080/tcp" = {};
            };
            Healthcheck = {
              Test = [
                "CMD"
                "${pkgsLinux.nodejs_20}/bin/node"
                "-e"
                "fetch('http://localhost:8080/health').then((r) => {if (r.status !== 200) throw new Error(r.status)})"
              ];
              Interval = 5000000000; # 5s in nanoseconds
              Timeout = 5000000000;   # 5s in nanoseconds
              Retries = 3;
            };
          };

          # Use maxLayers for better deduplication and caching
          maxLayers = 100;
        };

      in
      {
        packages = {
          default = postgres-meta;
          docker = dockerImage;
        };

        apps = {
          default = {
            type = "app";
            program = "${startScript}/bin/start-postgres-meta";
          };
        };

        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            nodePackages.npm
          ];
        };
      }
    );
}
