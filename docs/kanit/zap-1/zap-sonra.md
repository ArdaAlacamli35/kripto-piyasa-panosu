# ZAP Scanning Report

ZAP by [Checkmarx](https://checkmarx.com/).


## Summary of Alerts

| Risk Level | Number of Alerts |
| --- | --- |
| High | 0 |
| Medium | 1 |
| Low | 2 |
| Informational | 8 |




## Insights

| Level | Reason | Site | Description | Statistic |
| --- | --- | --- | --- | --- |
| Low | Warning |  | ZAP warnings logged - see the zap.log file for details | 1    |
| Info | Informational | https://kripto-piyasa-panosu.pages.dev | Percentage of responses with status code 2xx | 100 % |
| Info | Informational | https://kripto-piyasa-panosu.pages.dev | Percentage of endpoints with content type application/javascript | 12 % |
| Info | Informational | https://kripto-piyasa-panosu.pages.dev | Percentage of endpoints with content type application/manifest+json | 12 % |
| Info | Informational | https://kripto-piyasa-panosu.pages.dev | Percentage of endpoints with content type image/svg+xml | 12 % |
| Info | Informational | https://kripto-piyasa-panosu.pages.dev | Percentage of endpoints with content type text/css | 12 % |
| Info | Informational | https://kripto-piyasa-panosu.pages.dev | Percentage of endpoints with content type text/html | 25 % |
| Info | Informational | https://kripto-piyasa-panosu.pages.dev | Percentage of endpoints with content type text/plain | 25 % |
| Info | Informational | https://kripto-piyasa-panosu.pages.dev | Percentage of endpoints with method GET | 100 % |
| Info | Informational | https://kripto-piyasa-panosu.pages.dev | Count of total endpoints | 8    |
| Info | Informational | https://kripto-piyasa-panosu.pages.dev | Percentage of slow responses | 30 % |







## Alerts

| Name | Risk Level | Number of Instances |
| --- | --- | --- |
| Cross-Domain Misconfiguration | Medium | Systemic |
| CSP: Notices | Low | 3 |
| Cross-Origin-Embedder-Policy Header Missing or Invalid | Low | 3 |
| Base64 Disclosure | Informational | 9 |
| Re-examine Cache-control Directives | Informational | Systemic |
| Sec-Fetch-Dest Header is Missing | Informational | 3 |
| Sec-Fetch-Mode Header is Missing | Informational | 3 |
| Sec-Fetch-Site Header is Missing | Informational | 3 |
| Sec-Fetch-User Header is Missing | Informational | 3 |
| Storable and Cacheable Content | Informational | 2 |
| Storable but Non-Cacheable Content | Informational | Systemic |




## Alert Detail



### [ Cross-Domain Misconfiguration ](https://www.zaproxy.org/docs/alerts/10098/)



##### Medium (Medium)

### Description

Web browser data loading may be possible, due to a Cross Origin Resource Sharing (CORS) misconfiguration on the web server.

* URL: https://kripto-piyasa-panosu.pages.dev
  * Node Name: `https://kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `Access-Control-Allow-Origin: *`
  * Other Info: `The CORS misconfiguration on the web server permits cross-domain read requests from arbitrary third party domains, using unauthenticated APIs on this domain. Web browser implementations do not permit arbitrary third parties to read the response from authenticated APIs, however. This reduces the risk somewhat. This misconfiguration could be used by an attacker to access data that is available in an unauthenticated manner, but which uses some other form of security, such as IP address white-listing.`
* URL: https://kripto-piyasa-panosu.pages.dev/assets/index-Dm2fdJpP.css
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/assets/index-Dm2fdJpP.css`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `Access-Control-Allow-Origin: *`
  * Other Info: `The CORS misconfiguration on the web server permits cross-domain read requests from arbitrary third party domains, using unauthenticated APIs on this domain. Web browser implementations do not permit arbitrary third parties to read the response from authenticated APIs, however. This reduces the risk somewhat. This misconfiguration could be used by an attacker to access data that is available in an unauthenticated manner, but which uses some other form of security, such as IP address white-listing.`
* URL: https://kripto-piyasa-panosu.pages.dev/favicon.svg
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/favicon.svg`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `Access-Control-Allow-Origin: *`
  * Other Info: `The CORS misconfiguration on the web server permits cross-domain read requests from arbitrary third party domains, using unauthenticated APIs on this domain. Web browser implementations do not permit arbitrary third parties to read the response from authenticated APIs, however. This reduces the risk somewhat. This misconfiguration could be used by an attacker to access data that is available in an unauthenticated manner, but which uses some other form of security, such as IP address white-listing.`
* URL: https://kripto-piyasa-panosu.pages.dev/robots.txt
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/robots.txt`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `Access-Control-Allow-Origin: *`
  * Other Info: `The CORS misconfiguration on the web server permits cross-domain read requests from arbitrary third party domains, using unauthenticated APIs on this domain. Web browser implementations do not permit arbitrary third parties to read the response from authenticated APIs, however. This reduces the risk somewhat. This misconfiguration could be used by an attacker to access data that is available in an unauthenticated manner, but which uses some other form of security, such as IP address white-listing.`
* URL: https://kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `Access-Control-Allow-Origin: *`
  * Other Info: `The CORS misconfiguration on the web server permits cross-domain read requests from arbitrary third party domains, using unauthenticated APIs on this domain. Web browser implementations do not permit arbitrary third parties to read the response from authenticated APIs, however. This reduces the risk somewhat. This misconfiguration could be used by an attacker to access data that is available in an unauthenticated manner, but which uses some other form of security, such as IP address white-listing.`

Instances: Systemic


### Solution

Ensure that sensitive data is not available in an unauthenticated manner (using IP address white-listing, for instance).
Configure the "Access-Control-Allow-Origin" HTTP header to a more restrictive set of domains, or remove all CORS headers entirely, to allow the web browser to enforce the Same Origin Policy (SOP) in a more restrictive manner.

### Reference


* [ https://vulncat.fortify.com/en/detail?category=HTML5&subcategory=Overly%20Permissive%20CORS%20Policy ](https://vulncat.fortify.com/en/detail?category=HTML5&subcategory=Overly%20Permissive%20CORS%20Policy)


#### CWE Id: [ 264 ](https://cwe.mitre.org/data/definitions/264.html)


#### WASC Id: 14

#### Source ID: 3

### [ CSP: Notices ](https://www.zaproxy.org/docs/alerts/10055/)



##### Low (High)

### Description

Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks. Including (but not limited to) Cross Site Scripting (XSS), and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

* URL: https://kripto-piyasa-panosu.pages.dev
  * Node Name: `https://kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: `Content-Security-Policy`
  * Attack: ``
  * Evidence: `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://data-api.binance.vision wss://data-stream.binance.vision; manifest-src 'self'; worker-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests; require-trusted-types-for 'script'; trusted-types sw; report-uri /csp-report`
  * Other Info: `Warnings:
The report-uri directive has been deprecated in favor of the new report-to directive
`
* URL: https://kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/`
  * Method: `GET`
  * Parameter: `Content-Security-Policy`
  * Attack: ``
  * Evidence: `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://data-api.binance.vision wss://data-stream.binance.vision; manifest-src 'self'; worker-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests; require-trusted-types-for 'script'; trusted-types sw; report-uri /csp-report`
  * Other Info: `Warnings:
The report-uri directive has been deprecated in favor of the new report-to directive
`
* URL: https://kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: `Content-Security-Policy`
  * Attack: ``
  * Evidence: `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://data-api.binance.vision wss://data-stream.binance.vision; manifest-src 'self'; worker-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests; require-trusted-types-for 'script'; trusted-types sw; report-uri /csp-report`
  * Other Info: `Warnings:
The report-uri directive has been deprecated in favor of the new report-to directive
`


Instances: 3

### Solution

Ensure that your web server, application server, load balancer, etc. is properly configured to set the Content-Security-Policy header.

### Reference


* [ https://www.w3.org/TR/CSP/ ](https://www.w3.org/TR/CSP/)
* [ https://caniuse.com/#search=content+security+policy ](https://caniuse.com/#search=content+security+policy)
* [ https://content-security-policy.com/ ](https://content-security-policy.com/)
* [ https://github.com/HtmlUnit/htmlunit-csp ](https://github.com/HtmlUnit/htmlunit-csp)
* [ https://web.dev/articles/csp#resource-options ](https://web.dev/articles/csp#resource-options)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### Source ID: 3

### [ Cross-Origin-Embedder-Policy Header Missing or Invalid ](https://www.zaproxy.org/docs/alerts/90004/)



##### Low (Medium)

### Description

Cross-Origin-Embedder-Policy header is a response header that prevents a document from loading any cross-origin resources that don't explicitly grant the document permission (using CORP or CORS).

* URL: https://kripto-piyasa-panosu.pages.dev
  * Node Name: `https://kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: `Cross-Origin-Embedder-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/`
  * Method: `GET`
  * Parameter: `Cross-Origin-Embedder-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: `Cross-Origin-Embedder-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 3

### Solution

Ensure that the application/web server sets the Cross-Origin-Embedder-Policy header appropriately, and that it sets the Cross-Origin-Embedder-Policy header to 'require-corp' for documents.
If possible, ensure that the end user uses a standards-compliant and modern web browser that supports the Cross-Origin-Embedder-Policy header (https://caniuse.com/mdn-http_headers_cross-origin-embedder-policy).

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 14

#### Source ID: 3

### [ Base64 Disclosure ](https://www.zaproxy.org/docs/alerts/10094/)



##### Informational (Medium)

### Description

Base64 encoded data was disclosed by the application/web server. Note: in the interests of performance not all base64 strings in the response were analyzed individually, the entire response should be looked at by the analyst/security team/developer(s).

* URL: https://kripto-piyasa-panosu.pages.dev
  * Node Name: `https://kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2Fabf0knkluacSMsGAiNXAy3ozfZJbrE8jf684vvvMXKbTCwWPY0m4`
  * Other Info: `�V�I'�[�q#,�\��7�%���7�����m0�X�4�`
* URL: https://kripto-piyasa-panosu.pages.dev
  * Node Name: `https://kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2FzQV0W0rI5mJla5J9b1b0u9pJcmqulX3ENKBw8rXDiCAguMlh60PppPKsvxC82x0PnNzyBQqToDJlDXiOVr3v9LrxNHLoG7`
  * Other Info: `�\�WE���f&V�'��oK���&��W�CJ+\8����>�O*��ͱ���� P�:&P׈�k��K�G.��`
* URL: https://kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2FAlv9mn4FLeabonpcR7eDCK8VqdV2nHAeYqaeZOgEGrbbkZcZqTYYHLMasYuZLuc81tSVRFa1CpXhLN6ATmzPP5RxAPtQVr2SacSuwV4Y3JYMEBmEioDcwRRtV7GQ`
  * Other Info: `�P%�٧�R�i�'��{x0��Z�Wi��*i�N�A�m�q��a��1����s�mITEkP�^������G�k�&�J���`��H��F�{`
* URL: https://kripto-piyasa-panosu.pages.dev/.well-known/security.txt
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/.well-known/security.txt`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2F0fRgdyTGXVtm94SsligsQhWSgYXV5W6GBYQM`
  * Other Info: `�]FrLeնoxJ�b��!Y(]^V�`X@`
* URL: https://kripto-piyasa-panosu.pages.dev/assets/index-Cg5DHePA.js
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/assets/index-Cg5DHePA.js`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `DlkTFcnoP4IBO1O6yEJrIeqgj3SyI0`
  * Other Info: `Y��?�;S��Bk!ꠏt�#`
* URL: https://kripto-piyasa-panosu.pages.dev/assets/index-Dm2fdJpP.css
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/assets/index-Dm2fdJpP.css`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2FvypqVqoceG2l2aMaxeRK7dA1JDCsMZpVplL9P6h9YLqpnUl83iF1V4rZhHziIH2QdUjcnW11n2Bnn6FDFRCQCZYI`
  * Other Info: `�[�j�ǆ�]�1�^D��RC
��Ze/������ԗ��Ux��G�"�T����Y�y�1Q	 �``
* URL: https://kripto-piyasa-panosu.pages.dev/favicon.svg
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/favicon.svg`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2BlgEAp0PUILVHVl54pqlSb32dhYCQ5lHkTPuTBdAkKQ`
  * Other Info: `�`
t=BTue�j�&���X	eDϹ0]B�`
* URL: https://kripto-piyasa-panosu.pages.dev/manifest.webmanifest
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/manifest.webmanifest`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2BFhExqTxEd8TJMIqIYuXx0HH2ssslSFWew8ezIbvG2bAMWuLqPRojyueLbn0PJN74l9Dd`
  * Other Info: `�a��G|L���._k,�T�Y�<{2�m� Ů.�Ѣ<�x����M�}`
* URL: https://kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `Xiik0J9d8X2HvlOVUsR14QE1UTrnfkddHjjXGp2nvSzFODJ0jI9Cdb`
  * Other Info: `^(�П]�}��S�R�u�5Q:�~G]8����,�82t��Bu`


Instances: 9

### Solution

Manually confirm that the Base64 data does not leak sensitive information, and that the data cannot be aggregated/used to exploit other vulnerabilities.

### Reference


* [ https://projects.webappsec.org/w/page/13246936/Information%20Leakage ](https://projects.webappsec.org/w/page/13246936/Information%20Leakage)


#### CWE Id: [ 319 ](https://cwe.mitre.org/data/definitions/319.html)


#### WASC Id: 13

#### Source ID: 3

### [ Re-examine Cache-control Directives ](https://www.zaproxy.org/docs/alerts/10015/)



##### Informational (Low)

### Description

The cache-control header has not been set properly or is missing, allowing the browser and proxies to cache content. For static assets like css, js, or image files this might be intended, however, the resources should be reviewed to ensure that no sensitive content will be cached.

* URL: https://kripto-piyasa-panosu.pages.dev
  * Node Name: `https://kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: `public, max-age=0, must-revalidate`
  * Other Info: ``
* URL: https://kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/`
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: `public, max-age=0, must-revalidate`
  * Other Info: ``
* URL: https://kripto-piyasa-panosu.pages.dev/.well-known/security.txt
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/.well-known/security.txt`
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: `public, max-age=0, must-revalidate`
  * Other Info: ``
* URL: https://kripto-piyasa-panosu.pages.dev/robots.txt
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/robots.txt`
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: `public, max-age=0, must-revalidate`
  * Other Info: ``
* URL: https://kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: `public, max-age=0, must-revalidate`
  * Other Info: ``

Instances: Systemic


### Solution

For secure content, ensure the cache-control HTTP header is set with "no-cache, no-store, must-revalidate". If an asset should be cached consider setting the directives "public, max-age, immutable".

### Reference


* [ https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#web-content-caching ](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#web-content-caching)
* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)
* [ https://grayduck.mn/2021/09/13/cache-control-recommendations/ ](https://grayduck.mn/2021/09/13/cache-control-recommendations/)


#### CWE Id: [ 525 ](https://cwe.mitre.org/data/definitions/525.html)


#### WASC Id: 13

#### Source ID: 3

### [ Sec-Fetch-Dest Header is Missing ](https://www.zaproxy.org/docs/alerts/90005/)



##### Informational (High)

### Description

Specifies how and where the data would be used. For instance, if the value is audio, then the requested resource must be audio data and not any other type of resource.

* URL: https://kripto-piyasa-panosu.pages.dev
  * Node Name: `https://kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Dest`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://kripto-piyasa-panosu.pages.dev/robots.txt
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/robots.txt`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Dest`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Dest`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 3

### Solution

Ensure that Sec-Fetch-Dest header is included in request headers.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Dest ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Dest)


#### CWE Id: [ 352 ](https://cwe.mitre.org/data/definitions/352.html)


#### WASC Id: 9

#### Source ID: 3

### [ Sec-Fetch-Mode Header is Missing ](https://www.zaproxy.org/docs/alerts/90005/)



##### Informational (High)

### Description

Allows to differentiate between requests for navigating between HTML pages and requests for loading resources like images, audio etc.

* URL: https://kripto-piyasa-panosu.pages.dev
  * Node Name: `https://kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Mode`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://kripto-piyasa-panosu.pages.dev/robots.txt
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/robots.txt`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Mode`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Mode`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 3

### Solution

Ensure that Sec-Fetch-Mode header is included in request headers.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Mode ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Mode)


#### CWE Id: [ 352 ](https://cwe.mitre.org/data/definitions/352.html)


#### WASC Id: 9

#### Source ID: 3

### [ Sec-Fetch-Site Header is Missing ](https://www.zaproxy.org/docs/alerts/90005/)



##### Informational (High)

### Description

Specifies the relationship between request initiator's origin and target's origin.

* URL: https://kripto-piyasa-panosu.pages.dev
  * Node Name: `https://kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Site`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://kripto-piyasa-panosu.pages.dev/robots.txt
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/robots.txt`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Site`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Site`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 3

### Solution

Ensure that Sec-Fetch-Site header is included in request headers.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Site ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Site)


#### CWE Id: [ 352 ](https://cwe.mitre.org/data/definitions/352.html)


#### WASC Id: 9

#### Source ID: 3

### [ Sec-Fetch-User Header is Missing ](https://www.zaproxy.org/docs/alerts/90005/)



##### Informational (High)

### Description

Specifies if a navigation request was initiated by a user.

* URL: https://kripto-piyasa-panosu.pages.dev
  * Node Name: `https://kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: `Sec-Fetch-User`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://kripto-piyasa-panosu.pages.dev/robots.txt
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/robots.txt`
  * Method: `GET`
  * Parameter: `Sec-Fetch-User`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: `Sec-Fetch-User`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 3

### Solution

Ensure that Sec-Fetch-User header is included in user initiated requests.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-User ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-User)


#### CWE Id: [ 352 ](https://cwe.mitre.org/data/definitions/352.html)


#### WASC Id: 9

#### Source ID: 3

### [ Storable and Cacheable Content ](https://www.zaproxy.org/docs/alerts/10049/)



##### Informational (Medium)

### Description

The response contents are storable by caching components such as proxy servers, and may be retrieved directly from the cache, rather than from the origin server by the caching servers, in response to similar requests from other users. If the response data is sensitive, personal or user-specific, this may result in sensitive information being leaked. In some cases, this may even result in a user gaining complete control of the session of another user, depending on the configuration of the caching components in use in their environment. This is primarily an issue where "shared" caching servers such as "proxy" caches are configured on the local network. This configuration is typically found in corporate or educational environments, for instance.

* URL: https://kripto-piyasa-panosu.pages.dev/assets/index-Cg5DHePA.js
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/assets/index-Cg5DHePA.js`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=31536000`
  * Other Info: ``
* URL: https://kripto-piyasa-panosu.pages.dev/assets/index-Dm2fdJpP.css
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/assets/index-Dm2fdJpP.css`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=31536000`
  * Other Info: ``


Instances: 2

### Solution

Validate that the response does not contain sensitive, personal or user-specific information. If it does, consider the use of the following HTTP response headers, to limit, or prevent the content being stored and retrieved from the cache by another user:
Cache-Control: no-cache, no-store, must-revalidate, private
Pragma: no-cache
Expires: 0
This configuration directs both HTTP 1.0 and HTTP 1.1 compliant caching servers to not store the response, and to not retrieve the response (without validation) from the cache, in response to a similar request.

### Reference


* [ https://datatracker.ietf.org/doc/html/rfc7234 ](https://datatracker.ietf.org/doc/html/rfc7234)
* [ https://datatracker.ietf.org/doc/html/rfc7231 ](https://datatracker.ietf.org/doc/html/rfc7231)
* [ https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html ](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html)


#### CWE Id: [ 524 ](https://cwe.mitre.org/data/definitions/524.html)


#### WASC Id: 13

#### Source ID: 3

### [ Storable but Non-Cacheable Content ](https://www.zaproxy.org/docs/alerts/10049/)



##### Informational (Medium)

### Description

The response contents are storable by caching components such as proxy servers, but will not be retrieved directly from the cache, without validating the request upstream, in response to similar requests from other users.

* URL: https://kripto-piyasa-panosu.pages.dev
  * Node Name: `https://kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=0`
  * Other Info: ``
* URL: https://kripto-piyasa-panosu.pages.dev/.well-known/security.txt
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/.well-known/security.txt`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=0`
  * Other Info: ``
* URL: https://kripto-piyasa-panosu.pages.dev/favicon.svg
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/favicon.svg`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=0`
  * Other Info: ``
* URL: https://kripto-piyasa-panosu.pages.dev/robots.txt
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/robots.txt`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=0`
  * Other Info: ``
* URL: https://kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=0`
  * Other Info: ``

Instances: Systemic


### Solution



### Reference


* [ https://datatracker.ietf.org/doc/html/rfc7234 ](https://datatracker.ietf.org/doc/html/rfc7234)
* [ https://datatracker.ietf.org/doc/html/rfc7231 ](https://datatracker.ietf.org/doc/html/rfc7231)
* [ https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html ](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html)


#### CWE Id: [ 524 ](https://cwe.mitre.org/data/definitions/524.html)


#### WASC Id: 13

#### Source ID: 3


