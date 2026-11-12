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

**[▶ Watch video](https://www.youtube.com/watch?v=Xns4tNjM-yg)** · [[004 - Security+ SY0-801 Cryptography Explained for Beginners (Lesson 3)|Full transcript]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Security+ - Master Notes|Consolidated notes]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Index|All lessons]]

> [!summary] Learning target — Essential
> Understand the concepts and be able to explain **why the safeguards work, where they fail, and how to verify them**. These are synthesized study notes, **not** the video transcript.

## Encryption: symmetric vs asymmetric · [↗ 02:46](https://www.youtube.com/watch?v=Xns4tNjM-yg&t=166s)

- Symmetric encryption 
	- uses the **same secret key** to encrypt and decrypt; 
	- Fast: suits large volumes of data.
	- AES: the gold **standard** (Advanced Encryption Standard)
		- AES 128 or ==256==
		- DES, Triple DES: legacy, too short key
	- Problem: Key distribution
- Asymmetric cryptography 
	- uses a public/private key pair for signatures and some key-establishment/encryption applications.
	- Problem: slow, computationally heavy
	- RSA classic,
	- ECC small keys (same security, for phones and low powered devices)
- Hybrid usage: Modern TLS 
	- TLS 1.3 (Transport Layer Security)
	- TLS 1.3 uses
		- ephemeral ==[[ECDHE]]== for key agreement, 
		- RSA or ECDSA  for authentication through digital signatures.
	- uses efficient symmetric session encryption (AES)
	-  ![[Pasted image 20261109115656.png]]
## Keys, algorithms and modes · [↗ 07:04](https://www.youtube.com/watch?v=Xns4tNjM-yg&t=424s)

- AES commonly uses 128-, 192- or 256-bit keys. Larger keys do not compensate for poor key handling or implementation.
- At a similar **classical** security level, about 256-bit elliptic-curve keys correspond to 3072-bit RSA keys; do not compare bit lengths across algorithms directly.
- ECB leaks repeated-block patterns. Prefer appropriately implemented **authenticated encryption** such as AES-GCM.
![[Pasted image 20261109140032.png]]

**Modes**:
- e.g.: AES-256-***GCM***: AES with a 256-bit key operating in GCM mode.
- 
![[Pasted image 20261109140359.png]]

- ECB (Electronic Codebook): Simple, but ***insecure*** for most applications.
- CBC (Cipher Block Chaining): Provides ***confidentiality*** when used correctly, **but not integrity.**
- GCM (Galois/Counter Mode): Provides ***both confidentiality and integrity***. Recommended for modern TLS.

##>> Revision from here
## Hashing and password storage · [↗ 09:06](https://www.youtube.com/watch?v=Xns4tNjM-yg&t=546s)

- [[Hashing and Password Storage]]: a cryptographic hash is a one-way digest; it is **not** encryption and does not hide a secret.
- To detect tampering, compare with an authenticated or otherwise trusted expected digest.
- SHA: Secure Hash Algorithm
	- SHA 2 and SHA 3 are the current families
	- MD5 broken, SHA 1 retired 
- ![[Pasted image 20261109140925.png]]
- Passwords
	- are stored as hashes, not plain text
	- rainbow tables: giant precomputed list/table of common passwords and their hashes
		- Hackers steal the hashes, look them up, and get the password
	- defense: use Salt = a random value added to the password
	- ![[Pasted image 20261109141733.png]]
	- use unique salts plus a deliberately expensive password KDF (e.g., Argon2id); plain SHA-256 is not enough.
-  ![[Pasted image 20261109144958.png]]
## Signatures, PKI and certificate trust · [↗ 12:45](https://www.youtube.com/watch?v=Xns4tNjM-yg&t=765s)

- [[Digital Signatures]] can authenticate possession of a private key and detect message alteration.
	- ![[Pasted image 20261109141930.png]]
	- ![[Pasted image 20261109143838.png]]
- [[PKI and TLS]] 
	- PKI: Public Key Infrastructure
	- uses certificates, issuers and trust chains to bind a public key to a verified identity/name.
	- ![[Pasted image 20261109144058.png]]
	- ![[Pasted image 20261109144240.png]]
- Validate the certificate chain, name, validity and applicable revocation status; secure private keys and issuance processes.

## Examples
- ![[Pasted image 20261109150344.png]]
- ![[Pasted image 20261109150424.png]]
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
