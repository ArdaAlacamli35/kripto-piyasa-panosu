# ZAP Scanning Report

ZAP by [Checkmarx](https://checkmarx.com/).


## Summary of Alerts

| Risk Level | Number of Alerts |
| --- | --- |
| High | 0 |
| Medium | 3 |
| Low | 4 |
| Informational | 7 |




## Insights

| Level | Reason | Site | Description | Statistic |
| --- | --- | --- | --- | --- |
| Low | Warning |  | ZAP warnings logged - see the zap.log file for details | 1    |
| Info | Informational | https://once.kripto-piyasa-panosu.pages.dev | Percentage of responses with status code 2xx | 100 % |
| Info | Informational | https://once.kripto-piyasa-panosu.pages.dev | Percentage of endpoints with content type application/javascript | 12 % |
| Info | Informational | https://once.kripto-piyasa-panosu.pages.dev | Percentage of endpoints with content type application/manifest+json | 12 % |
| Info | Informational | https://once.kripto-piyasa-panosu.pages.dev | Percentage of endpoints with content type image/svg+xml | 12 % |
| Info | Informational | https://once.kripto-piyasa-panosu.pages.dev | Percentage of endpoints with content type text/css | 12 % |
| Info | Informational | https://once.kripto-piyasa-panosu.pages.dev | Percentage of endpoints with content type text/html | 25 % |
| Info | Informational | https://once.kripto-piyasa-panosu.pages.dev | Percentage of endpoints with content type text/plain | 25 % |
| Info | Informational | https://once.kripto-piyasa-panosu.pages.dev | Percentage of endpoints with method GET | 100 % |
| Info | Informational | https://once.kripto-piyasa-panosu.pages.dev | Count of total endpoints | 8    |
| Info | Informational | https://once.kripto-piyasa-panosu.pages.dev | Percentage of slow responses | 20 % |







## Alerts

| Name | Risk Level | Number of Instances |
| --- | --- | --- |
| Content Security Policy (CSP) Header Not Set | Medium | 3 |
| Cross-Domain Misconfiguration | Medium | Systemic |
| Missing Anti-clickjacking Header | Medium | 3 |
| Cross-Origin-Embedder-Policy Header Missing or Invalid | Low | 3 |
| Cross-Origin-Opener-Policy Header Missing or Invalid | Low | 3 |
| Permissions Policy Header Not Set | Low | 4 |
| Strict-Transport-Security Header Not Set | Low | Systemic |
| Base64 Disclosure | Informational | 9 |
| Re-examine Cache-control Directives | Informational | Systemic |
| Sec-Fetch-Dest Header is Missing | Informational | 4 |
| Sec-Fetch-Mode Header is Missing | Informational | 4 |
| Sec-Fetch-Site Header is Missing | Informational | 4 |
| Sec-Fetch-User Header is Missing | Informational | 4 |
| Storable but Non-Cacheable Content | Informational | Systemic |




## Alert Detail



### [ Content Security Policy (CSP) Header Not Set ](https://www.zaproxy.org/docs/alerts/10038/)



##### Medium (High)

### Description

Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware. CSP provides a set of standard HTTP headers that allow website owners to declare approved sources of content that browsers should be allowed to load on that page — covered types are JavaScript, CSS, HTML frames, fonts, images and embeddable objects such as Java applets, ActiveX, audio and video files.

* URL: https://once.kripto-piyasa-panosu.pages.dev
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 3

### Solution

Ensure that your web server, application server, load balancer, etc. is configured to set the Content-Security-Policy header.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
* [ https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html ](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
* [ https://www.w3.org/TR/CSP/ ](https://www.w3.org/TR/CSP/)
* [ https://w3c.github.io/webappsec-csp/ ](https://w3c.github.io/webappsec-csp/)
* [ https://web.dev/articles/csp ](https://web.dev/articles/csp)
* [ https://caniuse.com/#feat=contentsecuritypolicy ](https://caniuse.com/#feat=contentsecuritypolicy)
* [ https://content-security-policy.com/ ](https://content-security-policy.com/)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### Source ID: 3

### [ Cross-Domain Misconfiguration ](https://www.zaproxy.org/docs/alerts/10098/)



##### Medium (Medium)

### Description

Web browser data loading may be possible, due to a Cross Origin Resource Sharing (CORS) misconfiguration on the web server.

* URL: https://once.kripto-piyasa-panosu.pages.dev
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `Access-Control-Allow-Origin: *`
  * Other Info: `The CORS misconfiguration on the web server permits cross-domain read requests from arbitrary third party domains, using unauthenticated APIs on this domain. Web browser implementations do not permit arbitrary third parties to read the response from authenticated APIs, however. This reduces the risk somewhat. This misconfiguration could be used by an attacker to access data that is available in an unauthenticated manner, but which uses some other form of security, such as IP address white-listing.`
* URL: https://once.kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `Access-Control-Allow-Origin: *`
  * Other Info: `The CORS misconfiguration on the web server permits cross-domain read requests from arbitrary third party domains, using unauthenticated APIs on this domain. Web browser implementations do not permit arbitrary third parties to read the response from authenticated APIs, however. This reduces the risk somewhat. This misconfiguration could be used by an attacker to access data that is available in an unauthenticated manner, but which uses some other form of security, such as IP address white-listing.`
* URL: https://once.kripto-piyasa-panosu.pages.dev/assets/index-Dm2fdJpP.css
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/assets/index-Dm2fdJpP.css`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `Access-Control-Allow-Origin: *`
  * Other Info: `The CORS misconfiguration on the web server permits cross-domain read requests from arbitrary third party domains, using unauthenticated APIs on this domain. Web browser implementations do not permit arbitrary third parties to read the response from authenticated APIs, however. This reduces the risk somewhat. This misconfiguration could be used by an attacker to access data that is available in an unauthenticated manner, but which uses some other form of security, such as IP address white-listing.`
* URL: https://once.kripto-piyasa-panosu.pages.dev/robots.txt
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/robots.txt`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `Access-Control-Allow-Origin: *`
  * Other Info: `The CORS misconfiguration on the web server permits cross-domain read requests from arbitrary third party domains, using unauthenticated APIs on this domain. Web browser implementations do not permit arbitrary third parties to read the response from authenticated APIs, however. This reduces the risk somewhat. This misconfiguration could be used by an attacker to access data that is available in an unauthenticated manner, but which uses some other form of security, such as IP address white-listing.`
* URL: https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml`
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

### [ Missing Anti-clickjacking Header ](https://www.zaproxy.org/docs/alerts/10020/)



##### Medium (Medium)

### Description

The response does not protect against 'ClickJacking' attacks. It should include either Content-Security-Policy with 'frame-ancestors' directive or X-Frame-Options.

* URL: https://once.kripto-piyasa-panosu.pages.dev
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: `x-frame-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/`
  * Method: `GET`
  * Parameter: `x-frame-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: `x-frame-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 3

### Solution

Modern Web browsers support the Content-Security-Policy and X-Frame-Options HTTP headers. Ensure one of them is set on all web pages returned by your site/app.
If you expect the page to be framed only by pages on your server (e.g. it's part of a FRAMESET) then you'll want to use SAMEORIGIN, otherwise if you never expect the page to be framed, you should use DENY. Alternatively consider implementing Content Security Policy's "frame-ancestors" directive.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options)


#### CWE Id: [ 1021 ](https://cwe.mitre.org/data/definitions/1021.html)


#### WASC Id: 15

#### Source ID: 3

### [ Cross-Origin-Embedder-Policy Header Missing or Invalid ](https://www.zaproxy.org/docs/alerts/90004/)



##### Low (Medium)

### Description

Cross-Origin-Embedder-Policy header is a response header that prevents a document from loading any cross-origin resources that don't explicitly grant the document permission (using CORP or CORS).

* URL: https://once.kripto-piyasa-panosu.pages.dev
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: `Cross-Origin-Embedder-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/`
  * Method: `GET`
  * Parameter: `Cross-Origin-Embedder-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml`
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

### [ Cross-Origin-Opener-Policy Header Missing or Invalid ](https://www.zaproxy.org/docs/alerts/90004/)



##### Low (Medium)

### Description

Cross-Origin-Opener-Policy header is a response header that allows a site to control if others included documents share the same browsing context. Sharing the same browsing context with untrusted documents might lead to data leak.

* URL: https://once.kripto-piyasa-panosu.pages.dev
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: `Cross-Origin-Opener-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/`
  * Method: `GET`
  * Parameter: `Cross-Origin-Opener-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: `Cross-Origin-Opener-Policy`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 3

### Solution

Ensure that the application/web server sets the Cross-Origin-Opener-Policy header appropriately, and that it sets the Cross-Origin-Opener-Policy header to 'same-origin' for documents.
'same-origin-allow-popups' is considered as less secured and should be avoided.
If possible, ensure that the end user uses a standards-compliant and modern web browser that supports the Cross-Origin-Opener-Policy header (https://caniuse.com/mdn-http_headers_cross-origin-opener-policy).

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Opener-Policy ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Opener-Policy)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 14

#### Source ID: 3

### [ Permissions Policy Header Not Set ](https://www.zaproxy.org/docs/alerts/10063/)



##### Low (Medium)

### Description

Permissions Policy Header is an added layer of security that helps to restrict from unauthorized access or usage of browser/client features by web resources. This policy ensures the user privacy by limiting or specifying the features of the browsers can be used by the web resources. Permissions Policy provides a set of standard HTTP headers that allow website owners to limit which features of browsers can be used by the page such as camera, microphone, location, full screen etc.

* URL: https://once.kripto-piyasa-panosu.pages.dev
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/assets/index-Cg5DHePA.js
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/assets/index-Cg5DHePA.js`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 4

### Solution

Ensure that your web server, application server, load balancer, etc. is configured to set the Permissions-Policy header.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy)
* [ https://developer.chrome.com/blog/feature-policy/ ](https://developer.chrome.com/blog/feature-policy/)
* [ https://scotthelme.co.uk/a-new-security-header-feature-policy/ ](https://scotthelme.co.uk/a-new-security-header-feature-policy/)
* [ https://w3c.github.io/webappsec-feature-policy/ ](https://w3c.github.io/webappsec-feature-policy/)
* [ https://www.smashingmagazine.com/2018/12/feature-policy/ ](https://www.smashingmagazine.com/2018/12/feature-policy/)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### Source ID: 3

### [ Strict-Transport-Security Header Not Set ](https://www.zaproxy.org/docs/alerts/10035/)



##### Low (High)

### Description

HTTP Strict Transport Security (HSTS) is a web security policy mechanism whereby a web server declares that complying user agents (such as a web browser) are to interact with it using only secure HTTPS connections (i.e. HTTP layered over TLS/SSL). HSTS is an IETF standards track protocol and is specified in RFC 6797.

* URL: https://once.kripto-piyasa-panosu.pages.dev
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/assets/index-Dm2fdJpP.css
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/assets/index-Dm2fdJpP.css`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/robots.txt
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/robots.txt`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: ``
  * Other Info: ``

Instances: Systemic


### Solution

Ensure that your web server, application server, load balancer, etc. is configured to enforce Strict-Transport-Security.

### Reference


* [ https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html ](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html)
* [ https://owasp.org/www-community/Security_Headers ](https://owasp.org/www-community/Security_Headers)
* [ https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security ](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security)
* [ https://caniuse.com/stricttransportsecurity ](https://caniuse.com/stricttransportsecurity)
* [ https://datatracker.ietf.org/doc/html/rfc6797 ](https://datatracker.ietf.org/doc/html/rfc6797)


#### CWE Id: [ 319 ](https://cwe.mitre.org/data/definitions/319.html)


#### WASC Id: 15

#### Source ID: 3

### [ Base64 Disclosure ](https://www.zaproxy.org/docs/alerts/10094/)



##### Informational (Medium)

### Description

Base64 encoded data was disclosed by the application/web server. Note: in the interests of performance not all base64 strings in the response were analyzed individually, the entire response should be looked at by the analyst/security team/developer(s).

* URL: https://once.kripto-piyasa-panosu.pages.dev
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `1pOti9oCX6KvEKkdYwsI1NLNWbnfJQj`
  * Other Info: `֓���_���c���Y��%`
* URL: https://once.kripto-piyasa-panosu.pages.dev
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2BotoEsYZTDcHed3bD2h8K0sjsv0pwFsLu8lYMoQ63tf7aAEa2si3RDinVALLwya`
  * Other Info: `�-�Ke0��wl=��,����l.�%`��{_�kk"��P/�`
* URL: https://once.kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `ciVBQvzu7v0xZl5dPYhWYCAeNs82jtZo5uGxcUDgVZejxEUOiEK8AEtwsYYtp58`
  * Other Info: `r%AB����1f^]=�V` 6�6��h��q@�U���E�B� Kp��-��`
* URL: https://once.kripto-piyasa-panosu.pages.dev/.well-known/security.txt
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/.well-known/security.txt`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2F2rJ3PF46sIjjkFcL6YK2aYcjxgFpCO9WxdoKnCzp`
  * Other Info: `�]�'s���9p��+f�r<`���l]����`
* URL: https://once.kripto-piyasa-panosu.pages.dev/assets/index-Cg5DHePA.js
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/assets/index-Cg5DHePA.js`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2FApd9a1wLQdN79x7CnBnlvlhVdWhLeNRzhKc5l362w1Bod97Vy51nauk9B`
  * Other Info: `�P)wֵ��7�q�)��[�WV���G8Js�w�l5�}�\��v���`
* URL: https://once.kripto-piyasa-panosu.pages.dev/assets/index-Dm2fdJpP.css
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/assets/index-Dm2fdJpP.css`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2BvvQsQvUwleNJkh4dEv9obMjgpYyrCRK5AV9X8Ox5JeV7R9aANPix6lqrcYHqessUFfmnvJM6TM2w`
  * Other Info: `��B�/S	^4�!��/��̎
Xʰ�+��ǒ^W�}hO�������A_�{�3���`
* URL: https://once.kripto-piyasa-panosu.pages.dev/manifest.webmanifest
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/manifest.webmanifest`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `SocpCifLAI5ecRXrlq7d3i5Z5BGGAuJQetyGuv`
  * Other Info: `J�)
'� �^q떮��.Y���Pz܆�`
* URL: https://once.kripto-piyasa-panosu.pages.dev/robots.txt
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/robots.txt`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `2BhKZh0Cw6afkArTFXxLs5lMW5AIpyB54Ny08OOzzit0V4A`
  * Other Info: `�Jfæ��
�|K��L[�� y�ܴ���+tW�`
* URL: https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `i0t3qmZSETaXE0iUISrJygHm6ZKQeLgLJcPhvVlf58d7Q79x3ZUjNELDIjHensNiphF0BQCFQktkJ78fn92j37F65dPGYsqQYA8B4aqNSsyYUHdO`
  * Other Info: `�Kw�fR6�H�!*���钐x�%��Y_��{C�qݕ#4B�"1ޞ�b�t �BKd'��ݣ߱z���bʐ`᪍J̘PwN`


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

* URL: https://once.kripto-piyasa-panosu.pages.dev
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: `public, max-age=0, must-revalidate`
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/`
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: `public, max-age=0, must-revalidate`
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/manifest.webmanifest
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/manifest.webmanifest`
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: `public, max-age=0, must-revalidate`
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/robots.txt
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/robots.txt`
  * Method: `GET`
  * Parameter: `cache-control`
  * Attack: ``
  * Evidence: `public, max-age=0, must-revalidate`
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml`
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

* URL: https://once.kripto-piyasa-panosu.pages.dev
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Dest`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Dest`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/robots.txt
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/robots.txt`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Dest`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Dest`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 4

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

* URL: https://once.kripto-piyasa-panosu.pages.dev
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Mode`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Mode`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/robots.txt
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/robots.txt`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Mode`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Mode`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 4

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

* URL: https://once.kripto-piyasa-panosu.pages.dev
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Site`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Site`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/robots.txt
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/robots.txt`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Site`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: `Sec-Fetch-Site`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 4

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

* URL: https://once.kripto-piyasa-panosu.pages.dev
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: `Sec-Fetch-User`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/`
  * Method: `GET`
  * Parameter: `Sec-Fetch-User`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/robots.txt
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/robots.txt`
  * Method: `GET`
  * Parameter: `Sec-Fetch-User`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml`
  * Method: `GET`
  * Parameter: `Sec-Fetch-User`
  * Attack: ``
  * Evidence: ``
  * Other Info: ``


Instances: 4

### Solution

Ensure that Sec-Fetch-User header is included in user initiated requests.

### Reference


* [ https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-User ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-User)


#### CWE Id: [ 352 ](https://cwe.mitre.org/data/definitions/352.html)


#### WASC Id: 9

#### Source ID: 3

### [ Storable but Non-Cacheable Content ](https://www.zaproxy.org/docs/alerts/10049/)



##### Informational (Medium)

### Description

The response contents are storable by caching components such as proxy servers, but will not be retrieved directly from the cache, without validating the request upstream, in response to similar requests from other users.

* URL: https://once.kripto-piyasa-panosu.pages.dev
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=0`
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=0`
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/assets/index-Dm2fdJpP.css
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/assets/index-Dm2fdJpP.css`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=0`
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/robots.txt
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/robots.txt`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=0`
  * Other Info: ``
* URL: https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml
  * Node Name: `https://once.kripto-piyasa-panosu.pages.dev/sitemap.xml`
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


