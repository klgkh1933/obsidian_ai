---
type: video-study-note
course: Security+ SY0-801
provider: CertCrush
lesson: 05
source_video: https://www.youtube.com/watch?v=XGLBWhiy0s4
priority: Essential
status: generated-review
aliases:
  - 'CertCrush Lesson 05'
tags:
  - security-plus
  - certcrush
  - study-notes
---
# Lesson 05 — Zero Trust Architecture

**[▶ Watch video](https://www.youtube.com/watch?v=XGLBWhiy0s4)** · [[Secutiry+/CertCrush/006 - Security+ SY0-801 Zero Trust Explained (Lesson 5)|Full transcript]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Security+ - Master Notes|Consolidated notes]] · [[Secutiry+/A-MyNotes/Generated-CertCrush/Index|All lessons]]

> [!summary] Learning target — Essential
> Understand the concepts and be able to explain **why the safeguards work, where they fail, and how to verify them**. These are synthesized study notes, **not** the video transcript.

## Principles and common misconceptions · [↗ 03:08](https://www.youtube.com/watch?v=XGLBWhiy0s4&t=188s)

- [[Zero Trust]] (always verify) rejects implicit trust based on internal network placement; verify explicit access to **each protected resource**.
	- ![[Pasted image 20261112132056.png]]
- Use least privilege, assume compromise, evaluate user/workload identity and device posture.
- Verification is risk-based and continuous in principle—not necessarily interactive MFA on every API call.

## How access decisions work · [↗ 05:22](https://www.youtube.com/watch?v=XGLBWhiy0s4&t=322s)

- Control plane: policy engine decides and policy administrator coordinates/access configuration.
- Data plane: policy enforcement point allows, limits or denies requested traffic/actions.
- Inputs include identity, device state, contextual risk, resource sensitivity and policy.

## Building blocks · [↗ 09:57](https://www.youtube.com/watch?v=XGLBWhiy0s4&t=597s)

- Strong human and workload identities with lifecycle management.
- Known, assessed devices/workloads and their health state.
- Resource-specific access control: applications, APIs, data and tools; do not overgrant network access.

## Contain blast radius · [↗ 14:12](https://www.youtube.com/watch?v=XGLBWhiy0s4&t=852s)

- [[Network Segmentation]] and microsegmentation restrict lateral movement after a credential or endpoint compromise.
- VPN encryption by itself does not imply fine-grained authorization.
- Implement incrementally: inventory → define resource policies → enforce → monitor → test denied access.


## Apply it to AI security assurance

> [!example] Scenario
> For a RAG assistant, enforce document-level permissions at retrieval and tool endpoints—not in the LLM prompt.

## Active recall — answer before reopening the notes

1. Why does “connected through VPN” not imply “authorized to reach every service”?
2. What is the difference between the policy engine and policy enforcement point?
3. How could a compromised AI tool be contained?

## Personal additions

- **What I misunderstood:**
- **One real example:**
- **One unresolved question:**
