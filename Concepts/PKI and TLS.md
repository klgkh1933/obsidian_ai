---
type: concept
course: Security+ SY0-801
status: synthesized
aliases: []
tags:
  - cybersecurity/concept
  - security-plus
---
# PKI and TLS

**Definition:** Public key infrastructure (PKI) manages certificates and trust relationships; TLS protects traffic through authenticated negotiation and encryption.

## Key points

- Certificates connect identities/names to public keys through a trust chain; validate issuer, name, validity and policy.
- Private keys need secure generation, storage, rotation and revocation response; HSM/KMS may help.
- TLS 1.3 commonly uses ephemeral Diffie–Hellman key establishment, enabling forward secrecy. TLS does not determine whether the authenticated application is authorized to reveal data.

## AI security example

> [!example] Application
> An AI service’s API connection may be encrypted while the backend still over-shares private documents.

## Check your understanding

Why is certificate validation necessary during an encrypted session?

## Related concepts

[[Digital Signatures]] · [[IAM]] · [[Hashing and Password Storage]]

## Sources

[[Lesson 03 - Cryptography Essentials|Lesson 03]] · [↗ Video](https://www.youtube.com/watch?v=Xns4tNjM-yg) · [[Lesson 04 - Encryption in Practice|Lesson 04]] · [↗ Video](https://www.youtube.com/watch?v=i_T7hNmbgEQ) · [[Lesson 11 - Network Architecture and Secure Access|Lesson 11]] · [↗ Video](https://www.youtube.com/watch?v=X_nHCg144zE)

## Back to the learning map

[[Security+ - Master Notes|Security+ master note]] · [[Index|Lesson index]]
