# docker build -t pg-api .
# docker run -p8080:8080 pg-api

FROM debian:stable-slim
COPY ./bin/start-linux /bin/
ENV PG_API_PORT=8080
CMD ["/bin/start-linux"]