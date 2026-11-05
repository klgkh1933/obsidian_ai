---
type: concept
course: Security+ SY0-801
status: synthesized
aliases: []
tags:
  - cybersecurity/concept
  - security-plus
---
# AAA (Authentication Authorization Accounting)

**Definition:** AAA is a useful access-security model: authenticate the requesting identity, authorize the requested action and record what occurred.

## Key points

- Authentication proves an asserted identity; MFA can increase assurance but not grant permission.
- Authorization is a decision about a specific action on a specific resource. Enforce it in the application/API or trusted policy enforcement point.
- Accounting means protected, reviewable events tied to identities and resources; logging alone does not guarantee non-repudiation.

## AI security example

> [!example] Application
> A document-retrieval agent authenticates with a workload identity but must enforce each end user’s permissions on individual documents.

## Check your understanding

Why is successful authentication insufficient to authorize retrieval of a classified record?

## Related concepts

[[IAM]] · [[RBAC and ABAC]] · [[Digital Signatures]]

## Sources

[[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 01 - Security Goals, AAA and Zero Trust|Lesson 01]] · [↗ Video](https://www.youtube.com/watch?v=RZnprQW-3Ac) · [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 15 - Identity and Access Management|Lesson 15]] · [↗ Video](https://www.youtube.com/watch?v=CfVDAQ9FGFE)

## Back to the learning map

[[Secutiry+/A-MyNotes/Generated-CertCrush/Security+ - Master Notes|Security+ master note]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Index|Lesson index]]
