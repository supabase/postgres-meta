---
title: SEMOASA documentation
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

This documentation was automatically generated from a v0.1.0 [SEMOASA](https://github.com/RepreZen/SEMOASA) file.


  

  
  
# com.amazon.aws



Provider: <a href="https://aws.amazon.com/">Amazon Web Services</a>




## x-amazon-apigateway-integration
> x-amazon-apigateway-integration example
```json
{
  "cacheKeyParameters": [
    "string"
  ],
  "cacheNamespace": "string",
  "credentials": "string",
  "contentHandling": "string",
  "httpMethod": "string"
}
```
```yaml
cacheKeyParameters:
  - string
cacheNamespace: string
credentials: string
contentHandling: string
httpMethod: string

```





*Specifies the integration of the method with the backend.*

Specifies details of the backend integration used for this method.
This extension is an extended property of the Swagger Operation object.
The result is an API Gateway integration object.





<a href="http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-swagger-extensions-integration.html">AWS documentation page in the  Amazon API Gateway Developer Guide</a>




|Property|Type|Required|Description
|---|---|---|---|
|cacheNamespace|string|false|An API-specific tag group of related cached parameters.|
|credentials|string|false|For AWS IAM role-based credentials, specify the ARN of an appropriate IAM role. If unspecified, credentials will default to resource-based permissions that must be added manually to allow the API to access the resource. For more information, see Granting Permissions Using a Resource Policy. |
|contentHandling|string|false|Request payload encoding conversion types. Valid values are 1) CONVERT_TO_TEXT, for converting a binary payload into a Base64-encoded string or converting a text payload into a utf-8-encoded string or passing through the text payload natively without modification, and 2) CONVERT_TO_BINARY, for converting a text payload into Base64-decoded blob or passing through a binary payload natively without modification. |
|httpMethod|string|false|The HTTP method used in the integration request. For Lambda function invocations, the value must be POST. |
|cacheKeyParameters|[string]|false|A list of request parameters whose values are to be cached.|



**In the OpenAPI specification v2.0, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/2.0.md#operationObject">OperationObject</a>|Describes a single API operation on a path.|












**In the OpenAPI specification v3.x, this extension can be used as follows:**



<aside class="warning">
The extension may only be used in the following objects:
</aside>

|Object|Description|
|---|---|
|<a href="https://github.com/OAI/openapi-specification/tree/master/versions/3.0.0.md#operationObject">OperationObject</a>|Describes a single API operation on a path.|













  

