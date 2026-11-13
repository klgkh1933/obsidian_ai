---
type: video-study-note
course: Security+ SY0-801
provider: CertCrush
lesson: 08
source_video: https://www.youtube.com/watch?v=a2G9W8QmFCs
priority: Essential
status: generated-review
aliases:
  - 'CertCrush Lesson 08'
tags:
  - security-plus
  - certcrush
  - study-notes
---
# Lesson 08 — AI Threats and Indicators of Compromise

**[▶ Watch video](https://www.youtube.com/watch?v=a2G9W8QmFCs)** · [[019 - Security+ SY0-801 AI Threats and 12 Indicators of Compromise (Lesson 8)|Full transcript]] · [[Security+ - Master Notes|Consolidated notes]] · [[Index|All lessons]]

> [!summary] Learning target — Essential
> Understand the concepts and be able to explain **why the safeguards work, where they fail, and how to verify them**. These are synthesized study notes, **not** the video transcript.

## Basic AI system boundaries · [↗ 01:32](https://www.youtube.com/watch?v=a2G9W8QmFCs&t=92s)

- Training shapes learned parameters; inference uses the trained model; agents add external tools and privileges.
- Model outputs are **not** permission grants. Keep authorization in deterministic application/tool boundaries.

## Prompt injection and jailbreaking · [↗ 03:05](https://www.youtube.com/watch?v=a2G9W8QmFCs&t=185s)

- [[Prompt Injection]]: malicious instructions cross from lower-trust text (email, webpage, retrieved document) into model behavior.
- Direct injection originates in a user prompt; indirect injection originates in untrusted material retrieved for another task.
- Jailbreaking attempts to bypass model safety constraints; it overlaps with prompt injection but is not always the same mechanism.

## Evasion, poisoning, model manipulation · [↗ 04:30](https://www.youtube.com/watch?v=a2G9W8QmFCs&t=270s)

- Evasion modifies runtime input to fool a deployed detector/classifier.
- [[AI Data Poisoning]] alters training, tuning **or retrieval** material to skew results; RAG poisoning need not retrain the model.
- Model manipulation affects artifacts/weights/configuration or behavior; protect provenance and integrity of model supply chains.

## Data leakage and unsafe agency · [↗ 06:42](https://www.youtube.com/watch?v=a2G9W8QmFCs&t=402s)

- Sensitive data may leave via prompts, logs, retrieved content, outputs or tool use.
- [[AI Agent Security]]: excessive agency = too many tools, actions or privileges; restrict scopes, require approvals and monitor actions.
- Unchecked model-generated code or commands can enable dangerous execution.

## Hallucination, bias and explainability · [↗ 09:05](https://www.youtube.com/watch?v=a2G9W8QmFCs&t=545s)

- Hallucination = unsupported or false answer presented plausibly; validate before high-impact actions.
- Bias and poor explainability can undermine trustworthy decisions; assess separately from malicious compromise.

## Indicators of compromise (IoCs) · [↗ 15:35](https://www.youtube.com/watch?v=a2G9W8QmFCs&t=935s)

- Unusual processes, unexpected network connections, impossible travel, concurrent sessions, lockouts and suspicious account changes are **signals**, not proof.
- Correlate events and inspect source quality, alternative explanations and scope.


## Apply it to AI security assurance

> [!example] Scenario
> Threat-model a government document assistant with untrusted retrieved content, access-controlled records and potentially privileged tools.

> [!warning] Accuracy note
> The video’s claim that poisoning occurs only during training is too narrow: retrieved data can be poisoned without retraining.

## Active recall — answer before reopening the notes

1. What boundary does indirect prompt injection cross?
2. How is retrieval-time data poisoning different from model-training poisoning?
3. Why is an agent with read-only tools less dangerous than one that can send mail or execute commands?

## Personal additions

- **What I misunderstood:**
- **One real example:**
- **One unresolved question:**
