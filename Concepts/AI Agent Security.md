---
type: concept
course: Security+ SY0-801
status: synthesized
aliases: []
tags:
  - cybersecurity/concept
  - security-plus
---
# AI Agent Security

**Definition:** AI agent security protects systems where a model can invoke external tools, read sensitive resources or perform consequential actions.

## Key points

- [[Least Privilege]]: scope tools, identities, tokens, commands, network egress and data access.
- Enforce authorization outside model-generated text; validate arguments and tool outputs.
- Require approvals for high-impact actions and retain tamper-resistant tool-call/audit traces.
- Test indirect prompt injection, confused-deputy paths and failure when a tool or policy service is unavailable.

## AI security example

> [!example] Application
> A research agent can read an approved index but cannot use the same identity to write permission changes to production storage.

## Check your understanding

What happens if the agent follows malicious instructions hidden in a retrieved file?

## Related concepts

[[Prompt Injection]] · [[Zero Trust]] · [[IAM]] · [[SIEM and SOAR]]

## Sources

[[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 08 - AI Threats and Indicators of Compromise|Lesson 08]] · [↗ Video](https://www.youtube.com/watch?v=a2G9W8QmFCs) · [[Secutiry+/A-MyNotes/Generated-CertCrush/Lesson 16 - Monitoring, SIEM, SOAR and Security AI|Lesson 16]] · [↗ Video](https://www.youtube.com/watch?v=p8H-Fg_NOaQ)

## Back to the learning map

[[Secutiry+/A-MyNotes/Generated-CertCrush/Security+ - Master Notes|Security+ master note]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Index|Lesson index]]
