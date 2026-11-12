---
type: video-study-note
course: Security+ SY0-801
provider: CertCrush
lesson: 03
source_video: https://www.youtube.com/watch?v=Xns4tNjM-yg
priority: Essential
status: generated-review
aliases:
  - 'CertCrush Lesson 03'
tags:
  - security-plus
  - certcrush
  - study-notes
---
# Lesson 03 — Cryptography Essentials

**[▶ Watch video](https://www.youtube.com/watch?v=Xns4tNjM-yg)** · [[004 - Security+ SY0-801 Cryptography Explained for Beginners (Lesson 3)|Full transcript]] · [[Security+ - Master Notes|Consolidated notes]] · [[Index|All lessons]]

> [!summary] Learning target — Essential
> Understand the concepts and be able to explain **why the safeguards work, where they fail, and how to verify them**. These are synthesized study notes, **not** the video transcript.

## Encryption: symmetric vs asymmetric · [↗ 02:46](https://www.youtube.com/watch?v=Xns4tNjM-yg&t=166s)

- Symmetric encryption uses the **same secret key** to encrypt and decrypt; AES suits large volumes of data.
- Asymmetric cryptography uses a public/private key pair for signatures and some key-establishment/encryption applications.
- Modern TLS uses authenticated asymmetric key establishment plus efficient symmetric session encryption; avoid a simplistic “encrypt the session key with RSA” model for TLS 1.3.

## Keys, algorithms and modes · [↗ 07:04](https://www.youtube.com/watch?v=Xns4tNjM-yg&t=424s)

- AES commonly uses 128-, 192- or 256-bit keys. Larger keys do not compensate for poor key handling or implementation.
- At a similar **classical** security level, about 256-bit elliptic-curve keys correspond to 3072-bit RSA keys; do not compare bit lengths across algorithms directly.
- ECB leaks repeated-block patterns. Prefer appropriately implemented **authenticated encryption** such as AES-GCM.

## Hashing and password storage · [↗ 09:06](https://www.youtube.com/watch?v=Xns4tNjM-yg&t=546s)

- [[Hashing and Password Storage]]: a cryptographic hash is a one-way digest; it is **not** encryption and does not hide a secret.
- To detect tampering, compare with an authenticated or otherwise trusted expected digest.
- For passwords, use unique salts plus a deliberately expensive password KDF (e.g., Argon2id); plain SHA-256 is not enough.

## Signatures, PKI and certificate trust · [↗ 12:45](https://www.youtube.com/watch?v=Xns4tNjM-yg&t=765s)

- [[Digital Signatures]] can authenticate possession of a private key and detect message alteration.
- [[PKI and TLS]] uses certificates, issuers and trust chains to bind a public key to a verified identity/name.
- Validate the certificate chain, name, validity and applicable revocation status; secure private keys and issuance processes.


## Apply it to AI security assurance

> [!example] Scenario
> Review encryption claims for an AI service by separating transport, storage, identity, key management and application authorization.

> [!warning] Accuracy note
> “Encryption ensures security” is false: privileged processes may decrypt data legitimately and then misuse it.

## Active recall — answer before reopening the notes

1. What do TLS, disk encryption and database authorization each protect—and not protect?
2. Why does a digest sent alongside an untrusted file fail to establish integrity?
3. How can a valid certificate still be associated with a compromised application?

## Personal additions

- **What I misunderstood:**
- **One real example:**
- **One unresolved question:**
