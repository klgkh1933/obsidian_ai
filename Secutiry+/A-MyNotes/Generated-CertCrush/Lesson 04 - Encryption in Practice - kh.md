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

## Key Exchange 
- [[ECDHE]] (Elliptic Curve Diffie-Hellman Ephemeral)

## Certificates and key protection · [↗ 07:44](https://www.youtube.com/watch?v=i_T7hNmbgEQ&t=464s)

- Self-signed certificates can be appropriate in controlled environments **if explicitly trusted**; public sites usually require trusted issuance.
- Certificate Authority
	- a Root CA (DigiCert and GlobalSign)
	- an Intermediate CA are part of a system called ==Public Key Infrastructure (PKI)==, which allows computers to verify identities and establish trust in digital certificates.
	- ![359](data:image/svg+xml;charset=utf-8,%3Csvg%20font-family%3D%22-apple-system-body%2C%20ui-sans-serif%2C%20-apple-system%2C%20system-ui%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Helvetica%2C%20%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%20Arial%2C%20sans-serif%2C%20%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%20%26quot%3BSegoe%20UI%20Symbol%26quot%3B%22%20font-weight%3D%22400%22%20data-d-component%3D%22svg%22%20fill%3D%22currentColor%22%20style%3D%22color%3Argb\(237%2C%20237%2C%20237\)%22%20viewBox%3D%220%200%20340%20325%22%20width%3D%22100%25%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20x%3D%2277%22%20y%3D%228%22%20width%3D%22186%22%20height%3D%2267%22%20rx%3D%229%22%20fill%3D%22%23DCEAFE%22%20stroke%3D%22%235685C8%22%2F%3E%3Cg%20text-anchor%3D%22middle%22%20fill%3D%22%23183C75%22%3E%3Ctext%20x%3D%22170%22%20y%3D%2229%22%20font-size%3D%2214%22%20font-weight%3D%22700%22%3ERoot%20CA%3C%2Ftext%3E%3Ctext%20x%3D%22170%22%20y%3D%2245%22%20font-size%3D%2210.5%22%3ESelf-signed%20certificate%3C%2Ftext%3E%3Ctext%20x%3D%22170%22%20y%3D%2260%22%20font-size%3D%2210.5%22%3ETrusted%20by%20OS%20%2F%20browser%3C%2Ftext%3E%3C%2Fg%3E%3Cpath%20d%3D%22M170%2075%20V115%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.8%22%2F%3E%3Cpath%20d%3D%22M165%20108%20L170%20116%20L175%20108%22%20stroke%3D%22%2364748B%22%20fill%3D%22none%22%20stroke-width%3D%221.8%22%2F%3E%3Crect%20x%3D%2277%22%20y%3D%22117%22%20width%3D%22186%22%20height%3D%2267%22%20rx%3D%229%22%20fill%3D%22%23DDF3E7%22%20stroke%3D%22%2355A47A%22%2F%3E%3Cg%20text-anchor%3D%22middle%22%20fill%3D%22%23175638%22%3E%3Ctext%20x%3D%22170%22%20y%3D%22138%22%20font-size%3D%2214%22%20font-weight%3D%22700%22%3EIntermediate%20CA%3C%2Ftext%3E%3Ctext%20x%3D%22170%22%20y%3D%22154%22%20font-size%3D%2210.5%22%3ESigned%20by%20Root%20CA%3C%2Ftext%3E%3Ctext%20x%3D%22170%22%20y%3D%22169%22%20font-size%3D%2210.5%22%3EIssues%20server%20certificates%3C%2Ftext%3E%3C%2Fg%3E%3Cpath%20d%3D%22M170%20184%20V224%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.8%22%2F%3E%3Cpath%20d%3D%22M165%20217%20L170%20225%20L175%20217%22%20stroke%3D%22%2364748B%22%20fill%3D%22none%22%20stroke-width%3D%221.8%22%2F%3E%3Crect%20x%3D%2277%22%20y%3D%22227%22%20width%3D%22186%22%20height%3D%2266%22%20rx%3D%229%22%20fill%3D%22%23FEF0D4%22%20stroke%3D%22%23D7A64C%22%2F%3E%3Cg%20text-anchor%3D%22middle%22%20fill%3D%22%23754C12%22%3E%3Ctext%20x%3D%22170%22%20y%3D%22249%22%20font-size%3D%2214%22%20font-weight%3D%22700%22%3EServer%20Certificate%3C%2Ftext%3E%3Ctext%20x%3D%22170%22%20y%3D%22265%22%20font-size%3D%2210.5%22%3ESigned%20by%20Intermediate%20CA%3C%2Ftext%3E%3Ctext%20x%3D%22170%22%20y%3D%22280%22%20font-size%3D%2210.5%22%3Ee.g.%20www.example.com%3C%2Ftext%3E%3C%2Fg%3E%3Ctext%20x%3D%22273%22%20y%3D%2299%22%20font-size%3D%2210%22%20fill%3D%22currentColor%22%3ESigns%20%E2%86%93%3C%2Ftext%3E%3Ctext%20x%3D%22273%22%20y%3D%22208%22%20font-size%3D%2210%22%20fill%3D%22currentColor%22%3ESigns%20%E2%86%93%3C%2Ftext%3E%3Ctext%20x%3D%22170%22%20y%3D%22317%22%20text-anchor%3D%22middle%22%20font-size%3D%2211%22%20fill%3D%22currentColor%22%3ECertificate%20chain%20of%20trust%3C%2Ftext%3E%3C%2Fsvg%3E)
- How to get a certificate:
	1. Generate a key pair on your server
		- Private key: stays on the server.
		- Public key: will be included in the CSR.
	2. Create and submit the CSR
		- The CSR contains your public key, requested identity information (including domain names), and a signature proving possession of the private key.
	3. CA validates your request
		- The CA verifies that you control the domain and performs any additional validation required for the certificate type.
	4. CA issues your certificate
		- You typically receive your server certificate and the necessary Intermediate CA certificate(s).
	5. Install the certificates on your server
		- Configure your web server with your private key, issued server certificate, and intermediate certificate chain.
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
