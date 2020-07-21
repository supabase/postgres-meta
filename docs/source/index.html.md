---
title: Postgres API v0.0.0
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="postgres-api">Postgres API v0.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Manage your PostgreSQL database using a RESTful API.

This is still in early development, so most of the functionality is read-only.

The goal of this API is to enable the full management of a Postgres database using a RESTful interface. This includes adding tables, columns, roles, and users at runtime, as well as running ad-hoc queries.

Made by Supabase: https://supabase.io

# Getting started

## Usage

> Basic usage

```sh
curl -X GET http://localhost:1337/ \
-H 'Content-Type: application/json' \
-H 'X-Connection-Encrypted: ENCRYPTED_STRING'
```
```js
const data = await fetch('http://localhost:1337', {
method: 'GET',
headers: {
    'Content-Type': 'application/json',
    'X-Connection-Encrypted': 'ENCRYPTED_STRING'
}
})
```

For security reasons, this API is best self-hosted and set up with ENV_VARS with the default connection string.

If you want to use this with multiple Postgres instances, you can pass the connection string as a header but it must be encrypted.

## Self Hosting

```
https://github.com/supabase/pg-api
```

We support several different methods for self-hosting, detailed in the [repository](https://github.com/supabase/pg-api).

## Authentication

Authentication is not provided. Make sure you use this inside a secure network or behind a secure API proxy.

Email: <a href="mailto:support@supabase.io">Support</a> Web: <a href="https://github.com/supabase/pg-api/issues/new/choose">Support</a> 
License: <a href="https://www.apache.org/licenses/LICENSE-2.0.html">Apache 2.0</a>

<h1 id="postgres-api--config">/config</h1>

## Get all configs

<a id="opIdgetConfigs"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /config \
  -H 'Accept: application/json'

```

```http
GET /config HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/config',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/config',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/config', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/config', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/config");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/config", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /config`

> Example responses

> 200 Response

```json
[
  {
    "name": "string",
    "setting": "string",
    "category": "string",
    "group": "string",
    "subgroup": "string",
    "unit": "string",
    "short_desc": "string",
    "extra_desc": "string",
    "context": "string",
    "vartype": "string",
    "source": "string",
    "min_val": "string",
    "max_val": "string",
    "enumvals": [
      "string"
    ],
    "boot_val": "string",
    "reset_val": "string",
    "sourcefile": "string",
    "sourceline": 0,
    "pending_restart": true
  }
]
```

<h3 id="get-all-configs-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|Inline|

<h3 id="get-all-configs-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Config](#schemaconfig)]|false|none|none|
|» name|string|false|none|none|
|» setting|string|false|none|none|
|» category|string|false|none|none|
|» group|string|false|none|none|
|» subgroup|string|false|none|none|
|» unit|string¦null|false|none|none|
|» short_desc|string|false|none|none|
|» extra_desc|string¦null|false|none|none|
|» context|string|false|none|none|
|» vartype|string|false|none|none|
|» source|string|false|none|none|
|» min_val|string¦null|false|none|none|
|» max_val|string¦null|false|none|none|
|» enumvals|[string]¦null|false|none|none|
|» boot_val|string|false|none|none|
|» reset_val|string|false|none|none|
|» sourcefile|string¦null|false|none|none|
|» sourceline|integer¦null|false|none|none|
|» pending_restart|boolean|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="postgres-api--config-version">/config/version</h1>

## Get version

<a id="opIdgetVersion"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /config/version \
  -H 'Accept: application/json'

```

```http
GET /config/version HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/config/version',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/config/version',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/config/version', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/config/version', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/config/version");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/config/version", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /config/version`

> Example responses

> 200 Response

```json
{
  "version": "string",
  "version_number": 0,
  "active_connections": 0,
  "max_connections": 0
}
```

<h3 id="get-version-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Version](#schemaversion)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="postgres-api--query">/query</h1>

## Make a query

<a id="opIdquery"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /query \
  -H 'Accept: application/json'

```

```http
POST /query HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/query',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.post '/query',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.post('/query', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/query', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/query");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/query", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /query`

> Example responses

> 200 Response

```json
[
  {}
]
```

<h3 id="make-a-query-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|Inline|

<h3 id="make-a-query-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="postgres-api--columns">/columns</h1>

## Get all columns

<a id="opIdgetColumns"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /columns \
  -H 'Accept: application/json'

```

```http
GET /columns HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/columns',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/columns',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/columns', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/columns', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/columns");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/columns", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /columns`

<h3 id="get-all-columns-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|include_system_schemas|query|boolean|false|none|

> Example responses

> 200 Response

```json
[
  {
    "table_id": 0,
    "schema": "string",
    "table": "string",
    "id": "string",
    "ordinal_position": 0,
    "name": "string",
    "default_value": "string",
    "data_type": "string",
    "format": "string",
    "description": "string",
    "is_identity": true,
    "identity_generation": "string",
    "is_nullable": true,
    "is_updatable": true,
    "enums": [
      "string"
    ]
  }
]
```

<h3 id="get-all-columns-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|Inline|

<h3 id="get-all-columns-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Column](#schemacolumn)]|false|none|none|
|» table_id|integer|false|none|none|
|» schema|string|false|none|none|
|» table|string|false|none|none|
|» id|string|false|none|none|
|» ordinal_position|integer|false|none|none|
|» name|string|false|none|none|
|» default_value|string|false|none|none|
|» data_type|string|false|none|none|
|» format|string|false|none|none|
|» description|string|false|none|none|
|» is_identity|boolean|false|none|none|
|» identity_generation|string|false|none|none|
|» is_nullable|boolean|false|none|none|
|» is_updatable|boolean|false|none|none|
|» enums|[string]|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## Add a column

<a id="opIdcreateColumn"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /columns \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST /columns HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "name": "string",
  "table_id": 0,
  "type": "string",
  "default_value": "string",
  "is_identity": true,
  "is_nullable": true,
  "is_primary_key": true,
  "is_unique": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/columns',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post '/columns',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('/columns', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/columns', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/columns");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/columns", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /columns`

> Body parameter

```json
{
  "name": "string",
  "table_id": 0,
  "type": "string",
  "default_value": "string",
  "is_identity": true,
  "is_nullable": true,
  "is_primary_key": true,
  "is_unique": true
}
```

<h3 id="add-a-column-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» name|body|string|true|none|
|» table_id|body|integer|true|none|
|» type|body|string|true|none|
|» default_value|body|string|false|none|
|» is_identity|body|boolean|false|none|
|» is_nullable|body|boolean|false|none|
|» is_primary_key|body|boolean|false|none|
|» is_unique|body|boolean|false|none|

> Example responses

> 200 Response

```json
{
  "table_id": 0,
  "schema": "string",
  "table": "string",
  "id": "string",
  "ordinal_position": 0,
  "name": "string",
  "default_value": "string",
  "data_type": "string",
  "format": "string",
  "description": "string",
  "is_identity": true,
  "identity_generation": "string",
  "is_nullable": true,
  "is_updatable": true,
  "enums": [
    "string"
  ]
}
```

<h3 id="add-a-column-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Column](#schemacolumn)|

<aside class="success">
This operation does not require authentication
</aside>

## Update a column by ID

<a id="opIdupdateColumn"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH /columns/{id} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
PATCH /columns/{id} HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "name": "string",
  "type": "string",
  "drop_default": true,
  "default_value": "string",
  "is_nullable": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/columns/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.patch '/columns/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.patch('/columns/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','/columns/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/columns/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "/columns/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /columns/{id}`

> Body parameter

```json
{
  "name": "string",
  "type": "string",
  "drop_default": true,
  "default_value": "string",
  "is_nullable": true
}
```

<h3 id="update-a-column-by-id-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» name|body|string|false|none|
|» type|body|string|false|none|
|» drop_default|body|boolean|false|none|
|» default_value|body|string|false|none|
|» is_nullable|body|boolean|false|none|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "table_id": 0,
  "schema": "string",
  "table": "string",
  "id": "string",
  "ordinal_position": 0,
  "name": "string",
  "default_value": "string",
  "data_type": "string",
  "format": "string",
  "description": "string",
  "is_identity": true,
  "identity_generation": "string",
  "is_nullable": true,
  "is_updatable": true,
  "enums": [
    "string"
  ]
}
```

<h3 id="update-a-column-by-id-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Column](#schemacolumn)|

<aside class="success">
This operation does not require authentication
</aside>

## Delete a column by ID

<a id="opIddeleteColumn"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE /columns/{id} \
  -H 'Accept: application/json'

```

```http
DELETE /columns/{id} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/columns/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.delete '/columns/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.delete('/columns/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','/columns/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/columns/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "/columns/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /columns/{id}`

<h3 id="delete-a-column-by-id-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "table_id": 0,
  "schema": "string",
  "table": "string",
  "id": "string",
  "ordinal_position": 0,
  "name": "string",
  "default_value": "string",
  "data_type": "string",
  "format": "string",
  "description": "string",
  "is_identity": true,
  "identity_generation": "string",
  "is_nullable": true,
  "is_updatable": true,
  "enums": [
    "string"
  ]
}
```

<h3 id="delete-a-column-by-id-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Column](#schemacolumn)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="postgres-api--extensions">/extensions</h1>

## Get all extensions

<a id="opIdgetExtensions"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /extensions \
  -H 'Accept: application/json'

```

```http
GET /extensions HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/extensions',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/extensions',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/extensions', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/extensions', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/extensions");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/extensions", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /extensions`

> Example responses

> 200 Response

```json
[
  {
    "name": "string",
    "comment": "string",
    "default_version": "string",
    "installed_version": "string"
  }
]
```

<h3 id="get-all-extensions-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|Inline|

<h3 id="get-all-extensions-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Extension](#schemaextension)]|false|none|none|
|» name|string|false|none|none|
|» comment|string|false|none|none|
|» default_version|string|false|none|none|
|» installed_version|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## Install an extension

<a id="opIdcreateExtension"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /extensions \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST /extensions HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "name": "string",
  "schema": "string",
  "version": "string",
  "cascade": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/extensions',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post '/extensions',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('/extensions', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/extensions', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/extensions");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/extensions", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /extensions`

> Body parameter

```json
{
  "name": "string",
  "schema": "string",
  "version": "string",
  "cascade": true
}
```

<h3 id="install-an-extension-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» name|body|string|true|none|
|» schema|body|string|false|none|
|» version|body|string|false|none|
|» cascade|body|boolean|false|none|

> Example responses

> 200 Response

```json
{
  "name": "string",
  "comment": "string",
  "default_version": "string",
  "installed_version": "string"
}
```

<h3 id="install-an-extension-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Extension](#schemaextension)|

<aside class="success">
This operation does not require authentication
</aside>

## Update/modify an extension by ID

<a id="opIdupdateExtension"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH /extensions/{id} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
PATCH /extensions/{id} HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "update": true,
  "version": "string",
  "schema": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/extensions/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.patch '/extensions/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.patch('/extensions/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','/extensions/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/extensions/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "/extensions/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /extensions/{id}`

> Body parameter

```json
{
  "update": true,
  "version": "string",
  "schema": "string"
}
```

<h3 id="update/modify-an-extension-by-id-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» update|body|boolean|false|none|
|» version|body|string|false|none|
|» schema|body|string|false|none|
|id|path|integer|true|none|

> Example responses

> 200 Response

```json
{
  "name": "string",
  "comment": "string",
  "default_version": "string",
  "installed_version": "string"
}
```

<h3 id="update/modify-an-extension-by-id-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Extension](#schemaextension)|

<aside class="success">
This operation does not require authentication
</aside>

## Uninstall an extension by ID

<a id="opIddeleteExtension"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE /extensions/{id} \
  -H 'Accept: application/json'

```

```http
DELETE /extensions/{id} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/extensions/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.delete '/extensions/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.delete('/extensions/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','/extensions/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/extensions/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "/extensions/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /extensions/{id}`

<h3 id="uninstall-an-extension-by-id-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|none|

> Example responses

> 200 Response

```json
{
  "name": "string",
  "comment": "string",
  "default_version": "string",
  "installed_version": "string"
}
```

<h3 id="uninstall-an-extension-by-id-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Extension](#schemaextension)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="postgres-api--functions">/functions</h1>

## Get all functions

<a id="opIdgetFunctions"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /functions \
  -H 'Accept: application/json'

```

```http
GET /functions HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/functions',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/functions',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/functions', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/functions', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/functions");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/functions", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /functions`

<h3 id="get-all-functions-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|include_system_schemas|query|boolean|false|none|

> Example responses

> 200 Response

```json
[
  {
    "id": 0,
    "schema": "string",
    "name": "string",
    "language": "string",
    "definition": "string",
    "argument_types": "string",
    "return_type": "string"
  }
]
```

<h3 id="get-all-functions-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|Inline|

<h3 id="get-all-functions-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Function](#schemafunction)]|false|none|none|
|» id|integer|false|none|none|
|» schema|string|false|none|none|
|» name|string|false|none|none|
|» language|string|false|none|none|
|» definition|string|false|none|none|
|» argument_types|string|false|none|none|
|» return_type|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="postgres-api--policies">/policies</h1>

## Get all policies

<a id="opIdgetPolicies"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /policies \
  -H 'Accept: application/json'

```

```http
GET /policies HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/policies',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/policies',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/policies', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/policies', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/policies");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/policies", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /policies`

<h3 id="get-all-policies-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|include_system_schemas|query|boolean|false|none|

> Example responses

> 200 Response

```json
[
  {
    "id": 0,
    "name": "string",
    "schema": "string",
    "table": "string",
    "table_id": 0,
    "action": "PERMISSIVE",
    "roles": [
      "string"
    ],
    "command": "string",
    "definition": "string",
    "check": "string"
  }
]
```

<h3 id="get-all-policies-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|Inline|

<h3 id="get-all-policies-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Policy](#schemapolicy)]|false|none|none|
|» id|integer|false|none|none|
|» name|string|false|none|none|
|» schema|string|false|none|none|
|» table|string|false|none|none|
|» table_id|integer|false|none|none|
|» action|string|false|none|none|
|» roles|[string]|false|none|none|
|» command|string|false|none|none|
|» definition|string|false|none|none|
|» check|string¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|action|PERMISSIVE|
|action|RESTRICTIVE|

<aside class="success">
This operation does not require authentication
</aside>

## Create a policy

<a id="opIdcreatePolicy"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /policies \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST /policies HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "name": "string",
  "schema": "string",
  "table": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/policies',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post '/policies',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('/policies', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/policies', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/policies");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/policies", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /policies`

> Body parameter

```json
{
  "name": "string",
  "schema": "string",
  "table": "string"
}
```

<h3 id="create-a-policy-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» name|body|string|true|none|
|» schema|body|string|false|none|
|» table|body|string|true|none|

> Example responses

> 200 Response

```json
{
  "id": 0,
  "name": "string",
  "schema": "string",
  "table": "string",
  "table_id": 0,
  "action": "PERMISSIVE",
  "roles": [
    "string"
  ],
  "command": "string",
  "definition": "string",
  "check": "string"
}
```

<h3 id="create-a-policy-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Policy](#schemapolicy)|

<aside class="success">
This operation does not require authentication
</aside>

## Update a policy by ID

<a id="opIdupdatePolicy"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH /policies/{id} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
PATCH /policies/{id} HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "name": "string",
  "schema": "string",
  "table": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/policies/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.patch '/policies/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.patch('/policies/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','/policies/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/policies/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "/policies/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /policies/{id}`

> Body parameter

```json
{
  "name": "string",
  "schema": "string",
  "table": "string"
}
```

<h3 id="update-a-policy-by-id-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» name|body|string|false|none|
|» schema|body|string|false|none|
|» table|body|string|false|none|
|id|path|integer|true|none|

> Example responses

> 200 Response

```json
{
  "id": 0,
  "name": "string",
  "schema": "string",
  "table": "string",
  "table_id": 0,
  "action": "PERMISSIVE",
  "roles": [
    "string"
  ],
  "command": "string",
  "definition": "string",
  "check": "string"
}
```

<h3 id="update-a-policy-by-id-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Policy](#schemapolicy)|

<aside class="success">
This operation does not require authentication
</aside>

## Delete a policy by ID

<a id="opIddeletePolicy"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE /policies/{id} \
  -H 'Accept: application/json'

```

```http
DELETE /policies/{id} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/policies/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.delete '/policies/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.delete('/policies/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','/policies/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/policies/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "/policies/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /policies/{id}`

<h3 id="delete-a-policy-by-id-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|none|

> Example responses

> 200 Response

```json
{
  "id": 0,
  "name": "string",
  "schema": "string",
  "table": "string",
  "table_id": 0,
  "action": "PERMISSIVE",
  "roles": [
    "string"
  ],
  "command": "string",
  "definition": "string",
  "check": "string"
}
```

<h3 id="delete-a-policy-by-id-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Policy](#schemapolicy)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="postgres-api--roles">/roles</h1>

## Get all roles

<a id="opIdgetRoles"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /roles \
  -H 'Accept: application/json'

```

```http
GET /roles HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/roles',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/roles',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/roles', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/roles', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/roles");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/roles", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /roles`

<h3 id="get-all-roles-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|include_system_schemas|query|boolean|false|none|

> Example responses

> 200 Response

```json
[
  {
    "id": 0,
    "name": "string",
    "is_superuser": true,
    "can_create_db": true,
    "can_create_role": true,
    "inherit_role": true,
    "can_login": true,
    "is_replication_role": true,
    "can_bypass_rls": true,
    "active_connections": 0,
    "connection_limit": 0,
    "password": "string",
    "valid_until": "string",
    "config": "string",
    "grants": [
      {
        "table_id": 0,
        "grantor": "string",
        "grantee": "string",
        "catalog": "string",
        "schema": "string",
        "table_name": "string",
        "privilege_type": "string",
        "is_grantable": true,
        "with_hierarchy": true
      }
    ]
  }
]
```

<h3 id="get-all-roles-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|Inline|

<h3 id="get-all-roles-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Role](#schemarole)]|false|none|none|
|» id|integer|false|none|none|
|» name|string|false|none|none|
|» is_superuser|boolean|false|none|none|
|» can_create_db|boolean|false|none|none|
|» can_create_role|boolean|false|none|none|
|» inherit_role|boolean|false|none|none|
|» can_login|boolean|false|none|none|
|» is_replication_role|boolean|false|none|none|
|» can_bypass_rls|boolean|false|none|none|
|» active_connections|integer|false|none|none|
|» connection_limit|integer|false|none|none|
|» password|string|false|none|none|
|» valid_until|string¦null|false|none|none|
|» config|string¦null|false|none|none|
|» grants|[[Grant](#schemagrant)]|false|none|none|
|»» table_id|integer|false|none|none|
|»» grantor|string|false|none|none|
|»» grantee|string|false|none|none|
|»» catalog|string|false|none|none|
|»» schema|string|false|none|none|
|»» table_name|string|false|none|none|
|»» privilege_type|string|false|none|none|
|»» is_grantable|boolean|false|none|none|
|»» with_hierarchy|boolean|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## Create a role

<a id="opIdcreateRole"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /roles \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST /roles HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "name": "string",
  "is_superuser": true,
  "can_create_db": true,
  "can_create_role": true,
  "inherit_role": true,
  "can_login": true,
  "is_replication_role": true,
  "can_bypass_rls": true,
  "connection_limit": 0,
  "password": "string",
  "valid_until": "string",
  "member_of": [
    "string"
  ],
  "members": [
    "string"
  ],
  "admins": [
    "string"
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/roles',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post '/roles',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('/roles', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/roles', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/roles");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/roles", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /roles`

> Body parameter

```json
{
  "name": "string",
  "is_superuser": true,
  "can_create_db": true,
  "can_create_role": true,
  "inherit_role": true,
  "can_login": true,
  "is_replication_role": true,
  "can_bypass_rls": true,
  "connection_limit": 0,
  "password": "string",
  "valid_until": "string",
  "member_of": [
    "string"
  ],
  "members": [
    "string"
  ],
  "admins": [
    "string"
  ]
}
```

<h3 id="create-a-role-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» name|body|string|true|none|
|» is_superuser|body|boolean|false|none|
|» can_create_db|body|boolean|false|none|
|» can_create_role|body|boolean|false|none|
|» inherit_role|body|boolean|false|none|
|» can_login|body|boolean|false|none|
|» is_replication_role|body|boolean|false|none|
|» can_bypass_rls|body|boolean|false|none|
|» connection_limit|body|integer|false|none|
|» password|body|string|false|none|
|» valid_until|body|string|false|none|
|» member_of|body|[string]|false|none|
|» members|body|[string]|false|none|
|» admins|body|[string]|false|none|

> Example responses

> 200 Response

```json
{
  "id": 0,
  "name": "string",
  "is_superuser": true,
  "can_create_db": true,
  "can_create_role": true,
  "inherit_role": true,
  "can_login": true,
  "is_replication_role": true,
  "can_bypass_rls": true,
  "active_connections": 0,
  "connection_limit": 0,
  "password": "string",
  "valid_until": "string",
  "config": "string",
  "grants": [
    {
      "table_id": 0,
      "grantor": "string",
      "grantee": "string",
      "catalog": "string",
      "schema": "string",
      "table_name": "string",
      "privilege_type": "string",
      "is_grantable": true,
      "with_hierarchy": true
    }
  ]
}
```

<h3 id="create-a-role-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Role](#schemarole)|

<aside class="success">
This operation does not require authentication
</aside>

## Update a role by ID

<a id="opIdupdateRole"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH /roles/{id} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
PATCH /roles/{id} HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "name": "string",
  "is_superuser": true,
  "can_create_db": true,
  "can_create_role": true,
  "inherit_role": true,
  "can_login": true,
  "is_replication_role": true,
  "can_bypass_rls": true,
  "connection_limit": 0,
  "password": "string",
  "valid_until": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/roles/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.patch '/roles/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.patch('/roles/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','/roles/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/roles/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "/roles/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /roles/{id}`

> Body parameter

```json
{
  "name": "string",
  "is_superuser": true,
  "can_create_db": true,
  "can_create_role": true,
  "inherit_role": true,
  "can_login": true,
  "is_replication_role": true,
  "can_bypass_rls": true,
  "connection_limit": 0,
  "password": "string",
  "valid_until": "string"
}
```

<h3 id="update-a-role-by-id-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» name|body|string|false|none|
|» is_superuser|body|boolean|false|none|
|» can_create_db|body|boolean|false|none|
|» can_create_role|body|boolean|false|none|
|» inherit_role|body|boolean|false|none|
|» can_login|body|boolean|false|none|
|» is_replication_role|body|boolean|false|none|
|» can_bypass_rls|body|boolean|false|none|
|» connection_limit|body|integer|false|none|
|» password|body|string|false|none|
|» valid_until|body|string|false|none|
|id|path|integer|true|none|

> Example responses

> 200 Response

```json
{
  "id": 0,
  "name": "string",
  "is_superuser": true,
  "can_create_db": true,
  "can_create_role": true,
  "inherit_role": true,
  "can_login": true,
  "is_replication_role": true,
  "can_bypass_rls": true,
  "active_connections": 0,
  "connection_limit": 0,
  "password": "string",
  "valid_until": "string",
  "config": "string",
  "grants": [
    {
      "table_id": 0,
      "grantor": "string",
      "grantee": "string",
      "catalog": "string",
      "schema": "string",
      "table_name": "string",
      "privilege_type": "string",
      "is_grantable": true,
      "with_hierarchy": true
    }
  ]
}
```

<h3 id="update-a-role-by-id-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Role](#schemarole)|

<aside class="success">
This operation does not require authentication
</aside>

## Delete a role by ID

<a id="opIddeleteRole"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE /roles/{id} \
  -H 'Accept: application/json'

```

```http
DELETE /roles/{id} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/roles/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.delete '/roles/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.delete('/roles/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','/roles/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/roles/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "/roles/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /roles/{id}`

<h3 id="delete-a-role-by-id-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|none|

> Example responses

> 200 Response

```json
{
  "id": 0,
  "name": "string",
  "is_superuser": true,
  "can_create_db": true,
  "can_create_role": true,
  "inherit_role": true,
  "can_login": true,
  "is_replication_role": true,
  "can_bypass_rls": true,
  "active_connections": 0,
  "connection_limit": 0,
  "password": "string",
  "valid_until": "string",
  "config": "string",
  "grants": [
    {
      "table_id": 0,
      "grantor": "string",
      "grantee": "string",
      "catalog": "string",
      "schema": "string",
      "table_name": "string",
      "privilege_type": "string",
      "is_grantable": true,
      "with_hierarchy": true
    }
  ]
}
```

<h3 id="delete-a-role-by-id-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Role](#schemarole)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="postgres-api--schemas">/schemas</h1>

## Get all schemas

<a id="opIdgetSchemas"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /schemas \
  -H 'Accept: application/json'

```

```http
GET /schemas HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/schemas',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/schemas',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/schemas', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/schemas', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/schemas");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/schemas", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /schemas`

<h3 id="get-all-schemas-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|include_system_schemas|query|boolean|false|none|

> Example responses

> 200 Response

```json
[
  {
    "id": 0,
    "catalog_name": "string",
    "name": "string",
    "owner": "string",
    "default_character_set_catalog": "string",
    "default_character_set_schema": "string",
    "default_character_set_name": "string",
    "sql_path": "string"
  }
]
```

<h3 id="get-all-schemas-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|Inline|

<h3 id="get-all-schemas-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Schema](#schemaschema)]|false|none|none|
|» id|integer|false|none|none|
|» catalog_name|string|false|none|none|
|» name|string|false|none|none|
|» owner|string|false|none|none|
|» default_character_set_catalog|string¦null|false|none|none|
|» default_character_set_schema|string¦null|false|none|none|
|» default_character_set_name|string¦null|false|none|none|
|» sql_path|string¦null|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## Create a schema

<a id="opIdcreateSchema"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /schemas \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST /schemas HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "name": "string",
  "owner": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/schemas',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post '/schemas',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('/schemas', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/schemas', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/schemas");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/schemas", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /schemas`

> Body parameter

```json
{
  "name": "string",
  "owner": "string"
}
```

<h3 id="create-a-schema-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» name|body|string|true|none|
|» owner|body|string|true|none|

> Example responses

> 200 Response

```json
{
  "id": 0,
  "catalog_name": "string",
  "name": "string",
  "owner": "string",
  "default_character_set_catalog": "string",
  "default_character_set_schema": "string",
  "default_character_set_name": "string",
  "sql_path": "string"
}
```

<h3 id="create-a-schema-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Schema](#schemaschema)|

<aside class="success">
This operation does not require authentication
</aside>

## Update a schema by ID

<a id="opIdupdateSchema"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH /schemas/{id} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
PATCH /schemas/{id} HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "name": "string",
  "owner": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/schemas/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.patch '/schemas/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.patch('/schemas/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','/schemas/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/schemas/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "/schemas/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /schemas/{id}`

> Body parameter

```json
{
  "name": "string",
  "owner": "string"
}
```

<h3 id="update-a-schema-by-id-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» name|body|string|false|none|
|» owner|body|string|false|none|
|id|path|integer|true|none|

> Example responses

> 200 Response

```json
{
  "id": 0,
  "catalog_name": "string",
  "name": "string",
  "owner": "string",
  "default_character_set_catalog": "string",
  "default_character_set_schema": "string",
  "default_character_set_name": "string",
  "sql_path": "string"
}
```

<h3 id="update-a-schema-by-id-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Schema](#schemaschema)|

<aside class="success">
This operation does not require authentication
</aside>

## Delete a schema by ID

<a id="opIddeleteSchema"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE /schemas/{id} \
  -H 'Accept: application/json'

```

```http
DELETE /schemas/{id} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/schemas/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.delete '/schemas/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.delete('/schemas/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','/schemas/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/schemas/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "/schemas/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /schemas/{id}`

<h3 id="delete-a-schema-by-id-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|none|

> Example responses

> 200 Response

```json
{
  "id": 0,
  "catalog_name": "string",
  "name": "string",
  "owner": "string",
  "default_character_set_catalog": "string",
  "default_character_set_schema": "string",
  "default_character_set_name": "string",
  "sql_path": "string"
}
```

<h3 id="delete-a-schema-by-id-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Schema](#schemaschema)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="postgres-api--tables">/tables</h1>

## Get all tables

<a id="opIdgetTables"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /tables \
  -H 'Accept: application/json'

```

```http
GET /tables HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tables',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/tables',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/tables', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/tables', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/tables");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/tables", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /tables`

<h3 id="get-all-tables-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|include_system_schemas|query|boolean|false|none|

> Example responses

> 200 Response

```json
[
  {
    "id": 0,
    "catalog": "string",
    "schema": "string",
    "name": "string",
    "is_insertable_into": true,
    "rls_enabled": true,
    "rls_forced": true,
    "is_typed": true,
    "bytes": 0,
    "size": "string",
    "seq_scan_count": 0,
    "seq_row_read_count": 0,
    "idx_scan_count": 0,
    "idx_row_read_count": 0,
    "row_ins_count": 0,
    "row_upd_count": 0,
    "row_del_count": 0,
    "row_hot_upd_count": 0,
    "live_row_count": 0,
    "dead_row_count": 0,
    "rows_mod_since_analyze": 0,
    "last_vacuum": "string",
    "last_autovacuum": "string",
    "last_analyze": "string",
    "last_autoanalyze": "string",
    "vacuum_count": 0,
    "autovacuum_count": 0,
    "analyze_count": 0,
    "autoanalyze_count": 0,
    "columns": [
      {
        "table_id": 0,
        "schema": "string",
        "table": "string",
        "id": "string",
        "ordinal_position": 0,
        "name": "string",
        "default_value": "string",
        "data_type": "string",
        "format": "string",
        "description": "string",
        "is_identity": true,
        "identity_generation": "string",
        "is_nullable": true,
        "is_updatable": true,
        "enums": [
          "string"
        ]
      }
    ],
    "grants": [
      {
        "table_id": 0,
        "grantor": "string",
        "grantee": "string",
        "catalog": "string",
        "schema": "string",
        "table_name": "string",
        "privilege_type": "string",
        "is_grantable": true,
        "with_hierarchy": true
      }
    ],
    "policies": [
      {
        "id": 0,
        "name": "string",
        "schema": "string",
        "table": "string",
        "table_id": 0,
        "action": "PERMISSIVE",
        "roles": [
          "string"
        ],
        "command": "string",
        "definition": "string",
        "check": "string"
      }
    ],
    "primary_keys": [
      {
        "schema": "string",
        "table_name": "string",
        "name": "string",
        "table_id": 0
      }
    ],
    "relationships": [
      {
        "source_schema": "string",
        "source_table_name": "string",
        "source_column_name": "string",
        "target_table_schema": "string",
        "target_table_name": "string",
        "target_column_name": "string",
        "constraint_name": "string"
      }
    ]
  }
]
```

<h3 id="get-all-tables-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|Inline|

<h3 id="get-all-tables-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Table](#schematable)]|false|none|none|
|» id|integer|false|none|none|
|» catalog|string|false|none|none|
|» schema|string|false|none|none|
|» name|string|false|none|none|
|» is_insertable_into|boolean|false|none|none|
|» rls_enabled|boolean|false|none|none|
|» rls_forced|boolean|false|none|none|
|» is_typed|boolean|false|none|none|
|» bytes|integer|false|none|none|
|» size|string|false|none|none|
|» seq_scan_count|integer|false|none|none|
|» seq_row_read_count|integer|false|none|none|
|» idx_scan_count|integer|false|none|none|
|» idx_row_read_count|integer|false|none|none|
|» row_ins_count|integer|false|none|none|
|» row_upd_count|integer|false|none|none|
|» row_del_count|integer|false|none|none|
|» row_hot_upd_count|integer|false|none|none|
|» live_row_count|integer|false|none|none|
|» dead_row_count|integer|false|none|none|
|» rows_mod_since_analyze|integer|false|none|none|
|» last_vacuum|string¦null|false|none|none|
|» last_autovacuum|string¦null|false|none|none|
|» last_analyze|string¦null|false|none|none|
|» last_autoanalyze|string¦null|false|none|none|
|» vacuum_count|integer|false|none|none|
|» autovacuum_count|integer|false|none|none|
|» analyze_count|integer|false|none|none|
|» autoanalyze_count|integer|false|none|none|
|» columns|[[Column](#schemacolumn)]|false|none|none|
|»» table_id|integer|false|none|none|
|»» schema|string|false|none|none|
|»» table|string|false|none|none|
|»» id|string|false|none|none|
|»» ordinal_position|integer|false|none|none|
|»» name|string|false|none|none|
|»» default_value|string|false|none|none|
|»» data_type|string|false|none|none|
|»» format|string|false|none|none|
|»» description|string|false|none|none|
|»» is_identity|boolean|false|none|none|
|»» identity_generation|string|false|none|none|
|»» is_nullable|boolean|false|none|none|
|»» is_updatable|boolean|false|none|none|
|»» enums|[string]|false|none|none|
|» grants|[[Grant](#schemagrant)]|false|none|none|
|»» table_id|integer|false|none|none|
|»» grantor|string|false|none|none|
|»» grantee|string|false|none|none|
|»» catalog|string|false|none|none|
|»» schema|string|false|none|none|
|»» table_name|string|false|none|none|
|»» privilege_type|string|false|none|none|
|»» is_grantable|boolean|false|none|none|
|»» with_hierarchy|boolean|false|none|none|
|» policies|[[Policy](#schemapolicy)]|false|none|none|
|»» id|integer|false|none|none|
|»» name|string|false|none|none|
|»» schema|string|false|none|none|
|»» table|string|false|none|none|
|»» table_id|integer|false|none|none|
|»» action|string|false|none|none|
|»» roles|[string]|false|none|none|
|»» command|string|false|none|none|
|»» definition|string|false|none|none|
|»» check|string¦null|false|none|none|
|» primary_keys|[object]|false|none|none|
|»» schema|string|false|none|none|
|»» table_name|string|false|none|none|
|»» name|string|false|none|none|
|»» table_id|integer|false|none|none|
|» relationships|[object]|false|none|none|
|»» source_schema|string|false|none|none|
|»» source_table_name|string|false|none|none|
|»» source_column_name|string|false|none|none|
|»» target_table_schema|string|false|none|none|
|»» target_table_name|string|false|none|none|
|»» target_column_name|string|false|none|none|
|»» constraint_name|string|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|action|PERMISSIVE|
|action|RESTRICTIVE|

<aside class="success">
This operation does not require authentication
</aside>

## Create a table

<a id="opIdcreateTable"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /tables \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST /tables HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "name": "string",
  "schema": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tables',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post '/tables',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('/tables', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/tables', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/tables");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/tables", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /tables`

> Body parameter

```json
{
  "name": "string",
  "schema": "string"
}
```

<h3 id="create-a-table-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» name|body|string|true|none|
|» schema|body|string|false|none|

> Example responses

> 200 Response

```json
{
  "id": 0,
  "catalog": "string",
  "schema": "string",
  "name": "string",
  "is_insertable_into": true,
  "rls_enabled": true,
  "rls_forced": true,
  "is_typed": true,
  "bytes": 0,
  "size": "string",
  "seq_scan_count": 0,
  "seq_row_read_count": 0,
  "idx_scan_count": 0,
  "idx_row_read_count": 0,
  "row_ins_count": 0,
  "row_upd_count": 0,
  "row_del_count": 0,
  "row_hot_upd_count": 0,
  "live_row_count": 0,
  "dead_row_count": 0,
  "rows_mod_since_analyze": 0,
  "last_vacuum": "string",
  "last_autovacuum": "string",
  "last_analyze": "string",
  "last_autoanalyze": "string",
  "vacuum_count": 0,
  "autovacuum_count": 0,
  "analyze_count": 0,
  "autoanalyze_count": 0,
  "columns": [
    {
      "table_id": 0,
      "schema": "string",
      "table": "string",
      "id": "string",
      "ordinal_position": 0,
      "name": "string",
      "default_value": "string",
      "data_type": "string",
      "format": "string",
      "description": "string",
      "is_identity": true,
      "identity_generation": "string",
      "is_nullable": true,
      "is_updatable": true,
      "enums": [
        "string"
      ]
    }
  ],
  "grants": [
    {
      "table_id": 0,
      "grantor": "string",
      "grantee": "string",
      "catalog": "string",
      "schema": "string",
      "table_name": "string",
      "privilege_type": "string",
      "is_grantable": true,
      "with_hierarchy": true
    }
  ],
  "policies": [
    {
      "id": 0,
      "name": "string",
      "schema": "string",
      "table": "string",
      "table_id": 0,
      "action": "PERMISSIVE",
      "roles": [
        "string"
      ],
      "command": "string",
      "definition": "string",
      "check": "string"
    }
  ],
  "primary_keys": [
    {
      "schema": "string",
      "table_name": "string",
      "name": "string",
      "table_id": 0
    }
  ],
  "relationships": [
    {
      "source_schema": "string",
      "source_table_name": "string",
      "source_column_name": "string",
      "target_table_schema": "string",
      "target_table_name": "string",
      "target_column_name": "string",
      "constraint_name": "string"
    }
  ]
}
```

<h3 id="create-a-table-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Table](#schematable)|

<aside class="success">
This operation does not require authentication
</aside>

## Update a table by ID

<a id="opIdupdateTable"></a>

> Code samples

```shell
# You can also use wget
curl -X PATCH /tables/{id} \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
PATCH /tables/{id} HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "schema": "string",
  "name": "string",
  "rls_enabled": true,
  "rls_forced": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/tables/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.patch '/tables/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.patch('/tables/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('PATCH','/tables/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/tables/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("PATCH");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("PATCH", "/tables/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`PATCH /tables/{id}`

> Body parameter

```json
{
  "schema": "string",
  "name": "string",
  "rls_enabled": true,
  "rls_forced": true
}
```

<h3 id="update-a-table-by-id-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» schema|body|string|false|none|
|» name|body|string|false|none|
|» rls_enabled|body|boolean|false|none|
|» rls_forced|body|boolean|false|none|
|id|path|integer|true|none|

> Example responses

> 200 Response

```json
{
  "id": 0,
  "catalog": "string",
  "schema": "string",
  "name": "string",
  "is_insertable_into": true,
  "rls_enabled": true,
  "rls_forced": true,
  "is_typed": true,
  "bytes": 0,
  "size": "string",
  "seq_scan_count": 0,
  "seq_row_read_count": 0,
  "idx_scan_count": 0,
  "idx_row_read_count": 0,
  "row_ins_count": 0,
  "row_upd_count": 0,
  "row_del_count": 0,
  "row_hot_upd_count": 0,
  "live_row_count": 0,
  "dead_row_count": 0,
  "rows_mod_since_analyze": 0,
  "last_vacuum": "string",
  "last_autovacuum": "string",
  "last_analyze": "string",
  "last_autoanalyze": "string",
  "vacuum_count": 0,
  "autovacuum_count": 0,
  "analyze_count": 0,
  "autoanalyze_count": 0,
  "columns": [
    {
      "table_id": 0,
      "schema": "string",
      "table": "string",
      "id": "string",
      "ordinal_position": 0,
      "name": "string",
      "default_value": "string",
      "data_type": "string",
      "format": "string",
      "description": "string",
      "is_identity": true,
      "identity_generation": "string",
      "is_nullable": true,
      "is_updatable": true,
      "enums": [
        "string"
      ]
    }
  ],
  "grants": [
    {
      "table_id": 0,
      "grantor": "string",
      "grantee": "string",
      "catalog": "string",
      "schema": "string",
      "table_name": "string",
      "privilege_type": "string",
      "is_grantable": true,
      "with_hierarchy": true
    }
  ],
  "policies": [
    {
      "id": 0,
      "name": "string",
      "schema": "string",
      "table": "string",
      "table_id": 0,
      "action": "PERMISSIVE",
      "roles": [
        "string"
      ],
      "command": "string",
      "definition": "string",
      "check": "string"
    }
  ],
  "primary_keys": [
    {
      "schema": "string",
      "table_name": "string",
      "name": "string",
      "table_id": 0
    }
  ],
  "relationships": [
    {
      "source_schema": "string",
      "source_table_name": "string",
      "source_column_name": "string",
      "target_table_schema": "string",
      "target_table_name": "string",
      "target_column_name": "string",
      "constraint_name": "string"
    }
  ]
}
```

<h3 id="update-a-table-by-id-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Table](#schematable)|

<aside class="success">
This operation does not require authentication
</aside>

## Delete a table by ID

<a id="opIddeleteTable"></a>

> Code samples

```shell
# You can also use wget
curl -X DELETE /tables/{id} \
  -H 'Accept: application/json'

```

```http
DELETE /tables/{id} HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/tables/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.delete '/tables/{id}',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.delete('/tables/{id}', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('DELETE','/tables/{id}', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/tables/{id}");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("DELETE");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("DELETE", "/tables/{id}", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`DELETE /tables/{id}`

<h3 id="delete-a-table-by-id-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|integer|true|none|

> Example responses

> 200 Response

```json
{
  "id": 0,
  "catalog": "string",
  "schema": "string",
  "name": "string",
  "is_insertable_into": true,
  "rls_enabled": true,
  "rls_forced": true,
  "is_typed": true,
  "bytes": 0,
  "size": "string",
  "seq_scan_count": 0,
  "seq_row_read_count": 0,
  "idx_scan_count": 0,
  "idx_row_read_count": 0,
  "row_ins_count": 0,
  "row_upd_count": 0,
  "row_del_count": 0,
  "row_hot_upd_count": 0,
  "live_row_count": 0,
  "dead_row_count": 0,
  "rows_mod_since_analyze": 0,
  "last_vacuum": "string",
  "last_autovacuum": "string",
  "last_analyze": "string",
  "last_autoanalyze": "string",
  "vacuum_count": 0,
  "autovacuum_count": 0,
  "analyze_count": 0,
  "autoanalyze_count": 0,
  "columns": [
    {
      "table_id": 0,
      "schema": "string",
      "table": "string",
      "id": "string",
      "ordinal_position": 0,
      "name": "string",
      "default_value": "string",
      "data_type": "string",
      "format": "string",
      "description": "string",
      "is_identity": true,
      "identity_generation": "string",
      "is_nullable": true,
      "is_updatable": true,
      "enums": [
        "string"
      ]
    }
  ],
  "grants": [
    {
      "table_id": 0,
      "grantor": "string",
      "grantee": "string",
      "catalog": "string",
      "schema": "string",
      "table_name": "string",
      "privilege_type": "string",
      "is_grantable": true,
      "with_hierarchy": true
    }
  ],
  "policies": [
    {
      "id": 0,
      "name": "string",
      "schema": "string",
      "table": "string",
      "table_id": 0,
      "action": "PERMISSIVE",
      "roles": [
        "string"
      ],
      "command": "string",
      "definition": "string",
      "check": "string"
    }
  ],
  "primary_keys": [
    {
      "schema": "string",
      "table_name": "string",
      "name": "string",
      "table_id": 0
    }
  ],
  "relationships": [
    {
      "source_schema": "string",
      "source_table_name": "string",
      "source_column_name": "string",
      "target_table_schema": "string",
      "target_table_name": "string",
      "target_column_name": "string",
      "constraint_name": "string"
    }
  ]
}
```

<h3 id="delete-a-table-by-id-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|[Table](#schematable)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="postgres-api--types">/types</h1>

## Get all types

<a id="opIdgetTypes"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /types \
  -H 'Accept: application/json'

```

```http
GET /types HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/types',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/types',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/types', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/types', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/types");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/types", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /types`

<h3 id="get-all-types-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|include_system_schemas|query|boolean|false|none|

> Example responses

> 200 Response

```json
[
  {
    "id": 0,
    "name": "string",
    "schema": "string",
    "format": "string",
    "description": "string",
    "enums": [
      "string"
    ]
  }
]
```

<h3 id="get-all-types-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful operation|Inline|

<h3 id="get-all-types-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Type](#schematype)]|false|none|none|
|» id|integer|false|none|none|
|» name|string|false|none|none|
|» schema|string|false|none|none|
|» format|string|false|none|none|
|» description|string¦null|false|none|none|
|» enums|[string]|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_Column">Column</h2>
<!-- backwards compatibility -->
<a id="schemacolumn"></a>
<a id="schema_Column"></a>
<a id="tocScolumn"></a>
<a id="tocscolumn"></a>

```json
{
  "table_id": 0,
  "schema": "string",
  "table": "string",
  "id": "string",
  "ordinal_position": 0,
  "name": "string",
  "default_value": "string",
  "data_type": "string",
  "format": "string",
  "description": "string",
  "is_identity": true,
  "identity_generation": "string",
  "is_nullable": true,
  "is_updatable": true,
  "enums": [
    "string"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|table_id|integer|false|none|none|
|schema|string|false|none|none|
|table|string|false|none|none|
|id|string|false|none|none|
|ordinal_position|integer|false|none|none|
|name|string|false|none|none|
|default_value|string|false|none|none|
|data_type|string|false|none|none|
|format|string|false|none|none|
|description|string|false|none|none|
|is_identity|boolean|false|none|none|
|identity_generation|string|false|none|none|
|is_nullable|boolean|false|none|none|
|is_updatable|boolean|false|none|none|
|enums|[string]|false|none|none|

<h2 id="tocS_Config">Config</h2>
<!-- backwards compatibility -->
<a id="schemaconfig"></a>
<a id="schema_Config"></a>
<a id="tocSconfig"></a>
<a id="tocsconfig"></a>

```json
{
  "name": "string",
  "setting": "string",
  "category": "string",
  "group": "string",
  "subgroup": "string",
  "unit": "string",
  "short_desc": "string",
  "extra_desc": "string",
  "context": "string",
  "vartype": "string",
  "source": "string",
  "min_val": "string",
  "max_val": "string",
  "enumvals": [
    "string"
  ],
  "boot_val": "string",
  "reset_val": "string",
  "sourcefile": "string",
  "sourceline": 0,
  "pending_restart": true
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|false|none|none|
|setting|string|false|none|none|
|category|string|false|none|none|
|group|string|false|none|none|
|subgroup|string|false|none|none|
|unit|string¦null|false|none|none|
|short_desc|string|false|none|none|
|extra_desc|string¦null|false|none|none|
|context|string|false|none|none|
|vartype|string|false|none|none|
|source|string|false|none|none|
|min_val|string¦null|false|none|none|
|max_val|string¦null|false|none|none|
|enumvals|[string]¦null|false|none|none|
|boot_val|string|false|none|none|
|reset_val|string|false|none|none|
|sourcefile|string¦null|false|none|none|
|sourceline|integer¦null|false|none|none|
|pending_restart|boolean|false|none|none|

<h2 id="tocS_Extension">Extension</h2>
<!-- backwards compatibility -->
<a id="schemaextension"></a>
<a id="schema_Extension"></a>
<a id="tocSextension"></a>
<a id="tocsextension"></a>

```json
{
  "name": "string",
  "comment": "string",
  "default_version": "string",
  "installed_version": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|false|none|none|
|comment|string|false|none|none|
|default_version|string|false|none|none|
|installed_version|string|false|none|none|

<h2 id="tocS_Function">Function</h2>
<!-- backwards compatibility -->
<a id="schemafunction"></a>
<a id="schema_Function"></a>
<a id="tocSfunction"></a>
<a id="tocsfunction"></a>

```json
{
  "id": 0,
  "schema": "string",
  "name": "string",
  "language": "string",
  "definition": "string",
  "argument_types": "string",
  "return_type": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer|false|none|none|
|schema|string|false|none|none|
|name|string|false|none|none|
|language|string|false|none|none|
|definition|string|false|none|none|
|argument_types|string|false|none|none|
|return_type|string|false|none|none|

<h2 id="tocS_Grant">Grant</h2>
<!-- backwards compatibility -->
<a id="schemagrant"></a>
<a id="schema_Grant"></a>
<a id="tocSgrant"></a>
<a id="tocsgrant"></a>

```json
{
  "table_id": 0,
  "grantor": "string",
  "grantee": "string",
  "catalog": "string",
  "schema": "string",
  "table_name": "string",
  "privilege_type": "string",
  "is_grantable": true,
  "with_hierarchy": true
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|table_id|integer|false|none|none|
|grantor|string|false|none|none|
|grantee|string|false|none|none|
|catalog|string|false|none|none|
|schema|string|false|none|none|
|table_name|string|false|none|none|
|privilege_type|string|false|none|none|
|is_grantable|boolean|false|none|none|
|with_hierarchy|boolean|false|none|none|

<h2 id="tocS_Policy">Policy</h2>
<!-- backwards compatibility -->
<a id="schemapolicy"></a>
<a id="schema_Policy"></a>
<a id="tocSpolicy"></a>
<a id="tocspolicy"></a>

```json
{
  "id": 0,
  "name": "string",
  "schema": "string",
  "table": "string",
  "table_id": 0,
  "action": "PERMISSIVE",
  "roles": [
    "string"
  ],
  "command": "string",
  "definition": "string",
  "check": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer|false|none|none|
|name|string|false|none|none|
|schema|string|false|none|none|
|table|string|false|none|none|
|table_id|integer|false|none|none|
|action|string|false|none|none|
|roles|[string]|false|none|none|
|command|string|false|none|none|
|definition|string|false|none|none|
|check|string¦null|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|action|PERMISSIVE|
|action|RESTRICTIVE|

<h2 id="tocS_Role">Role</h2>
<!-- backwards compatibility -->
<a id="schemarole"></a>
<a id="schema_Role"></a>
<a id="tocSrole"></a>
<a id="tocsrole"></a>

```json
{
  "id": 0,
  "name": "string",
  "is_superuser": true,
  "can_create_db": true,
  "can_create_role": true,
  "inherit_role": true,
  "can_login": true,
  "is_replication_role": true,
  "can_bypass_rls": true,
  "active_connections": 0,
  "connection_limit": 0,
  "password": "string",
  "valid_until": "string",
  "config": "string",
  "grants": [
    {
      "table_id": 0,
      "grantor": "string",
      "grantee": "string",
      "catalog": "string",
      "schema": "string",
      "table_name": "string",
      "privilege_type": "string",
      "is_grantable": true,
      "with_hierarchy": true
    }
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer|false|none|none|
|name|string|false|none|none|
|is_superuser|boolean|false|none|none|
|can_create_db|boolean|false|none|none|
|can_create_role|boolean|false|none|none|
|inherit_role|boolean|false|none|none|
|can_login|boolean|false|none|none|
|is_replication_role|boolean|false|none|none|
|can_bypass_rls|boolean|false|none|none|
|active_connections|integer|false|none|none|
|connection_limit|integer|false|none|none|
|password|string|false|none|none|
|valid_until|string¦null|false|none|none|
|config|string¦null|false|none|none|
|grants|[[Grant](#schemagrant)]|false|none|none|

<h2 id="tocS_Schema">Schema</h2>
<!-- backwards compatibility -->
<a id="schemaschema"></a>
<a id="schema_Schema"></a>
<a id="tocSschema"></a>
<a id="tocsschema"></a>

```json
{
  "id": 0,
  "catalog_name": "string",
  "name": "string",
  "owner": "string",
  "default_character_set_catalog": "string",
  "default_character_set_schema": "string",
  "default_character_set_name": "string",
  "sql_path": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer|false|none|none|
|catalog_name|string|false|none|none|
|name|string|false|none|none|
|owner|string|false|none|none|
|default_character_set_catalog|string¦null|false|none|none|
|default_character_set_schema|string¦null|false|none|none|
|default_character_set_name|string¦null|false|none|none|
|sql_path|string¦null|false|none|none|

<h2 id="tocS_Table">Table</h2>
<!-- backwards compatibility -->
<a id="schematable"></a>
<a id="schema_Table"></a>
<a id="tocStable"></a>
<a id="tocstable"></a>

```json
{
  "id": 0,
  "catalog": "string",
  "schema": "string",
  "name": "string",
  "is_insertable_into": true,
  "rls_enabled": true,
  "rls_forced": true,
  "is_typed": true,
  "bytes": 0,
  "size": "string",
  "seq_scan_count": 0,
  "seq_row_read_count": 0,
  "idx_scan_count": 0,
  "idx_row_read_count": 0,
  "row_ins_count": 0,
  "row_upd_count": 0,
  "row_del_count": 0,
  "row_hot_upd_count": 0,
  "live_row_count": 0,
  "dead_row_count": 0,
  "rows_mod_since_analyze": 0,
  "last_vacuum": "string",
  "last_autovacuum": "string",
  "last_analyze": "string",
  "last_autoanalyze": "string",
  "vacuum_count": 0,
  "autovacuum_count": 0,
  "analyze_count": 0,
  "autoanalyze_count": 0,
  "columns": [
    {
      "table_id": 0,
      "schema": "string",
      "table": "string",
      "id": "string",
      "ordinal_position": 0,
      "name": "string",
      "default_value": "string",
      "data_type": "string",
      "format": "string",
      "description": "string",
      "is_identity": true,
      "identity_generation": "string",
      "is_nullable": true,
      "is_updatable": true,
      "enums": [
        "string"
      ]
    }
  ],
  "grants": [
    {
      "table_id": 0,
      "grantor": "string",
      "grantee": "string",
      "catalog": "string",
      "schema": "string",
      "table_name": "string",
      "privilege_type": "string",
      "is_grantable": true,
      "with_hierarchy": true
    }
  ],
  "policies": [
    {
      "id": 0,
      "name": "string",
      "schema": "string",
      "table": "string",
      "table_id": 0,
      "action": "PERMISSIVE",
      "roles": [
        "string"
      ],
      "command": "string",
      "definition": "string",
      "check": "string"
    }
  ],
  "primary_keys": [
    {
      "schema": "string",
      "table_name": "string",
      "name": "string",
      "table_id": 0
    }
  ],
  "relationships": [
    {
      "source_schema": "string",
      "source_table_name": "string",
      "source_column_name": "string",
      "target_table_schema": "string",
      "target_table_name": "string",
      "target_column_name": "string",
      "constraint_name": "string"
    }
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer|false|none|none|
|catalog|string|false|none|none|
|schema|string|false|none|none|
|name|string|false|none|none|
|is_insertable_into|boolean|false|none|none|
|rls_enabled|boolean|false|none|none|
|rls_forced|boolean|false|none|none|
|is_typed|boolean|false|none|none|
|bytes|integer|false|none|none|
|size|string|false|none|none|
|seq_scan_count|integer|false|none|none|
|seq_row_read_count|integer|false|none|none|
|idx_scan_count|integer|false|none|none|
|idx_row_read_count|integer|false|none|none|
|row_ins_count|integer|false|none|none|
|row_upd_count|integer|false|none|none|
|row_del_count|integer|false|none|none|
|row_hot_upd_count|integer|false|none|none|
|live_row_count|integer|false|none|none|
|dead_row_count|integer|false|none|none|
|rows_mod_since_analyze|integer|false|none|none|
|last_vacuum|string¦null|false|none|none|
|last_autovacuum|string¦null|false|none|none|
|last_analyze|string¦null|false|none|none|
|last_autoanalyze|string¦null|false|none|none|
|vacuum_count|integer|false|none|none|
|autovacuum_count|integer|false|none|none|
|analyze_count|integer|false|none|none|
|autoanalyze_count|integer|false|none|none|
|columns|[[Column](#schemacolumn)]|false|none|none|
|grants|[[Grant](#schemagrant)]|false|none|none|
|policies|[[Policy](#schemapolicy)]|false|none|none|
|primary_keys|[object]|false|none|none|
|» schema|string|false|none|none|
|» table_name|string|false|none|none|
|» name|string|false|none|none|
|» table_id|integer|false|none|none|
|relationships|[object]|false|none|none|
|» source_schema|string|false|none|none|
|» source_table_name|string|false|none|none|
|» source_column_name|string|false|none|none|
|» target_table_schema|string|false|none|none|
|» target_table_name|string|false|none|none|
|» target_column_name|string|false|none|none|
|» constraint_name|string|false|none|none|

<h2 id="tocS_Type">Type</h2>
<!-- backwards compatibility -->
<a id="schematype"></a>
<a id="schema_Type"></a>
<a id="tocStype"></a>
<a id="tocstype"></a>

```json
{
  "id": 0,
  "name": "string",
  "schema": "string",
  "format": "string",
  "description": "string",
  "enums": [
    "string"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer|false|none|none|
|name|string|false|none|none|
|schema|string|false|none|none|
|format|string|false|none|none|
|description|string¦null|false|none|none|
|enums|[string]|false|none|none|

<h2 id="tocS_Version">Version</h2>
<!-- backwards compatibility -->
<a id="schemaversion"></a>
<a id="schema_Version"></a>
<a id="tocSversion"></a>
<a id="tocsversion"></a>

```json
{
  "version": "string",
  "version_number": 0,
  "active_connections": 0,
  "max_connections": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|version|string|false|none|none|
|version_number|integer|false|none|none|
|active_connections|integer|false|none|none|
|max_connections|integer|false|none|none|

