---
type: concept
course: Security+ SY0-801
status: synthesized
aliases: []
tags:
  - cybersecurity/concept
  - security-plus
---
# OAuth and OIDC

**Definition:** OAuth 2.0 is an authorization framework for delegated access; OpenID Connect (OIDC) adds an authentication/identity layer on top of OAuth.

## Key points

- Do not treat an OAuth access token alone as proof of an end user’s identity.
- Inspect audience, scopes, expiry, token storage, revocation and binding to the requester when applicable.
- SAML commonly carries signed identity assertions; LDAP is a directory protocol; Kerberos uses tickets.

## AI security example

> [!example] Application
> An AI tool receives a narrowly scoped token to read approved calendar events, rather than the user’s full password.

## Check your understanding

How could a stolen broad-scope access token bypass a login-time MFA challenge?

## Related concepts

[[IAM]] · [[AAA (Authentication Authorization Accounting)]] · [[AI Agent Security]]

## Sources

[[Lesson 15 - Identity and Access Management|Lesson 15]] · [↗ Video](https://www.youtube.com/watch?v=CfVDAQ9FGFE)

## Back to the learning map

[[Security+ - Master Notes|Security+ master note]] · [[Index|Lesson index]]
