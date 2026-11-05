---
type: video-study-note
course: Security+ SY0-801
provider: CertCrush
lesson: 01
source_video: https://www.youtube.com/watch?v=RZnprQW-3Ac
priority: Essential
status: generated-review
aliases:
  - 'CertCrush Lesson 01'
tags:
  - security-plus
  - certcrush
  - study-notes
---
# Lesson 01 — Security Goals, AAA and Zero Trust

**[▶ Watch video](https://www.youtube.com/watch?v=RZnprQW-3Ac)** · [[Secutiry+/CertCrush/001 - Security+ SY0-801 Lesson 1： CIA Triad, AAA and Zero Trust|Full transcript]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Security+ - Master Notes|Consolidated notes]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Index|All lessons]]

> [!summary] Learning target — Essential
> Understand the concepts and be able to explain **why the safeguards work, where they fail, and how to verify them**. These are synthesized study notes, **not** the video transcript.

## CIA: what security protects · [↗ 01:17](https://www.youtube.com/watch?v=RZnprQW-3Ac&t=77s)

- [[CIA]]: **Confidentiality** = disclose information only to authorized parties. Controls: encryption and access control.
- **Integrity** = preserve correct, authorized information and detect improper changes. Compare a hash to a **trusted** reference; also use signatures, authorization and validation.
- **Availability** = keep systems and data usable when needed. Controls: redundancy, backups, recovery, capacity and patching.

## DAD and three supporting properties · [↗ 06:23](https://www.youtube.com/watch?v=RZnprQW-3Ac&t=383s)

- **DAD** reverses CIA: **Disclosure** ↔ confidentiality; **Alteration** ↔ integrity; **Destruction** ↔ availability.
- **Authenticity** asks if an identity, message or origin is genuine.
- **Non-repudiation** asks whether convincing evidence prevents an actor from credibly denying an action. Strong signatures may help, but require key custody and attribution.
- **Accountability** links actions to identifiable actors through authentication, protected audit trails and reviews.

## AAA: mechanics behind access · [↗ 09:52](https://www.youtube.com/watch?v=RZnprQW-3Ac&t=592s)

- [[AAA (Authentication Authorization Accounting)|Authentication]] — **Who are you?** Password, passkey, MFA, certificate.
- **Authorization** — **What may you do?** Role, attribute and resource permissions; enforce server-side.
- **Accounting** — **What did you do?** Timestamped records, traceability and auditability.
- AAA supports CIA; neither authentication nor a log entry alone guarantees confidentiality or non-repudiation.

## Zero Trust: never assume location is trustworthy · [↗ 13:07](https://www.youtube.com/watch?v=RZnprQW-3Ac&t=787s)

- [[Zero Trust]] — explicitly verify identity, device/context and authorization for the requested resource.
- [[Least Privilege]] — grant only required access; reduce the blast radius; assume a credential or endpoint could be compromised.
- Re-evaluate access when context changes; Zero Trust is an architecture, **not** constant re-login.

## Apply controls to CIA · [↗ 15:18](https://www.youtube.com/watch?v=RZnprQW-3Ac&t=918s)

- Encryption principally supports confidentiality; authorization can support confidentiality and integrity.
- Hashing plus a trusted reference supports integrity; backups and failover support availability.
- A single attack can harm multiple CIA properties at once.


## Apply it to AI security assurance

> [!example] Scenario
> Assess an AI assistant: who may read a document, how are tool actions attributed, and how is service availability maintained?

> [!warning] Accuracy note
> Security goals are broader than any individual control. Logging supports—but by itself does not establish—non-repudiation.

## Active recall — answer before reopening the notes

1. Can a database be encrypted at rest and still leak data? Explain.
2. Why can a valid user identity still be unauthorized to read a document?
3. What does a digital signature prove, and what additional conditions affect non-repudiation?

## Personal additions

- **What I misunderstood:**
- **One real example:**
- **One unresolved question:**
