# docker build -t postgres-meta .
# docker run -t -i -p8080:8080 postgres-meta

FROM debian:stable-slim
COPY ./bin/postgres-meta-linux .
ENV PG_META_PORT=8080
ENTRYPOINT "./postgres-meta-linux"
EXPOSE 8080
