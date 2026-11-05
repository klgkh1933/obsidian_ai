---
type: concept
course: Security+ SY0-801
status: synthesized
aliases: []
tags:
  - cybersecurity/concept
  - security-plus
---
# Hashing and Password Storage

**Definition:** Cryptographic hashing maps input into a fixed-length digest and is designed to be one-way; it does not encrypt or conceal the original data.

## Key points

- Integrity checks require a known trustworthy reference digest; anyone who can replace both file and digest may defeat naive checks.
- Use collision-resistant hashes appropriate to the task and authenticated digital signatures when origin matters.
- Passwords require a unique salt and a memory-hard/slow password KDF such as Argon2id (or policy-approved equivalents); raw SHA-256 is unsuitable.

## AI security example

> [!example] Application
> Verify downloaded model weights against trusted signed metadata; protect credentials for model and data repositories.

## Check your understanding

Why is hashing a password with SHA-256 alone weaker than Argon2id?

## Related concepts

[[Digital Signatures]] · [[PKI and TLS]] · [[Data Classification and DLP]]

## Sources

[[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 03 - Cryptography Essentials|Lesson 03]] · [↗ Video](https://www.youtube.com/watch?v=Xns4tNjM-yg) · [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 04 - Encryption in Practice|Lesson 04]] · [↗ Video](https://www.youtube.com/watch?v=i_T7hNmbgEQ)

## Back to the learning map

[[Secutiry+/A-MyNotes/Generated-CertCrush/Security+ - Master Notes|Security+ master note]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Index|Lesson index]]
