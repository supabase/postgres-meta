FROM node:16 as build
WORKDIR /usr/src/app
# Do `npm ci` separately so we can cache `node_modules`
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
COPY package.json package-lock.json .
RUN npm clean-install
COPY . .
RUN npm run build:server

FROM node:16-slim
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules node_modules
COPY --from=build /usr/src/app/bin bin
COPY package.json ./
ENV PG_META_PORT=8080
CMD ["npm", "run", "start"]
EXPOSE 8080
