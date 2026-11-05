---
type: video-study-note
course: Security+ SY0-801
provider: CertCrush
lesson: 12
source_video: https://www.youtube.com/watch?v=mZU9H1nJmJk
priority: Essential
status: generated-review
aliases:
  - 'CertCrush Lesson 12'
tags:
  - security-plus
  - certcrush
  - study-notes
---
# Lesson 12 — Cloud Security and Shared Responsibility

**[▶ Watch video](https://www.youtube.com/watch?v=mZU9H1nJmJk)** · [[Secutiry+/CertCrush/014 - Security+ SY0-801 Cloud Security and Zero Trust Explained (Lesson 12)|Full transcript]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Security+ - Master Notes|Consolidated notes]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Index|All lessons]]

> [!summary] Learning target — Essential
> Understand the concepts and be able to explain **why the safeguards work, where they fail, and how to verify them**. These are synthesized study notes, **not** the video transcript.

## Service models and responsibility · [↗ 01:16](https://www.youtube.com/watch?v=mZU9H1nJmJk&t=76s)

- [[Cloud Shared Responsibility]]: **IaaS** = customer manages more of OS/runtime; **PaaS** = provider manages more platform layers; **SaaS** = customer still manages identities, configuration and data use.
- Provider protection of infrastructure does not remove customer obligations for IAM, sensitive data and secure workloads.

## Deployment models and workloads · [↗ 03:21](https://www.youtube.com/watch?v=mZU9H1nJmJk&t=201s)

- Public, private, community and hybrid cloud models allocate infrastructure and tenancy differently.
- Serverless, microservices and IaC change the attack surface and ownership of configuration, images and secrets.
- Review cloud infrastructure as code like software: version, test, approve and monitor drift.

## Alternatives and resilience · [↗ 07:31](https://www.youtube.com/watch?v=mZU9H1nJmJk&t=451s)

- On-premises gives control but also maintenance burden; air gaps reduce network exposure, not insider/removable-media risks.
- Logical segmentation relies on correctly configured software controls; physical separation offers different isolation properties.
- Architecture choices balance resilience, cost, latency, maintainability and compliance.

## Data residency and cloud APIs · [↗ 12:32](https://www.youtube.com/watch?v=mZU9H1nJmJk&t=752s)

- Data residency = where data is stored/processed; data sovereignty/jurisdiction introduces legal requirements beyond geography alone.
- Protect cloud APIs and service identities with Zero Trust, least privilege, logging and secret rotation.
- Misconfigured storage or roles can expose data without any cryptographic break.


## Apply it to AI security assurance

> [!example] Scenario
> Review hosting location, shared responsibility, data-processing routes, provider agreements and tenant separation for an AI deployment.

## Active recall — answer before reopening the notes

1. Who is responsible for configuring access to documents in SaaS?
2. Why does a cloud region selection not by itself settle every legal or residency requirement?
3. What evidence would show a model endpoint has no public administrative access?

## Personal additions

- **What I misunderstood:**
- **One real example:**
- **One unresolved question:**
