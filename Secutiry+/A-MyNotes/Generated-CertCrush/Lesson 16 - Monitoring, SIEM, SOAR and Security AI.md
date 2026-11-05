---
type: video-study-note
course: Security+ SY0-801
provider: CertCrush
lesson: 16
source_video: https://www.youtube.com/watch?v=p8H-Fg_NOaQ
priority: Essential
status: generated-review
aliases:
  - 'CertCrush Lesson 16'
tags:
  - security-plus
  - certcrush
  - study-notes
---
# Lesson 16 — Monitoring, SIEM, SOAR and Security AI

**[▶ Watch video](https://www.youtube.com/watch?v=p8H-Fg_NOaQ)** · [[Secutiry+/CertCrush/018 - Security+ SY0-801 SIEM vs SOAR： What Each One Does (Lesson 16)|Full transcript]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Security+ - Master Notes|Consolidated notes]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Index|All lessons]]

> [!summary] Learning target — Essential
> Understand the concepts and be able to explain **why the safeguards work, where they fail, and how to verify them**. These are synthesized study notes, **not** the video transcript.

## Logs and telemetry · [↗ 02:06](https://www.youtube.com/watch?v=p8H-Fg_NOaQ&t=126s)

- [[SIEM and SOAR]]: security-relevant logs should record who/what, action, resource, result, timestamp and trusted source context.
- Syslog, SNMPv3, NetFlow/IPFIX, agents and packet capture reveal different kinds of events and network characteristics.
- Protect log integrity, account for missing feeds, and retain only necessary sensitive information.

## SIEM: centralized analysis · [↗ 08:05](https://www.youtube.com/watch?v=p8H-Fg_NOaQ&t=485s)

- SIEM aggregates/normalizes data, correlates events, applies detection rules and surfaces alerts/dashboards.
- Tune rules for true positives, false positives and false negatives; define baseline and escalation owner.
- No alerts may mean failure of data ingestion, not absence of attacks.

## SOAR: coordinated response · [↗ 12:36](https://www.youtube.com/watch?v=p8H-Fg_NOaQ&t=756s)

- SOAR connects systems and runs tested playbooks (enrich, triage, disable token, isolate endpoint, open case).
- Use approvals and rollback for high-impact automation; control playbook identities and audit each action.

## AI assistance and agent risks · [↗ 17:48](https://www.youtube.com/watch?v=p8H-Fg_NOaQ&t=1068s)

- AI can summarize alerts, find correlations and support triage but may invent evidence or propagate poisoned inputs.
- [[AI Agent Security]]: agents should receive scoped tools, reliable audit logs and human approval for destructive actions.
- Validate model-assisted decisions against raw evidence before incident response or access revocation.


## Apply it to AI security assurance

> [!example] Scenario
> Define AI application telemetry: retrieval decisions, denied document accesses, tool invocation, data egress and model/version changes.

## Active recall — answer before reopening the notes

1. What distinguishes SIEM from SOAR?
2. How can a broken log source create a false sense of security?
3. Which actions should an AI incident-response agent require human approval for?

## Personal additions

- **What I misunderstood:**
- **One real example:**
- **One unresolved question:**
