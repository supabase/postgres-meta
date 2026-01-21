# Multi-stage build using Nix for minimal image size
FROM nixos/nix:2.24.11 AS builder

# Enable flakes
RUN echo "experimental-features = nix-command flakes" >> /etc/nix/nix.conf

WORKDIR /build

# Copy source files
COPY package.json package-lock.json tsconfig.json ./
COPY src ./src

# Create a minimal build script
RUN nix-shell -p nodejs_20 --run "\
    npm ci && \
    npm run build && \
    npm prune --omit=dev \
"

# Final stage - use distroless or minimal base
FROM node:20-alpine

# Install only ca-certificates for SSL
RUN apk add --no-cache ca-certificates && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Copy built artifacts from builder
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package.json ./package.json

ENV PG_META_PORT=8080

# Use node directly instead of npm start
CMD ["node", "dist/server/server.js"]

EXPOSE 8080

HEALTHCHECK --interval=5s --timeout=5s --retries=3 \
    CMD node -e "fetch('http://localhost:8080/health').then((r) => {if (r.status !== 200) throw new Error(r.status)})"
