---
title: Semoasa documentation
language_tabs:
  - json
  - yaml
toc_footers: []
includes: []
search: true
highlight_theme: darkula

---

# OpenAPI Extensions Documentation

> Scroll down for schema examples. Select a format for examples from the tabs above or the mobile navigation menu.

This documentation was automatically generated from a v0.1.0 [Semoasa](https://github.com/RepreZen/SEMOASA) document.

<abbr title="Specification Extension Metadata for OAS Annotations">Semoasa</abbr> is a machine-readable format for extensions to Swagger/OpenAPI 2.0 and 3.0 specifications.




# guru.apis




Provider: <a href="https://apis.guru/">APIs.guru</a>





## x-apiClientRegistration
> x-apiClientRegistration example
```json
{
  "url": "https://developer.bbc.co.uk/user/register"
}
```
```yaml
url: 'https://developer.bbc.co.uk/user/register'

```





*A link to a sign-up page for the API.*

A property of the info object, x-apiClientRegistration includes a URL-formatted property url containing the URL to the resource where developers can register to authenticate with the API.




<a href="https://github.com/APIs-guru/openapi-directory/wiki/specification-extensions">APIs.guru OpenAPI Directory Wiki</a>




|Property|Type|Required|Description
|---|---|---|---|
|url|string(uri-ref)|true|No description|



**In the OpenAPI specification v2.0, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/2.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|











**In the OpenAPI specification v3.x, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/3.0.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|












## x-apisguru-categories
> x-apisguru-categories example
```json
[
  "string"
]
```
```yaml
- string

```







A property of the info object, `x-apisguru-categories` is an array of valid values from the list of APIs.guru categories.




<a href="https://github.com/APIs-guru/openapi-directory/wiki/specification-extensions">APIs.guru OpenAPI Directory Wiki</a>




|Property|Type|Required|Description
|---|---|---|---|
|anonymous|[string]|false|No description|



**In the OpenAPI specification v2.0, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/2.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|











**In the OpenAPI specification v3.x, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/3.0.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|












## x-description-language
> x-description-language example
```json
"string"
```
```yaml
string

```







An ISO-639 two-character language code to identify the natural language used in descriptions, summaries and titles. This can be used as an input to translating these items.







|Property|Type|Required|Description
|---|---|---|---|
|simple|string|false|No description|



**In the OpenAPI specification v2.0, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/2.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|











**In the OpenAPI specification v3.x, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/3.0.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|












## x-hasEquivalentPaths
> x-hasEquivalentPaths example
```json
true
```
```yaml
true

```







A property of the `root` object, `x-hasEquivalentPaths` indicates the source specification has multiple paths which map to the same OpenAPI path (possibly disambiguated with HTML fragment identifiers or differently named path parameters).







|Property|Type|Required|Description
|---|---|---|---|
|simple|boolean|false|No description|



**In the OpenAPI specification v2.0, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/2.0.md#swaggerObject">SwaggerObject</a>|Description not found|











**In the OpenAPI specification v3.x, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/3.0.0.md#openAPIObject">OpenAPIObject</a>|Description not found|












## x-logo
> x-logo example
```json
{
  "url": "string",
  "backgroundColor": "string"
}
```
```yaml
url: string
backgroundColor: string

```





*A logo for the API.*

A property of the `info` object, the `x-logo` structure holds an absolute URL to the API logo and an optional background colour in HTML hex notation.





<a href="https://github.com/APIs-guru/openapi-directory/wiki/specification-extensions">APIs.guru OpenAPI Directory Wiki</a>




|Property|Type|Required|Description
|---|---|---|---|
|url|string(uri-ref)|true|No description|
|backgroundColor|string|false|No description|



**In the OpenAPI specification v2.0, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/2.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|











**In the OpenAPI specification v3.x, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/3.0.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|












## x-origin
> x-origin example
```json
[
  {
    "url": "http://programmes.api.bbc.com/nitro/api",
    "contentType": "application/json",
    "converter": {
      "url": "https://github.com/mermade/bbcparse",
      "version": "1.2.0"
    }
  },
  {
    "format": "swagger",
    "url": "https://raw.githubusercontent.com/Mermade/bbcparse/master/iblApi/swagger.json",
    "version": "2.0"
  }
]
```
```yaml
- url: 'http://programmes.api.bbc.com/nitro/api'
  contentType: application/json
  converter:
    url: 'https://github.com/mermade/bbcparse'
    version: 1.2.0
- format: swagger
  url: >-
    https://raw.githubusercontent.com/Mermade/bbcparse/master/iblApi/swagger.json
  version: '2.0'

```







A property of the `info` object, the `x-origin` structure is used to document the source and format of an API in the collection. It is used to round-trip the process of keeping the APIs updated.

Please note, if you include an x-origin extension within your API definition APIs.guru will then append to this array if it exists, allowing an audit trail of the source(s) of an API definition.
Valid values for format

  * swagger
  * api_blueprint
  * raml
  * google

In your own `x-origin` entries you may alternatively use a contentType property instead of a format property. The version property is then optional.

You may also specify the converter and version used.








|Property|Type|Required|Description
|---|---|---|---|
|anonymous|[object]|false|No description|
|» url|string(uri-ref)|true|No description|
|» format|string|false|No description|
|» version|string|false|No description|
|» contentType|string|false|No description|
|» converter|object|false|No description|
|»» url|string(uri-ref)|false|No description|
|»» version|string|false|No description|



**In the OpenAPI specification v2.0, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/2.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|











**In the OpenAPI specification v3.x, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/3.0.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|












## x-preferred
> x-preferred example
```json
"string"
```
```yaml
string

```







A property of the `info` object, `x-preferred` is a Boolean property which distinguishes between multiple versions of the same API. Where the `x-providerName` and `x-serviceName` are the same, only one definition should be marked `x-preferred: true`. This helps users of the APIs.guru collection organise and display the APIs.







|Property|Type|Required|Description
|---|---|---|---|
|simple|string|false|No description|



**In the OpenAPI specification v2.0, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/2.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|











**In the OpenAPI specification v3.x, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/3.0.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|












## x-providerName
> x-providerName example
```json
"string"
```
```yaml
string

```







A property of the `info` object, `x-providerName` is used to identify the domain of the API host. It is added automatically by APIs.guru







|Property|Type|Required|Description
|---|---|---|---|
|simple|string|false|No description|



**In the OpenAPI specification v2.0, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/2.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|











**In the OpenAPI specification v3.x, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/3.0.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|












## x-serviceName
> x-serviceName example
```json
"string"
```
```yaml
string

```







A property of the `info` object, `x-serviceName` is used to distinguish APIs which are served from the same domain. It may be the subdomain if the API uses one. It is added automatically by APIs.guru







|Property|Type|Required|Description
|---|---|---|---|
|simple|string|false|No description|



**In the OpenAPI specification v2.0, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/2.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|











**In the OpenAPI specification v3.x, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/3.0.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|












## x-tags
> x-tags example
```json
[
  "string"
]
```
```yaml
- string

```







Also a property of the `info` object, `x-tags` is an array of free-form keywords/tags applicable to the API.







|Property|Type|Required|Description
|---|---|---|---|
|anonymous|[string]|false|No description|



**In the OpenAPI specification v2.0, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/2.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|











**In the OpenAPI specification v3.x, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/3.0.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|












## x-unofficialSpec
> x-unofficialSpec example
```json
true
```
```yaml
true

```







A property of the `info` object, `x-unofficialSpec` indicates the definition is produced by a third-party, either manually, by scraping existing documentation or converting a proprietary/undocumented format.







|Property|Type|Required|Description
|---|---|---|---|
|simple|boolean|false|No description|



**In the OpenAPI specification v2.0, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/2.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|











**In the OpenAPI specification v3.x, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/3.0.0.md#infoObject">InfoObject</a>|The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.|
















