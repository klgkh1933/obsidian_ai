---
type: concept
course: Security+ SY0-801
status: synthesized
aliases: []
tags:
  - cybersecurity/concept
  - security-plus
---
# RTO and RPO

**Definition:** Recovery Time Objective (RTO) limits acceptable downtime; Recovery Point Objective (RPO) limits acceptable data loss measured in time.

## Key points

- RTO = by when service must be restored; RPO = how far back a restored state may be.
- MTTR = average repair/recovery time; MTBF = mean time between failures in repairable systems.
- Recovery design should be validated by tested restores or failover; RAID and snapshots are not substitutes for separate backups.

## AI security example

> [!example] Application
> An AI document-search service has RTO 4 hours and RPO 1 hour; test model service, index, access rules and source data together.

## Check your understanding

Why can a restored document index still violate the RPO or produce unauthorized results?

## Related concepts

[[Business Continuity and Disaster Recovery]] · [[Incident Response]]

## Sources

[[Lesson 14 - Availability, Backups and Disaster Recovery|Lesson 14]] · [↗ Video](https://www.youtube.com/watch?v=8Sflt57yaWU)

## Back to the learning map

[[Security+ - Master Notes|Security+ master note]] · [[Index|Lesson index]]
