---
type: concept
course: Security+ SY0-801
status: synthesized
aliases: []
tags:
  - cybersecurity/concept
  - security-plus
---
# Network Segmentation

**Definition:** Network segmentation divides infrastructure into controlled zones and limits traffic paths between them.

## Key points

- Separate public front ends, admin planes, databases, sensitive networks and agent execution workloads.
- Enforce explicit allow rules and verify denied paths; microsegmentation restricts east–west movement.
- Segmentation controls network reachability, while application authorization controls actions and data inside reachable services.

## AI security example

> [!example] Application
> An AI chat interface reaches a retrieval API, but cannot directly connect to the database or privileged management interface.

## Check your understanding

How can an attacker pivot after compromising a public-facing API if the internal network is flat?

## Related concepts

[[Zero Trust]] · [[Defense in Depth]] · [[Cloud Shared Responsibility]]

## Sources

[[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 05 - Zero Trust Architecture|Lesson 05]] · [↗ Video](https://www.youtube.com/watch?v=XGLBWhiy0s4) · [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 10 - Hardening and Security Mitigations|Lesson 10]] · [↗ Video](https://www.youtube.com/watch?v=pIuq5o8htcw) · [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 11 - Network Architecture and Secure Access|Lesson 11]] · [↗ Video](https://www.youtube.com/watch?v=X_nHCg144zE)

## Back to the learning map

[[Secutiry+/A-MyNotes/Generated-CertCrush/Security+ - Master Notes|Security+ master note]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Index|Lesson index]]
