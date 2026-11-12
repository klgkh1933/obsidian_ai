---
type: video-study-note
course: Security+ SY0-801
provider: CertCrush
lesson: 09
source_video: https://www.youtube.com/watch?v=npIynPoRltA
priority: Essential
status: generated-review
aliases:
  - 'CertCrush Lesson 09'
tags:
  - security-plus
  - certcrush
  - study-notes
---
# Lesson 09 — Vulnerabilities, CVE, CWE and CVSS

**[▶ Watch video](https://www.youtube.com/watch?v=npIynPoRltA)** · [[011 - Security+ SY0-801 CVE vs CWE vs CVSS Explained (Lesson 9)|Full transcript]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Security+ - Master Notes|Consolidated notes]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Index|All lessons]]

> [!summary] Learning target — Essential
> Understand the concepts and be able to explain **why the safeguards work, where they fail, and how to verify them**. These are synthesized study notes, **not** the video transcript.

## Weaknesses in software and systems · [↗ 01:21](https://www.youtube.com/watch?v=npIynPoRltA&t=81s)

- Injection, race conditions, unsafe error handling, outdated dependencies and hardcoded secrets enlarge the attack surface.
- Unpatched, unsupported, misconfigured or untracked systems accumulate exposure.
- Supply-chain attacks target packages, updates, providers, hardware or model repositories.

## Common attacks · [↗ 13:08](https://www.youtube.com/watch?v=npIynPoRltA&t=788s)

- SQL/command injection = untrusted input interpreted as commands; enforce parameterization, validation and sandboxing.
- Credential attacks include brute force, spraying, replay, session theft and MFA bypass.
- Network or cloud misconfiguration may expose resources without exploiting a software bug.

## Vulnerability taxonomy · [↗ 18:53](https://www.youtube.com/watch?v=npIynPoRltA&t=1133s)

- [[Vulnerability Management]]: **CVE** = identifier for a publicly documented vulnerability.
- **CWE** = general class of software/hardware weakness.
- **CVSS** = framework to characterize vulnerability severity—not a complete business-risk score.
- NVD provides enrichment; exploit activity and exposure require separate context.

## Prioritize by evidence · [↗ 20:50](https://www.youtube.com/watch?v=npIynPoRltA&t=1250s)

- Business risk depends on likelihood/exposure and impact; prioritize reachable weaknesses affecting sensitive assets.
- Track owner, affected versions, patch/mitigation path, compensating control and validation evidence.


## Apply it to AI security assurance

> [!example] Scenario
> Maintain an AI component inventory: model versions, dependencies, gateways, vector databases, agents and their permissions.

## Active recall — answer before reopening the notes

1. Why can an unpatched internal test service outrank a higher-CVSS isolated asset?
2. Which CWE might describe an LLM tool’s unvalidated shell command?
3. How should known exploitation change priority?

## Personal additions

- **What I misunderstood:**
- **One real example:**
- **One unresolved question:**
