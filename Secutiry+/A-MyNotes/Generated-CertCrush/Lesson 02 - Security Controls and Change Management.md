---
type: video-study-note
course: Security+ SY0-801
provider: CertCrush
lesson: 02
source_video: https://www.youtube.com/watch?v=iTlk_HxlCBg
priority: Essential
status: generated-review
aliases:
  - 'CertCrush Lesson 02'
tags:
  - security-plus
  - certcrush
  - study-notes
---

**[▶ Watch video](https://www.youtube.com/watch?v=iTlk_HxlCBg)** · [[Secutiry+/CertCrush/003 - Security+ SY0-801： 6 Control Types, 4 Categories (Lesson 2)|Full transcript]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Security+ - Master Notes|Consolidated notes]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Index|All lessons]]

> [!summary] Learning target — Essential
> Understand the concepts and be able to explain **why the safeguards work, where they fail, and how to verify them**. These are synthesized study notes, **not** the video transcript.

# ==🟡Security Controls== 
## ==🟡Categories==: how a control is implemented · [↗ 02:23](https://www.youtube.com/watch?v=iTlk_HxlCBg&t=143s)

- Technical/logical: encryption, identity enforcement, firewall, EDR.
- Managerial: policies, risk reviews, governance, vendor requirements.
- Operational: training, procedures, incident-response exercises, routine checks.
- Physical: locks, surveillance, secure premises.
![[Pasted image 20261105152918.png]]

## ==🟡Types==: what a control does · [↗ 04:40](https://www.youtube.com/watch?v=iTlk_HxlCBg&t=280s)

- Preventive **blocks**; detective **finds**; corrective **restores**.
- Deterrent **discourages**; directive **instructs**; compensating **substitutes** when the preferred control is impractical.
- Category and type are different dimensions: an access-control rule is typically technical + preventive.
- Control classification varies with context; examine the actual function rather than the product name.
![[Pasted image 20261105153417.png]]

## Organize defenses · [↗ 08:10](https://www.youtube.com/watch?v=iTlk_HxlCBg&t=490s)

- [[Defense in Depth]] = independent layers limiting failure of any one safeguard.
	- Kh: Staking multiple layer of defense.
- [[Least Privilege]] = minimum access needed; 
- [[Separation of Duties]] = split conflicting powers across people or systems.
- Defense in depth requires diverse, independently enforced controls—not several settings all bypassed by one credential.

# Change Management
## Change management protects existing security · [↗ 11:39](https://www.youtube.com/watch?v=iTlk_HxlCBg&t=699s)

- [[Change Management]]: request → impact/risk assessment → approval → test → deploy → verify → document.
- Prepare rollback/backout or controlled fail-forward plan; define owner, window, dependencies and downtime.
- Emergency changes need an appropriately accelerated process and retrospective review.
- Update diagrams, configuration baselines, audit trails and downstream consumers after changes.

![[Pasted image 20261105154445.png]]
![[Pasted image 20261105154707.png]]
![[Pasted image 20261105154840.png]]
![[Pasted image 20261105155236.png]]
- CAB: Change Advisory Board
- SOP: Standard Operating Procedure
## Apply it to AI security assurance

> [!example] Scenario
> Ask the team for a control matrix, evidence of negative tests, and an auditable approval and rollback plan for AI deployments.

## Active recall — answer before reopening the notes

1. Is a firewall a category or a type of control—or both?
2. Why does the same compromised administrator account defeat multiple seemingly independent controls?
3. What evidence should accompany approval of an emergency AI agent configuration change?

## Personal additions

- **What I misunderstood:**
- **One real example:**
- **One unresolved question:**
