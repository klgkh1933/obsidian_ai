---
type: concept
course: Security+ SY0-801
status: synthesized
aliases: []
tags:
  - cybersecurity/concept
  - security-plus
---
# Threat Modeling

**Definition:** Threat modeling systematically identifies valuable assets, trust boundaries, likely adversaries, attack paths and candidate mitigations.

## Key points

- Start with architecture and data flows: who controls each input and what authority is available downstream?
- Separate threat actor, vulnerability, attack vector, consequence and current controls.
- Use plausible abuse cases to test controls; revisit after architecture and vendor changes.

## AI security example

> [!example] Application
> Map a RAG pipeline: document upload → indexing → retrieval → model → privileged tool; mark where untrusted content meets authority.

## Check your understanding

At which step can an external document become an executable instruction?

## Related concepts

[[Attack Surface]] · [[Prompt Injection]] · [[AI Agent Security]] · [[Risk Assessment]]

## Sources

[[Lesson 06 - Threat Actors, Vectors and Intelligence|Lesson 06]] · [↗ Video](https://www.youtube.com/watch?v=YHj9rKND0VY) · [[Lesson 08 - AI Threats and Indicators of Compromise|Lesson 08]] · [↗ Video](https://www.youtube.com/watch?v=a2G9W8QmFCs) · [[Lesson 09 - Vulnerabilities, CVE, CWE and CVSS|Lesson 09]] · [↗ Video](https://www.youtube.com/watch?v=npIynPoRltA)

## Back to the learning map

[[Security+ - Master Notes|Security+ master note]] · [[Index|Lesson index]]
