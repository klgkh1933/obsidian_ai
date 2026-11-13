---
type: video-study-note
course: Security+ SY0-801
provider: CertCrush
lesson: 13
source_video: https://www.youtube.com/watch?v=7hF2DSks_OU
priority: Essential
status: generated-review
aliases:
  - 'CertCrush Lesson 13'
tags:
  - security-plus
  - certcrush
  - study-notes
---
# Lesson 13 — Data Protection and Information Lifecycle

**[▶ Watch video](https://www.youtube.com/watch?v=7hF2DSks_OU)** · [[015 - Security+ SY0-801 Encryption vs Tokenization vs Masking (Lesson 13)|Full transcript]] · [[Security+ - Master Notes|Consolidated notes]] · [[Index|All lessons]]

> [!summary] Learning target — Essential
> Understand the concepts and be able to explain **why the safeguards work, where they fail, and how to verify them**. These are synthesized study notes, **not** the video transcript.

## Kinds and states of data · [↗ 01:48](https://www.youtube.com/watch?v=7hF2DSks_OU&t=108s)

- Structured data fits defined fields; unstructured data includes documents, email, scans and many AI prompts.
- Data at rest = stored; in transit = moving; in use = being processed (may be plaintext in memory).
- AI systems can copy data into prompts, logs, caches, retrieval indices, embeddings and outputs.

## Classification and accountability · [↗ 04:44](https://www.youtube.com/watch?v=7hF2DSks_OU&t=284s)

- [[Data Classification and DLP]]: classify information by sensitivity and handling obligations; enforce labels and access rules.
- Owner is accountable for allowed use; custodian/operator implements technical handling; processor/subprocessor roles depend on legal context.
- For federal GC use, adapt classifications to the approved departmental scheme, not a US training example.

## Protection techniques · [↗ 09:24](https://www.youtube.com/watch?v=7hF2DSks_OU&t=564s)

- Encryption hides data with a key; hashing produces a digest; tokenization replaces a sensitive value with a controlled reference.
- Masking obscures selected values; de-identification reduces identifiability but may not eliminate re-identification risk.
- DLP detects/prevents some unauthorized movement via endpoints, email, cloud and gateways; configure by data type and policy.

## Lifecycle and legal holds · [↗ 15:38](https://www.youtube.com/watch?v=7hF2DSks_OU&t=938s)

- Inventory → create/collect → classify → use/share → retain/archive → securely dispose according to policy.
- Retention schedules and legal holds may forbid normal deletion; check location and vendor processor obligations.
- Verify secure disposal and that secondary copies/indices are appropriately handled.


## Apply it to AI security assurance

> [!example] Scenario
> Map every personal or protected document from ingestion through chunking, embeddings, retrieval, logging and retirement.

## Active recall — answer before reopening the notes

1. How do masking and tokenization differ?
2. Which copies of a source document can be created during a RAG ingestion pipeline?
3. Why may a legal hold override a scheduled delete?

## Personal additions

- **What I misunderstood:**
- **One real example:**
- **One unresolved question:**
