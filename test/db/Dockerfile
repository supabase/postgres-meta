FROM supabase/postgres:14.1.0

COPY --chown=postgres:postgres --chmod=600 server.key server.crt /var/lib/postgresql/

ADD "https://github.com/supabase/pg_jsonschema/releases/download/v0.1.4/pg_jsonschema-v0.1.4-pg14-amd64-linux-gnu.deb" \
    /tmp/pg_jsonschema.deb

RUN apt-get update && apt-get install -y --no-install-recommends \
    /tmp/*.deb \
    # Needed for anything using libcurl
    # https://github.com/supabase/postgres/issues/573
    ca-certificates