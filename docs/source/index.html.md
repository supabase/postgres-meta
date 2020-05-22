---
title: Swagger Petstore v1.0.0
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
toc_footers:
  - <a href="https://mermade.github.io/shins/asyncapi.html">See AsyncAPI
    example</a>
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="swagger-pg-api">@supabase/pg-api</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Manage your PostgreSQL database using a RESTful API.




# Getting started


## Installation

```
@todo
```


## Authentication

Authentication is not provided. Make sure you use this inside a secure network or put your own API proxy in front.









<h1 id="swagger-pg-api-query">Query</h1>

Directly query your database. Send any SQL you want!

## query

<a id="opIdquery"></a>

> POST /query

```shell
curl -X POST http://localhost:1337/query \
  -H 'Content-Type: application/json' \
```

```http
POST http://localhost:1337/pet HTTP/1.1
Host: localhost:1337
Content-Type: application/json

```

```javascript

const data = await fetch('http://localhost:1337/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body // See body below
})
```

`POST /query`

*Execute an SQL query*

> BODY

```json
{
  "query": "SELECT * FROM your_table LIMIT 1;"
}
```

<h3 id="addpet-parameters">Parameters</h3>

|Name|Type|Required|Description|
|---|---|---|---|
|query|string|true|SQL string to execute|







<h1 id="swagger-pg-api-config">Config</h1>

Manage your Postgres config

## getConfig

<a id="opIdConfig"></a>

> GET /config

```shell
curl -X GET http://localhost:1337/config
```

```http
POST http://localhost:1337/config HTTP/1.1
```

```javascript

const data = await fetch('http://localhost:1337/config')
```

`GET /config`

*Get your Postgres version information*


## getVersion

<a id="opIdConfigVersion"></a>

> GET /config/version

```shell
curl -X GET http://localhost:1337/config/version
```

```http
POST http://localhost:1337/config/version HTTP/1.1
```

```javascript

const data = await fetch('http://localhost:1337/config/version')
```

`GET /config/version`

*Get your Postgres version information*





