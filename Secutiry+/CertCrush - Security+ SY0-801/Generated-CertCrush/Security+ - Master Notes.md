---
type: master-study-notes
course: Security+ SY0-801
provider: CertCrush
status: synthesized
tags:
  - security-plus
  - study-notes
  - knowledge-map
---
# Security+ SY0-801 — Master Notes

> [!summary] Purpose
> Consolidated Security+ fundamentals for **AI security assurance and supervisory work**, distilled from the 20 individual CertCrush videos. This is not the unedited transcript, nor a complete Security+ exam preparation guide.

[[Index|Lesson index]] · [[Main -  CompTIA SecAI+ (CY0-001)|Your SecAI+ starting page]] · [Original CertCrush course](https://www.youtube.com/watch?v=3_gU5xEIV30)

## How to use this page

- Use this page to connect concepts across lessons; use a [[Index|lesson note]] for fuller explanations and timestamped sources.
- Follow concept-page wikilinks for short reusable definitions, common mistakes and AI-security examples.
- After studying a section, close the notes and answer an application question from memory.
- The original transcripts remain unchanged under `Secutiry+/CertCrush`.

## 01 · Security principles

### CIA, DAD and evidence

- [[CIA]]: confidentiality = appropriate access; integrity = trustworthy authorized change; availability = usable when required.
- DAD failures: disclosure, alteration and destruction. Destruction is only *one* cause of lost availability.
- Authenticity identifies genuine origin; [[Digital Signatures]] can substantiate integrity and key possession; [[AAA (Authentication Authorization Accounting)]] and protected logs support accountability.
- **Important:** a log record does not automatically prove non-repudiation; a digest without a trusted reference does not prove integrity.

**Lessons:** [[Lesson 01 - Security Goals, AAA and Zero Trust|Lesson 01]] · [[Lesson 03 - Cryptography Essentials|Lesson 03]]

### Security control reasoning

- [[Security Controls]]: distinguish *implementation category* (technical, managerial, operational, physical) from *function* (preventive, detective, corrective, deterrent, directive, compensating).
- [[Defense in Depth]] stacks independent safeguards; [[Least Privilege]] reduces the damage of a compromised identity; [[Separation of Duties]] divides conflicting authority.
- [[Change Management]]: approve, test, deploy, verify and document—plan rollback and exceptions.

**Lessons:** [[Lesson 02 - Security Controls and Change Management|Lesson 02]] · [[Lesson 10 - Hardening and Security Mitigations|Lesson 10]]

## 02 · Identity, authorization and zero trust

### Identity and access

- [[IAM]]: proofing, provisioning, authentication, authorization, review, revocation and deprovisioning.
- Account types: human, privileged administrator, emergency/break-glass and non-human workload/service.
- [[RBAC and ABAC]]: roles grant coarse rights, attributes/context refine resource access; test inherited and excessive permissions.
- [[Identity Threats]]: password spraying, phishing, token replay/session theft; MFA at login does not neutralize a subsequently stolen bearer token.
- [[OAuth and OIDC]]: OAuth delegated authorization; OIDC identity; SAML SSO assertions; LDAP directories; Kerberos tickets.

**Lessons:** [[Lesson 01 - Security Goals, AAA and Zero Trust|Lesson 01]] · [[Lesson 15 - Identity and Access Management|Lesson 15]]

### Zero trust

- [[Zero Trust]] verifies identity, device/workload posture, context and requested resource, including inside the private network.
- Policy decision and enforcement components perform different duties; reevaluate context and test denied requests.
- An AI agent or service account is not a substitute for **end-user document authorization**.

**Lessons:** [[Lesson 05 - Zero Trust Architecture|Lesson 05]] · [[Lesson 15 - Identity and Access Management|Lesson 15]]

## 03 · Cryptography and data protection

### Encryption, signatures and trust

- AES symmetric encryption protects bulk data; public-key cryptography enables signatures and authenticated key establishment.
- [[Hashing and Password Storage]]: digest ≠ encryption; salt + slow KDF for passwords (e.g., Argon2id), not raw SHA-256.
- [[Digital Signatures]] and [[PKI and TLS]]: verify source and certificate chain; TLS protects traffic but not the rightness of an application’s access decisions.
- ECDHE offers forward secrecy; HSM/KMS/TPM and certificate lifecycle reduce private-key exposure; encrypted disks do not prevent authorized plaintext access.

**Lessons:** [[Lesson 03 - Cryptography Essentials|Lesson 03]] · [[Lesson 04 - Encryption in Practice|Lesson 04]]

### Data handling

- [[Data Classification and DLP]]: protect by sensitivity, classify owners and enforce approved handling; DLP helps detect unwanted movement.
- Encryption, tokenization, masking, de-identification, obfuscation and hashing solve different problems.
- [[Data Lifecycle]] includes records, prompts, embeddings, caches, logs, backups, retention holds and verifiable disposal.
- [[Data Exfiltration]] can use authorized agents, email connectors or application outputs even though traffic is encrypted.

**Lessons:** [[Lesson 13 - Data Protection and Information Lifecycle|Lesson 13]] · [[Lesson 08 - AI Threats and Indicators of Compromise|Lesson 08]]

## 04 · Threats and weaknesses

### Threats and attack surfaces

- [[Threat Modeling]] identifies adversaries, assets, trust boundaries, vectors, impact and mitigations.
- [[Attack Surface]] = all exposed entry points; vector = specific route. Includes suppliers, API endpoints, stolen accounts and unreviewed experiments.
- Malware: virus, worm, Trojan, ransomware, spyware, rootkit, logic bomb, fileless abuse.
- Human vectors: phishing, smishing, vishing, quishing, deepfake impersonation; use independent verification.

**Lessons:** [[Lesson 06 - Threat Actors, Vectors and Intelligence|Lesson 06]] · [[Lesson 07 - Malware, Human Attacks and Deepfakes|Lesson 07]]

### Vulnerability analysis

- [[Vulnerability Management]]: discover, validate, prioritize, remediate, verify and report.
- [[CVE CWE CVSS]]: CVE is an identifier, CWE a weakness class, CVSS a severity measure—not the entire organizational risk.
- Risk depends on reachability, exploitation, business impact, affected information and compensating controls.
- Hardening, patching, isolation, allowlisting, code review and tested negative permissions reduce exposure.

**Lessons:** [[Lesson 09 - Vulnerabilities, CVE, CWE and CVSS|Lesson 09]] · [[Lesson 10 - Hardening and Security Mitigations|Lesson 10]] · [[Lesson 17 - Asset and Vulnerability Management|Lesson 17]]

## 05 · Network and cloud architecture

### Network boundaries

- [[Network Segmentation]]: separate DMZ/public services, business APIs, databases and admin planes; test both allowed and denied routes.
- Firewalls control traffic; IDS detects; IPS blocks; NAC controls device admission; VPN secures connectivity but does not grant application authorization.
- Fail-open and fail-closed express an availability/security trade-off; select deliberately for each resource.

**Lessons:** [[Lesson 11 - Network Architecture and Secure Access|Lesson 11]] · [[Lesson 05 - Zero Trust Architecture|Lesson 05]]

### Cloud responsibilities

- [[Cloud Shared Responsibility]] changes across IaaS, PaaS and SaaS but never removes customer responsibility for identities, configuration and data.
- Microservices, serverless and IaC require controlled identities, dependencies and change testing.
- Data locality, jurisdiction, hosting, subprocessors and approved cloud security posture must be separately verified.

**Lessons:** [[Lesson 12 - Cloud Security and Shared Responsibility|Lesson 12]] · [[Lesson 20 - Third-Party Security, Compliance and Assessments|Lesson 20]]

## 06 · AI-specific threats and controls

### AI model and data attacks

- [[Prompt Injection]] promotes untrusted content (e.g. retrieved documents) into attempted instructions; direct and indirect routes differ.
- Jailbreaking targets model behavioral restrictions; evasion changes runtime inputs to fool a model; [[AI Data Poisoning]] compromises training **or retrieval** data.
- Model file manipulation and untrusted dependencies need signed provenance, versioning, validation and supplier review.
- Hallucinations, bias and lack of explainability are different kinds of AI reliability/trustworthiness problems.

**Lessons:** [[Lesson 08 - AI Threats and Indicators of Compromise|Lesson 08]]

### Agents and sensitive actions

- [[AI Agent Security]]: limit permitted tools, APIs, commands, identities, resource access and outbound connections.
- Enforce **authorization outside the model**, require approvals for high-impact actions, and trace each tool call.
- A well-designed system should prevent exfiltration even when the model obeys a hostile retrieved passage.
- Monitor prompt injection and data exfiltration at deterministic application and tool boundaries.

**Lessons:** [[Lesson 08 - AI Threats and Indicators of Compromise|Lesson 08]] · [[Lesson 16 - Monitoring, SIEM, SOAR and Security AI|Lesson 16]]

## 07 · Security operations and recovery

### Telemetry, automation and response

- [[SIEM and SOAR]]: SIEM aggregates/correlates logs and generates alerts; SOAR executes governed response playbooks.
- Investigate false positives, false negatives and missing telemetry feeds; keep auditable evidence.
- [[Security Automation]] should have scoped credentials, human approval for high-impact actions, and rollback.
- [[Incident Response]]: prepare, detect/analyze, contain, eradicate, recover, communicate and learn; operational phases often overlap.

**Lessons:** [[Lesson 16 - Monitoring, SIEM, SOAR and Security AI|Lesson 16]] · [[Lesson 18 - Incident Response and Forensics|Lesson 18]]

### Resilience and asset control

- [[Asset Inventory]] includes hardware, software, cloud assets, data and AI-specific components with owners.
- [[RTO and RPO]]: RTO = acceptable downtime; RPO = tolerable data loss. MTTR/MTBF are observed reliability measures.
- [[Business Continuity and Disaster Recovery]]: backups, immutable/offline copies, tested restoration, alternative service procedures.
- A restored AI service needs both its data/index and the correct identity/authorization policies.

**Lessons:** [[Lesson 14 - Availability, Backups and Disaster Recovery|Lesson 14]] · [[Lesson 17 - Asset and Vulnerability Management|Lesson 17]]

## 08 · Governance, risk and assurance

### Risk decisions and policy

- [[Security Governance]]: policy (intent), standard (mandatory specification), procedure (steps), guideline (recommended), baseline (minimum accepted configuration).
- [[Risk Assessment]] records threat scenario, likelihood, consequence, controls and evidence; optional ALE = SLE × ARO for appropriate quantified estimates.
- Avoid, reduce, transfer/share or accept risk. [[Residual Risk]] still requires an accountable owner and decision authority.
- NIST CSF outcomes help structure review; federal and departmental controls must be assessed under the applicable GC processes.

**Lessons:** [[Lesson 19 - Governance, Policies and Risk Treatment|Lesson 19]]

### Supplier assurance and authorization

- [[Third-Party Risk]]: diligence, contractual data handling, SLA, access, reporting, audit rights, subcontractor review and exit.
- [[Security Assessment and Authorization]]: define scope/requirements, evaluate control design, gather test evidence, report gaps, and obtain a documented decision by authorized risk owners.
- Audit evidence, independent testing and awareness outcomes show whether required controls are working.

**Lessons:** [[Lesson 20 - Third-Party Security, Compliance and Assessments|Lesson 20]]

## At-a-glance relationships

| Principle | What it tells you | Limitation / test |
|---|---|---|
| CIA | What must be protected | Does not say how to enforce controls |
| AAA | Who, what they may do, what they did | Valid identity ≠ authorization |
| Zero Trust | Verify access to a specific resource | A VPN or internal IP is not a permission |
| Encryption | Hide plaintext in the intended threat model | An authorized or compromised process may still decrypt |
| Hash | Detect differences against a trusted digest | Unauthenticated digest ≠ origin proof |
| Signature | Verify key possession and message integrity | Does not imply code/model safety |
| SIEM | Detect and correlate evidence | A dashboard does not guarantee source coverage |
| SOAR | Execute controlled response steps | Automation can increase damage if overprivileged |
| CVSS | Technical vulnerability severity | Not a substitute for context-specific risk assessment |
| RTO / RPO | Service recovery time / data-loss tolerance | Plans need successful tests |

## Unified concept glossary

Each concept below is defined once and linked to its reusable page. Source lessons and longer explanations are on the concept page.

### [[AAA (Authentication Authorization Accounting)]]

AAA is a useful access-security model: authenticate the requesting identity, authorize the requested action and record what occurred.

**Key nuance:** Authentication proves an asserted identity; MFA can increase assurance but not grant permission.

### [[AI Agent Security]]

AI agent security protects systems where a model can invoke external tools, read sensitive resources or perform consequential actions.

**Key nuance:** [[Least Privilege]]: scope tools, identities, tokens, commands, network egress and data access.

### [[AI Data Poisoning]]

AI data poisoning changes information used by an AI system to influence its behavior, predictions or retrieval results.

**Key nuance:** Training-time poisoning alters examples, labels or fine-tuning data.

### [[Asset Inventory]]

An asset inventory is an authoritative record of systems, software, data and services, with owners and lifecycle status.

**Key nuance:** Record identity, version, vendor, network exposure, purpose, classification, support and configuration baseline.

### [[Attack Surface]]

An attack surface is the set of externally or internally reachable opportunities an adversary could exploit.

**Key nuance:** Includes endpoints, APIs, identities, secrets, exposed services, third-party dependencies and management access.

### [[Business Continuity and Disaster Recovery]]

Business continuity maintains critical business functions through disruption; disaster recovery restores affected technology and data.

**Key nuance:** Plan redundancy, secondary locations, backup strategy, restoration and crisis communications.

### [[Change Management]]

Change management is a controlled process for planning, approving, testing, implementing and verifying system modifications.

**Key nuance:** Record business purpose, scope, dependencies, security impact, test results and decision authority.

### [[Cloud Shared Responsibility]]

Shared responsibility allocates cybersecurity duties between a cloud provider and its customer, depending on the service and deployment model.

**Key nuance:** IaaS customers manage more of operating system/runtime; PaaS shares application/platform duties; SaaS customers still own identity, data governance and tenant configuration.

### [[CVE CWE CVSS]]

CVE, CWE and CVSS describe different parts of the vulnerability-management process.

**Key nuance:** CVE is a unique public identifier for a disclosed vulnerability.

### [[Data Classification and DLP]]

Data classification assigns handling rules based on information sensitivity; data loss prevention (DLP) detects or restricts unauthorized data movement.

**Key nuance:** Apply consistent labels, authorized audiences, encryption, retention and disposition requirements.

### [[Data Exfiltration]]

Data exfiltration is unauthorized transfer of information out of an authorized security domain.

**Key nuance:** Pathways include emails, external APIs, cloud storage, tool calls, logs and model-generated output.

### [[Data Lifecycle]]

The data lifecycle spans collection, inventory, classification, use, sharing, retention and secure disposal, including secondary copies.

**Key nuance:** Track the data owner, lawful/authorized uses, location, copies and processors at each stage.

### [[Defense in Depth]]

Defense in depth uses distinct, independently enforced protective layers so one failure does not cause complete compromise.

**Key nuance:** Combine controls at identity, application, network, data, monitoring and recovery layers.

### [[Digital Signatures]]

A digital signature binds a private-key signing operation to a message or digest and can verify integrity and possession of the associated key.

**Key nuance:** The verifier checks with the public key, whose identity should be bound through trusted means.

### [[Hashing and Password Storage]]

Cryptographic hashing maps input into a fixed-length digest and is designed to be one-way; it does not encrypt or conceal the original data.

**Key nuance:** Integrity checks require a known trustworthy reference digest; anyone who can replace both file and digest may defeat naive checks.

### [[IAM]]

Identity and Access Management (IAM) controls the registration, authentication, authorization, review and retirement of identities.

**Key nuance:** Manage human, privileged, emergency, service and workload identities separately.

### [[Identity Threats]]

Identity threats exploit credentials, authenticators, sessions, tokens and permission assignments.

**Key nuance:** Password spraying and brute force try candidate credentials; phishing can steal login secrets or tokens.

### [[Incident Response]]

Incident response prepares for, detects, analyzes, contains and recovers from incidents while documenting decisions, notifying stakeholders and improving controls.

**Key nuance:** Events are observations; incidents involve threatened or realized security impacts.

### [[Least Privilege]]

Least privilege means granting only the rights and time needed for a justified task.

**Key nuance:** Use task-scoped permissions, time limits, separation of human and service identities and regular reviews.

### [[Network Segmentation]]

Network segmentation divides infrastructure into controlled zones and limits traffic paths between them.

**Key nuance:** Separate public front ends, admin planes, databases, sensitive networks and agent execution workloads.

### [[OAuth and OIDC]]

OAuth 2.0 is an authorization framework for delegated access; OpenID Connect (OIDC) adds an authentication/identity layer on top of OAuth.

**Key nuance:** Do not treat an OAuth access token alone as proof of an end user’s identity.

### [[PKI and TLS]]

Public key infrastructure (PKI) manages certificates and trust relationships; TLS protects traffic through authenticated negotiation and encryption.

**Key nuance:** Certificates connect identities/names to public keys through a trust chain; validate issuer, name, validity and policy.

### [[Prompt Injection]]

Prompt injection is an attempt to make lower-trust instructions in user content or retrieved material override a model application’s intended instructions or workflow.

**Key nuance:** Direct injection originates in the attacker’s own interaction; indirect injection arrives through external documents, pages, messages or tool responses.

### [[RBAC and ABAC]]

Role-based access control (RBAC) grants permissions through assigned roles; attribute-based access control (ABAC) evaluates attributes and context.

**Key nuance:** RBAC: “Case analyst” role permits case reading; ABAC: additionally verify classification, assignment, purpose or device context.

### [[Residual Risk]]

Residual risk is the risk that remains after current or planned controls are applied.

**Key nuance:** Possible treatments: avoid, reduce/mitigate, transfer/share financial effect or accept under delegated authority.

### [[Risk Assessment]]

Security risk assessment analyzes what could go wrong, how likely it is, its consequences and how effectively controls reduce it.

**Key nuance:** Describe asset, threat, vulnerability, attack scenario, likelihood, impact and current safeguards.

### [[RTO and RPO]]

Recovery Time Objective (RTO) limits acceptable downtime; Recovery Point Objective (RPO) limits acceptable data loss measured in time.

**Key nuance:** RTO = by when service must be restored; RPO = how far back a restored state may be.

### [[Security Assessment and Authorization]]

Security assessment and authorization reviews security requirements, implementation, test evidence and residual risk before an accountable authority approves operation or determines required action.

**Key nuance:** Define system boundaries, assets, stakeholders, sensitivity and expected security controls.

### [[Security Automation]]

Security automation executes predefined operational tasks and should be controlled like any privileged software.

**Key nuance:** Benefits: repeatable checks, faster enrichment, reduced manual workload and consistent response.

### [[Security Controls]]

A security control is a measure that reduces the probability or consequences of a threat.

**Key nuance:** Implementation categories: technical, managerial, operational, physical.

### [[Security Governance]]

Security governance sets policies, accountabilities, decision authorities and oversight for security risk.

**Key nuance:** Policy establishes mandatory intent, standard specifies mandatory criteria, procedure explains steps and guideline offers recommendations.

### [[Separation of Duties]]

Separation of duties divides sensitive steps among independent people or roles to reduce error, misuse and fraud.

**Key nuance:** Separate requesting, approving, implementing and independently reviewing high-risk changes.

### [[SIEM and SOAR]]

SIEM centralizes, correlates and analyzes security-event records; SOAR orchestrates and automates incident-response workflows.

**Key nuance:** SIEM: collect, normalize, correlate and alert; calibrate detection and ensure source-feed health.

### [[Third-Party Risk]]

Third-party risk arises when an organization depends on providers, suppliers or subprocessors whose failure or compromise can affect its security.

**Key nuance:** Perform due diligence before acquisition, include security requirements in contracts, monitor suppliers and plan secure exit.

### [[Threat Modeling]]

Threat modeling systematically identifies valuable assets, trust boundaries, likely adversaries, attack paths and candidate mitigations.

**Key nuance:** Start with architecture and data flows: who controls each input and what authority is available downstream?

### [[Vulnerability Management]]

Vulnerability management is the repeatable cycle of finding, validating, prioritizing, fixing and verifying exploitable weaknesses.

**Key nuance:** Identify affected assets with scans, code review, advisories, testing and accurate inventory.

### [[Zero Trust]]

Zero Trust is a security architecture that does not confer implicit trust merely because a request originates from an internal network.

**Key nuance:** Verify each request using identity, context, device/workload status and resource policy.

### [[CIA]]

Confidentiality, integrity and availability are the three foundational information-security objectives. This concept page **already exists** in your vault and is deliberately not replaced.

### [[Trust boundary]]

The point at which information or authority crosses a security domain; identify who controls input, what authority it might gain and where access is independently enforced. This existing concept page is preserved.

## AI security supervisor — practical review questions

- **Data:** What information, including prompts, logs, embeddings, derived data and backups, does the AI system touch? Which classifications apply?
- **Identity:** Are end-user and workload identities separate, and is document-level authorization enforced outside the model?
- **Supply chain:** Where do models, dependencies and training/retrieval materials originate? Can they be tampered with or silently updated?
- **Trust boundaries:** Can a retrieved document or model output command a privileged tool? Which independent guardrail prevents this?
- **Controls:** What preventive/detective/corrective controls are deployed? Who owns them, how are they tested, and what is the residual risk?
- **Operations:** Are audit events complete and protected? Can staff detect and contain prompt-injection-driven data exfiltration?
- **Recovery:** How will the department restore source documents, model access, vector indexes and authorization policies?
- **Approval:** What evidence supports the security assessment, and which authorized official can accept remaining risk?

## Coverage map — all 20 lessons

| Lesson | Study note                                                                                             | Main focus  | Priority                                         |           |
| -----: | ------------------------------------------------------------------------------------------------------ | ----------- | ------------------------------------------------ | --------- |
|     01 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 01 - Security Goals, AAA and Zero Trust               | Lesson 01]] | Security Goals, AAA and Zero Trust               | Essential |
|     02 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 02 - Security Controls and Change Management          | Lesson 02]] | Security Controls and Change Management          | Essential |
|     03 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 03 - Cryptography Essentials                          | Lesson 03]] | Cryptography Essentials                          | Essential |
|     04 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 04 - Encryption in Practice                           | Lesson 04]] | Encryption in Practice                           | Essential |
|     05 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 05 - Zero Trust Architecture                          | Lesson 05]] | Zero Trust Architecture                          | Essential |
|     06 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 06 - Threat Actors, Vectors and Intelligence          | Lesson 06]] | Threat Actors, Vectors and Intelligence          | Important |
|     07 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 07 - Malware, Human Attacks and Deepfakes             | Lesson 07]] | Malware, Human Attacks and Deepfakes             | Important |
|     08 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 08 - AI Threats and Indicators of Compromise          | Lesson 08]] | AI Threats and Indicators of Compromise          | Essential |
|     09 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 09 - Vulnerabilities, CVE, CWE and CVSS               | Lesson 09]] | Vulnerabilities, CVE, CWE and CVSS               | Essential |
|     10 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 10 - Hardening and Security Mitigations               | Lesson 10]] | Hardening and Security Mitigations               | Essential |
|     11 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 11 - Network Architecture and Secure Access           | Lesson 11]] | Network Architecture and Secure Access           | Important |
|     12 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 12 - Cloud Security and Shared Responsibility         | Lesson 12]] | Cloud Security and Shared Responsibility         | Essential |
|     13 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 13 - Data Protection and Information Lifecycle        | Lesson 13]] | Data Protection and Information Lifecycle        | Essential |
|     14 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 14 - Availability, Backups and Disaster Recovery      | Lesson 14]] | Availability, Backups and Disaster Recovery      | Important |
|     15 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 15 - Identity and Access Management                   | Lesson 15]] | Identity and Access Management                   | Essential |
|     16 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 16 - Monitoring, SIEM, SOAR and Security AI           | Lesson 16]] | Monitoring, SIEM, SOAR and Security AI           | Essential |
|     17 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 17 - Asset and Vulnerability Management               | Lesson 17]] | Asset and Vulnerability Management               | Essential |
|     18 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 18 - Incident Response and Forensics                  | Lesson 18]] | Incident Response and Forensics                  | Essential |
|     19 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 19 - Governance, Policies and Risk Treatment          | Lesson 19]] | Governance, Policies and Risk Treatment          | Essential |
|     20 | [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 20 - Third-Party Security, Compliance and Assessments | Lesson 20]] | Third-Party Security, Compliance and Assessments | Essential |

> [!warning] How to treat original-video claims
> Some transcript statements are simplifying mnemonics or automatic transcription errors. The generated notes flag material qualifications (notably: password hashing; hash vs signature; indirect prompt injection and RAG data poisoning; authentication vs authorization; logs vs non-repudiation; training frameworks vs operational incident response).
