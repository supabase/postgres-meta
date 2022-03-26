FROM node:14-slim
WORKDIR /usr/src/app
# Do `npm ci` separately so we can cache `node_modules`
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
COPY package*.json ./
RUN npm clean-install
COPY . .
RUN npm run build:server
ENV PG_META_PORT=8080
CMD ["npm", "run", "start"]
EXPOSE 8080
