---
title: Postgres Admin API
language_tabs:
  - sh: Shell
  - js: JavaScript
toc_footers:
  - © <a href="https://supabase.io">Supabase</a> 2020
  - <a href="https://supabase.io">Visit supabase.io</a>
  - <a href="https://github.com/supabase/pg-api">View on GitHub</a>
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="about">Postgres API</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Manage your PostgreSQL database using a RESTful API.

This is still in early development, so most of the functionality is read-only. 

The goal of this API is to enable the full management of a Postgres database using a RESTful interface. This includes adding tables, columns, roles, and users at runtime, as well as running ad-hoc queries.

### Support

- Repository: https://github.com/supabase/pg-api
- Made by Supabase: https://supabase.io


# Getting started

## Usage

> Basic usage

```sh
curl -X GET https://pg-api.fly.dev/ \
  -H 'Content-Type: application/json' \
  -H 'pg: {}' # see Postgres connection header below
```
```js
const data = await fetch('https://pg-api.fly.dev', {
  method: 'GET',
  headers: { 
    'Content-Type': 'application/json',
    'pg': {} // see Postgres connection header below
  }
})
```
> Postgres connection header
```json
{
  "user": "postgres",
  "password": "postgres", 
  "port": 5432, 
  "host": "db.domain.com" 
}
```

For security reasons, this API is best self-hosted. However, we provide an example API for you to test before installing. To use the API however, you have to send your PG connection via HTTPS headers. 

We DO NOT log these headers anywhere. But still, we HIGHLY recommend that you just self-host (we have tried to make this easy for you). Use the demo API at your own risk.

Database connection headers are not required for self-hosting. You can set ENV vars with your default connection details so that you don't pass connection details over a network.


## Self Hosting

```
https://github.com/supabase/pg-api
```

We support several different methods for self-hosting, detailed in the [repository](https://github.com/supabase/pg-api).


## Authentication

Authentication is not provided. Make sure you use this inside a secure network or behind a secure API proxy.







<h1 id="swagger-pg-api-query">Query</h1>

Directly query your database. Send any SQL you want!

## query

<a id="opIdquery"></a>

> POST /query

```sh
curl -X POST https://pg-api.fly.dev/query \
  -H 'Content-Type: application/json' \
  -d '{}' # see example body below
```
```js

const data = await fetch('https://pg-api.fly.dev/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: {} // see example body below
})
```
> Example body
```json
{
  "query": "SELECT * FROM your_table LIMIT 1;"
}
```

`POST /query`

*Execute an SQL query*

<h3 id="addpet-parameters">Parameters</h3>

|Name|Type|Required|Description|
|---|---|---|---|
|query|string|true|SQL string to execute|





<h1 id="pg-api-schemas">Schemas</h1>

View and manage your Postgres schemas.

## getSchemas

<a id="get-schemas"></a>

> GET /schemas

```sh
curl -X GET https://pg-api.fly.dev/schemas \
  -H 'Content-Type: application/json' \
  -H 'pg: { "host": "DB_HOST", "password": "DB_PASSWORD" }'
```
```js
const data = await fetch('https://pg-api.fly.dev/schemas', {
  method: 'GET',
  headers: { 
    'pg': { "host": "DB_HOST", "password": "DB_PASSWORD" } 
  }
})
```

`GET /schemas`

*Get all schemas*

> Parameters:
```javascript
/**
 * @param {boolean} [includeSystemSchemas=false] - Return system schemas as well as user schemas
 */
 ```
 > Returns: Schemas.Schema[]
 ```javascript
{
  catalog_name: string
  name: string
  owner: string
  default_character_set_catalog: string
  default_character_set_schema: string
  default_character_set_name: string
  sql_path: string
}
```







<h1 id="pg-api-tables">Tables</h1>

View and manage your Postgres tables.

## getTables

<a id="get-tables"></a>

> GET /tables

```sh
curl -X GET https://pg-api.fly.dev/tables \
  -H 'Content-Type: application/json' \
  -H 'pg: { "host": "DB_HOST", "password": "DB_PASSWORD" }'
```
```js
const data = await fetch('https://pg-api.fly.dev/tables', {
  method: 'GET',
  headers: { 
    'pg': { "host": "DB_HOST", "password": "DB_PASSWORD" } 
  }
})
```

`GET /tables`

*Get all tables*







<h1 id="pg-api-schemas">Types</h1>

View and manage your Postgres types.

## getTypes

<a id="get-types"></a>

> GET /types

```sh
curl -X GET https://pg-api.fly.dev/types \
  -H 'Content-Type: application/json' \
  -H 'pg: { "host": "DB_HOST", "password": "DB_PASSWORD" }'
```
```js
const data = await fetch('https://pg-api.fly.dev/types', {
  method: 'GET',
  headers: { 
    'pg': { "host": "DB_HOST", "password": "DB_PASSWORD" } 
  }
})
```

`GET /types`

*Get all Types*

> Parameters:
```javascript
/**
 * @param {boolean} [includeSystemSchemas=false] - Return system schemas as well as user schemas
 */
 ```
 > Returns: Types.Type[]
 ```javascript
{
  name: string
  format: string
  schema_name: string
  description: string
  size: string
  enums: string
}
```







<h1 id="pg-api-plugins">Plugins</h1>

View and manage your Postgres plugins.

## getPlugins

<a id="get-plugins"></a>

> GET /plugins

```sh
curl -X GET https://pg-api.fly.dev/plugins \
  -H 'Content-Type: application/json' \
  -H 'pg: { "host": "DB_HOST", "password": "DB_PASSWORD" }'
```
```js
const data = await fetch('https://pg-api.fly.dev/plugins', {
  method: 'GET',
  headers: { 
    'pg': { "host": "DB_HOST", "password": "DB_PASSWORD" } 
  }
})
```

`GET /plugins`

*Get all plugins*







<h1 id="pg-api-config">Config</h1>

View and manage your Postgres config.

## getConfig

<a id="config"></a>

> GET /config

```sh
curl -X GET https://pg-api.fly.dev/config \
  -H 'Content-Type: application/json' \
  -H 'pg: { "host": "DB_HOST", "password": "DB_PASSWORD" }'
```
```js
const data = await fetch('https://pg-api.fly.dev/config', {
  method: 'GET',
  headers: { 
    'pg': { "host": "DB_HOST", "password": "DB_PASSWORD" } 
  }
})
```

`GET /config`

Get your Postgres config.


## getVersion

<a id="config-version"></a>

> GET /config/version
```sh
curl -X GET https://pg-api.fly.dev/config/version \
  -H 'Content-Type: application/json' \
  -H 'pg: { "host": "DB_HOST", "password": "DB_PASSWORD" }'
```
```js
const data = await fetch('https://pg-api.fly.dev/config/version', {
  method: 'GET',
  headers: { 
    'pg': { "host": "DB_HOST", "password": "DB_PASSWORD" } 
  }
})
```

`GET /config/version`

Get your Postgres version information.





