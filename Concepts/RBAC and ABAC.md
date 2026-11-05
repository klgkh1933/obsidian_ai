---
type: concept
course: Security+ SY0-801
status: synthesized
aliases: []
tags:
  - cybersecurity/concept
  - security-plus
---
# RBAC and ABAC

**Definition:** Role-based access control (RBAC) grants permissions through assigned roles; attribute-based access control (ABAC) evaluates attributes and context.

## Key points

- RBAC: “Case analyst” role permits case reading; ABAC: additionally verify classification, assignment, purpose or device context.
- Discretionary, mandatory and rule-based control use different policy authorities and decision bases.
- Always test inherited permissions and conflicting access grants.

## AI security example

> [!example] Application
> A retrieval API checks that a document matches the requestor’s role and active case assignment before sending it to the model.

## Check your understanding

Why might RBAC alone be too coarse for a large confidential corpus?

## Related concepts

[[IAM]] · [[Zero Trust]] · [[Least Privilege]]

## Sources

[[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 15 - Identity and Access Management|Lesson 15]] · [↗ Video](https://www.youtube.com/watch?v=CfVDAQ9FGFE)

## Back to the learning map

[[Secutiry+/A-MyNotes/Generated-CertCrush/Security+ - Master Notes|Security+ master note]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Index|Lesson index]]
