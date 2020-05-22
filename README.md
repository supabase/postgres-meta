## PG-API

A RESTful API for managing your Postgres. Fetch tables, add roles, and run queries (and more).

## Docs

https://supabase.github.io/pg-api/

## Quickstart

Run any of the bin files in the `bin` directory
```
./bin/start-linux
./bin/start-macos
./bin/start-windows.exe
```

Then you can call any of the following


## FAQs

**What security does this use?**

None right now. We are assuming you are using this behind a proxy which brings it's own security, or using this internally with no access to the outside world. We may add security in the future, but only something very basic.  

**Can I use this on my website/client?**

No. Primarily because you shouldn't really query your database directly from a client unless you want to give everyone full access to your data. (Don't do it.) 

## Developers

1. Start the database using `docker-compose up`
2. Run `npm run dev`
3. Run `npm test` while you work

## Licence

Apache 2.0