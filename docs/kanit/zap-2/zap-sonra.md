# ZAP Scanning Report

ZAP by [Checkmarx](https://checkmarx.com/).


## Summary of Alerts

| Risk Level | Number of Alerts |
| --- | --- |
| High | 0 |
| Medium | 0 |
| Low | 1 |
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
| Info | Informational | https://kripto-piyasa-panosu.pages.dev | Percentage of slow responses | 50 % |







## Alerts

| Name | Risk Level | Number of Instances |
| --- | --- | --- |
| CSP: Notices | Low | 3 |
| Base64 Disclosure | Informational | 10 |
| Re-examine Cache-control Directives | Informational | Systemic |
| Sec-Fetch-Dest Header is Missing | Informational | 2 |
| Sec-Fetch-Mode Header is Missing | Informational | 2 |
| Sec-Fetch-Site Header is Missing | Informational | 2 |
| Sec-Fetch-User Header is Missing | Informational | 2 |
| Storable and Cacheable Content | Informational | 2 |
| Storable but Non-Cacheable Content | Informational | Systemic |




## Alert Detail



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

### [ Base64 Disclosure ](https://www.zaproxy.org/docs/alerts/10094/)



##### Informational (Medium)

### Description

Base64 encoded data was disclosed by the application/web server. Note: in the interests of performance not all base64 strings in the response were analyzed individually, the entire response should be looked at by the analyst/security team/developer(s).

* URL: https://kripto-piyasa-panosu.pages.dev
  * Node Name: `https://kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2FM22HqVsXwcqX6JVQiAac1BomO2ogyK0CuI`
  * Other Info: `�S6�z��|�~�U�i�A�c����+�`
* URL: https://kripto-piyasa-panosu.pages.dev
  * Node Name: `https://kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `gsPh6IpMcVdbO1l0keFBdtWyA1Ppo2`
  * Other Info: `����LqW[;Yt��AvղS�`
* URL: https://kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2FOANokUYUcnKijeMVfMXDjSBNM0atcycA2q1V6SehGGkKMZhaXN4vze`
  * Other Info: `�S�6�aG'*(�1W�\8��4j�2p��^�z���������`
* URL: https://kripto-piyasa-panosu.pages.dev/.well-known/security.txt
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/.well-known/security.txt`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2F8u14UD0PpWHWYysjZT8nqIWz2DeYKKmLDAKxDUfsbBAwkXdfDZbnfdBCizXCbOhFfZYdeLMK97vxvMHUmt1axZHrKsjCRtbUltoWkfELNh6KhkebH74bQZcUhU`
  * Other Info: `�_.ׅ��Vf2�6S�z�[=�y�����+�~��	u��nw�(�\&΄W�a׋0�{��I�լY���$mmIm�i�a�dy���qHT`
* URL: https://kripto-piyasa-panosu.pages.dev/assets/index-Cg5DHePA.js
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/assets/index-Cg5DHePA.js`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2Fx7uKBpLV2dglbqYA9RdOo9PWKKx03WPQR`
  * Other Info: `�\{��i-]��V�`Qt�==b��M�=`
* URL: https://kripto-piyasa-panosu.pages.dev/assets/index-Dm2fdJpP.css
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/assets/index-Dm2fdJpP.css`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2FlUQBvjIyU821AulLG7Jzwtp7tMBj1Nxy`
  * Other Info: `�YT@�#%<�P.���'<-��L=M�`
* URL: https://kripto-piyasa-panosu.pages.dev/favicon.svg
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/favicon.svg`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `OBDM3YRqM7HhXvNiew8OQ8coAdY5sEE9jzzQSy9ZD6GBufGfVPeHUl4Vm3gob4SpPpY`
  * Other Info: `8�݄j3��^�b{C�(�9�A=�<�K/Y����T��R^�x(o��>�`
* URL: https://kripto-piyasa-panosu.pages.dev/manifest.webmanifest
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/manifest.webmanifest`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2FYT6fDfsiXMkUxVJNuZZuVhU812iNIj9tMyMmsDfnQEJKvkltvx1jizwBG`
  * Other Info: `�V��߲%̑LU$ۙf�aS�v��#��22k~t$�����8��`
* URL: https://kripto-piyasa-panosu.pages.dev/robots.txt
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/robots.txt`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2B3VF6SrXycjP2Tw201PdJLWLnztdTDgj2hpDgYhz8u16TvKXVwqbeqQnCSq9tdaOXh`
  * Other Info: `����_'#?d��MOt��.|�u0��hi!�˵�;�]\*mꐜ$���Z9x`
* URL: https://kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2FkJI6MEvJQRq0vNAdUB0QsOL2yqo7HnxYHVpKIpgOyrIzOU7vJ`
  * Other Info: `�Y	#����K���/l����Łդ�)��#3���`


Instances: 10

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
* URL: https://kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Dest`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 2

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
* URL: https://kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Mode`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 2

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
* URL: https://kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Site`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 2

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
* URL: https://kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: `Sec-Fetch-User`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 2

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
* URL: https://kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://kripto-piyasa-panosu.pages.dev/`
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


