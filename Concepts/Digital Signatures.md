---
type: concept
course: Security+ SY0-801
status: synthesized
aliases: []
tags:
  - cybersecurity/concept
  - security-plus
---
# Digital Signatures

**Definition:** A digital signature binds a private-key signing operation to a message or digest and can verify integrity and possession of the associated key.

## Key points

- The verifier checks with the public key, whose identity should be bound through trusted means.
- Signatures can support origin authentication and non-repudiation, but evidence depends on private-key custody, identity proofing and process controls.
- Signatures do not, by themselves, encrypt the signed message.

## AI security example

> [!example] Application
> A trusted publisher signs model artifacts so a deployment pipeline can detect replacement or tampering.

## Check your understanding

Does a valid signature prove the code or model is free of vulnerabilities?

## Related concepts

[[Hashing and Password Storage]] · [[PKI and TLS]] · [[Third-Party Risk]]

## Sources

[[Lesson 01 - Security Goals, AAA and Zero Trust|Lesson 01]] · [↗ Video](https://www.youtube.com/watch?v=RZnprQW-3Ac) · [[Lesson 03 - Cryptography Essentials|Lesson 03]] · [↗ Video](https://www.youtube.com/watch?v=Xns4tNjM-yg)

## Back to the learning map

[[Security+ - Master Notes|Security+ master note]] · [[Index|Lesson index]]
