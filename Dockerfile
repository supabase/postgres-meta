FROM node:18 as build
WORKDIR /usr/src/app
# Do `npm ci` separately so we can cache `node_modules`
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
COPY package.json package-lock.json ./
RUN npm clean-install
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:18-slim
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules node_modules
COPY --from=build /usr/src/app/dist dist
COPY package.json ./
ENV PG_META_PORT=8080
CMD ["npm", "run", "start"]
EXPOSE 8080
# --start-period defaults to 0s, but can't be set to 0s (to be explicit) by now
HEALTHCHECK --interval=5s --timeout=5s --retries=3 CMD node -e "require('http').get('http://localhost:8080/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"
