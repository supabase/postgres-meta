# Contributing

### Install deps

- docker
- `npm install`

### Start services

1. Run `docker compose up` in `/test/db`
2. Run the tests: `npm run test:run`
3. Make changes in code (`/src`) and tests (`/test/lib` and `/test/server`)
4. Run the tests again: `npm run test:run`
5. Commit + PR