FROM --platform=linux/amd64 debian:stable-slim
COPY bin/postgres-meta-linux /bin/postgres-meta
ENV PG_META_PORT=8080
ENTRYPOINT ["postgres-meta"]
EXPOSE 8080
