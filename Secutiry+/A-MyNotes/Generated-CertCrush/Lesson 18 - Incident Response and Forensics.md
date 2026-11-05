---
type: video-study-note
course: Security+ SY0-801
provider: CertCrush
lesson: 18
source_video: https://www.youtube.com/watch?v=mAmQzpzlEJ0
priority: Essential
status: generated-review
aliases:
  - 'CertCrush Lesson 18'
tags:
  - security-plus
  - certcrush
  - study-notes
---
# Lesson 18 — Incident Response and Forensics

**[▶ Watch video](https://www.youtube.com/watch?v=mAmQzpzlEJ0)** · [[Secutiry+/CertCrush/021 - Security+ SY0-801 Incident Response Explained (Lesson 18)|Full transcript]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Security+ - Master Notes|Consolidated notes]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Index|All lessons]]

> [!summary] Learning target — Essential
> Understand the concepts and be able to explain **why the safeguards work, where they fail, and how to verify them**. These are synthesized study notes, **not** the video transcript.

## Event vs incident; stages · [↗ 01:29](https://www.youtube.com/watch?v=mAmQzpzlEJ0&t=89s)

- Event = observable activity; incident = event or combination that threatens/harms security objectives.
- [[Incident Response]]: prepare → detect/analyze → contain → eradicate → recover → lessons learned; reporting may occur throughout.
- Different training frameworks divide phases differently; do not assume one rigid order fits every real incident.

## Preparation and investigation · [↗ 04:47](https://www.youtube.com/watch?v=mAmQzpzlEJ0&t=287s)

- Define roles, legal/privacy contacts, communication channels, exercises, evidence handling and decision authority.
- Preserve timestamps, logs, system state and chain of custody when needed; distinguish evidence from inference.

## Containment, recovery and notification · [↗ 10:47](https://www.youtube.com/watch?v=mAmQzpzlEJ0&t=647s)

- Isolate affected systems or revoke tokens with consideration for impact and evidence preservation.
- Erase persistence, fix root cause, restore verified clean assets and monitor for recurrence.
- Determine notification requirements with counsel, privacy/security officials and the applicable organization-specific rules.

## Digital evidence and learning · [↗ 17:00](https://www.youtube.com/watch?v=mAmQzpzlEJ0&t=1020s)

- Network, endpoint, cloud, application and identity logs tell complementary parts of the timeline.
- A memory dump is volatile; disk images and retained logs support different investigations.
- Document impact, timeline, decisions, residual risk and corrective actions; conduct a constructive post-incident review.


## Apply it to AI security assurance

> [!example] Scenario
> Draft a response plan for AI-agent credential theft, prompt-injection-driven exfiltration and a poisoned retrieval index.

> [!warning] Accuracy note
> Treat any rigid multi-step “CompTIA order” as exam pedagogy; operational containment, investigation and reporting frequently overlap.

## Active recall — answer before reopening the notes

1. Which action should occur before wiping a compromised AI agent host?
2. What extra logs reveal whether a prompt injection triggered a privileged tool call?
3. Why might containment have to be coordinated with a service owner?

## Personal additions

- **What I misunderstood:**
- **One real example:**
- **One unresolved question:**
