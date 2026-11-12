---
type: video-study-note
course: Security+ SY0-801
provider: CertCrush
lesson: 14
source_video: https://www.youtube.com/watch?v=8Sflt57yaWU
priority: Important
status: generated-review
aliases:
  - 'CertCrush Lesson 14'
tags:
  - security-plus
  - certcrush
  - study-notes
---
# Lesson 14 — Availability, Backups and Disaster Recovery

**[▶ Watch video](https://www.youtube.com/watch?v=8Sflt57yaWU)** · [[016 - Security+ SY0-801 RTO vs RPO, MTTR vs MTBF Explained (Lesson 14)|Full transcript]] · [[Security+ - Master Notes|Consolidated notes]] · [[Index|All lessons]]

> [!summary] Learning target — Important
> Understand the concepts and be able to explain **why the safeguards work, where they fail, and how to verify them**. These are synthesized study notes, **not** the video transcript.

## Resilience and redundancy · [↗ 01:57](https://www.youtube.com/watch?v=8Sflt57yaWU&t=117s)

- High availability uses redundancy, load balancing, failover and removal of single points of failure.
- UPS and generators bridge different durations of power failure; RAID increases resilience to drive failure but **is not a backup**.

## Backups and proof · [↗ 08:03](https://www.youtube.com/watch?v=8Sflt57yaWU&t=483s)

- Full backup copies all selected data; incremental copies change since last backup; differential copies change since last full backup.
- 3-2-1 is a useful baseline for multiple copies, media and locations; use immutable/offline copies when warranted.
- Test restoration regularly and verify integrity, dependencies and recovery time.

## Four recovery metrics · [↗ 13:25](https://www.youtube.com/watch?v=8Sflt57yaWU&t=805s)

- [[RTO and RPO]]: **RTO** = maximum tolerable time to restore service; **RPO** = maximum tolerable period of data loss.
- **MTTR** = average time to repair/restore; **MTBF** = mean time between failures for repairable systems.
- RTO and RPO are objectives; actual tests must demonstrate what the design can meet.

## Continuity and testing · [↗ 15:42](https://www.youtube.com/watch?v=8Sflt57yaWU&t=942s)

- Business continuity plans preserve critical functions; disaster recovery focuses on restoring IT capabilities.
- Hot/warm/cold recovery sites trade readiness against cost.
- Tabletop, simulation, parallel and failover testing provide different levels of evidence.


## Apply it to AI security assurance

> [!example] Scenario
> For an AI service, include model provider outages, quota limits, denial-of-wallet, embeddings and index restoration.

## Active recall — answer before reopening the notes

1. If a service has RTO 4 h and RPO 1 h, what do those objectives mean?
2. Why is an immutable backup still insufficient without restoration tests?
3. How could model APIs affect the availability of a government service?

## Personal additions

- **What I misunderstood:**
- **One real example:**
- **One unresolved question:**
