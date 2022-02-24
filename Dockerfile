FROM node:14-alpine as deps
RUN apk add --no-cache bash make git python3
RUN apk add --update alpine-sdk
WORKDIR /usr/src/app
# Do `npm ci` separately so we can cache `node_modules`
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
COPY package*.json ./
RUN npm clean-install

FROM node:14-alpine as build
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build:server

FROM node:14-alpine as prod
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/bin ./bin
COPY package.json ./
ENV PG_META_PORT=8080
CMD ["npm", "run", "start"]
EXPOSE 8080
