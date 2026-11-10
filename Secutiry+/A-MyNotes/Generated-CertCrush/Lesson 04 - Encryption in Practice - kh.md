---
type: video-study-note
course: Security+ SY0-801
provider: CertCrush
lesson: 04
source_video: https://www.youtube.com/watch?v=i_T7hNmbgEQ
priority: Essential
status: generated-review
aliases:
  - 'CertCrush Lesson 04'
tags:
  - security-plus
  - certcrush
  - study-notes
---
# Lesson 04 — Encryption in Practice

**[▶ Watch video](https://www.youtube.com/watch?v=i_T7hNmbgEQ)** · [[Secutiry+/CertCrush/005 - Security+ SY0-801 Encryption in Practice Explained (Lesson 4)|Full transcript]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Security+ - Master Notes|Consolidated notes]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Index|All lessons]]

> [!summary] Learning target — Essential
> Understand the concepts and be able to explain **why the safeguards work, where they fail, and how to verify them**. These are synthesized study notes, **not** the video transcript.

## Choose encryption by threat and data state · [↗ 01:06](https://www.youtube.com/watch?v=i_T7hNmbgEQ&t=66s)

- ==Data at rest==
	- ![[Pasted image 20261110150333.png]]
	- ![[Pasted image 20261110150545.png]]
- In transit (in motion)
	- ![[Pasted image 20261110150741.png]]
	- ![[Pasted image 20261110151344.png]]
	- ![[Pasted image 20261110153635.png|369]]
	- There are two approaches to securing communication.
		1. Add TLS to an existing protocol
			- HTTP → HTTPS
		    - FTP → FTPS	    
			- LDAP → LDAPS
		    
			- These retain the underlying application protocol while protecting communication with TLS.
		
		2. Replace an insecure protocol with a different secure protocol
			- Telnet → SSH
			- FTP → SFTP
- In use
- Choose the plac ement of keys and decryption privileges based on who should be able to see each record.

## Transport, key exchange and forward secrecy · [↗ 03:16](https://www.youtube.com/watch?v=i_T7hNmbgEQ&t=196s)

- Use properly validated TLS/SSH/IPsec to protect traffic over untrusted networks.
- [[PKI and TLS]]: authenticated ephemeral Diffie–Hellman key exchange (often ECDHE) offers **forward secrecy** for recorded past sessions if a long-term key is later exposed.
- Certificates authenticate the endpoint; an unverified key exchange alone can be intercepted.

## Certificates and key protection · [↗ 07:44](https://www.youtube.com/watch?v=i_T7hNmbgEQ&t=464s)

- Self-signed certificates can be appropriate in controlled environments **if explicitly trusted**; public sites usually require trusted issuance.
- A CSR contains identifying data and the public key; keep the private key private.
- Wildcard certificates cover limited matching subdomains and enlarge the consequences of key compromise.
- Use lifecycle controls: issuance, expiry, rotation, revocation; TPM, HSM or KMS where warranted.

## Not all transformations are encryption · [↗ 14:22](https://www.youtube.com/watch?v=i_T7hNmbgEQ&t=862s)

- Obfuscation hides meaning but does not provide strong confidentiality.
- Tokenization substitutes a controlled reference; masking hides parts of data; hashing creates a digest.
- Modern password stores rely on salted, slow password hashing—not simple SHA-256.

## Post-quantum planning · [↗ 18:43](https://www.youtube.com/watch?v=i_T7hNmbgEQ&t=1123s)

- Long-lived sensitive data may justify planning for migration to standardized post-quantum algorithms.
- Maintain algorithm inventories and crypto-agility; deployment should follow approved government/organizational guidance.


## Apply it to AI security assurance

> [!example] Scenario
> Distinguish encrypted model stores, encrypted prompts in transit, and the permissions of AI applications that decrypt records.

## Active recall — answer before reopening the notes

1. Would encrypting an AI system’s disk stop its own overprivileged service account?
2. What does forward secrecy protect?
3. What exactly does a certificate authority attest to?

## Personal additions

- **What I misunderstood:**
- **One real example:**
- **One unresolved question:**
