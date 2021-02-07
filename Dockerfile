# docker build -t postgres-meta .
# docker run -t -i -p8080:8080 postgres-meta

FROM debian:stable-slim
COPY ./bin/app-linux /bin/
ENV PG_META_PORT=8080
ENTRYPOINT "/bin/app-linux"
EXPOSE 8080
