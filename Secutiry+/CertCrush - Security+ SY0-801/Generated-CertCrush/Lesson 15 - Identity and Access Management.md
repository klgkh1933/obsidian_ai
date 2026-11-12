---
type: video-study-note
course: Security+ SY0-801
provider: CertCrush
lesson: 15
source_video: https://www.youtube.com/watch?v=CfVDAQ9FGFE
priority: Essential
status: generated-review
aliases:
  - 'CertCrush Lesson 15'
tags:
  - security-plus
  - certcrush
  - study-notes
---
# Lesson 15 — Identity and Access Management

**[▶ Watch video](https://www.youtube.com/watch?v=CfVDAQ9FGFE)** · [[017 - Security+ SY0-801 Identity and Access Management Explained (Lesson 15)|Full transcript]] · [[Security+ - Master Notes|Consolidated notes]] · [[Index|All lessons]]

> [!summary] Learning target — Essential
> Understand the concepts and be able to explain **why the safeguards work, where they fail, and how to verify them**. These are synthesized study notes, **not** the video transcript.

## Identity lifecycle · [↗ 01:14](https://www.youtube.com/watch?v=CfVDAQ9FGFE&t=74s)

- [[IAM]]: identification claims an identity; authentication proves it; authorization enforces permissions.
- Proof/register → provision → review/update → suspend/revoke → deprovision; remove stale entitlements promptly.
- Separate ordinary user, privileged administrator, service/workload and emergency access identities.

## MFA and passwordless · [↗ 09:26](https://www.youtube.com/watch?v=CfVDAQ9FGFE&t=566s)

- MFA uses independent factor categories (knowledge, possession, inherence); two passwords are still one factor category.
- Passkeys/FIDO2 use public-key authentication and can offer phishing resistance.
- Prefer strong authentication and secure recovery procedures; rotate credentials based on risk/policy, not thoughtless calendar resets.

## Access control models · [↗ 16:41](https://www.youtube.com/watch?v=CfVDAQ9FGFE&t=1001s)

- [[RBAC and ABAC]]: RBAC grants via job roles; ABAC evaluates user/resource/context attributes.
- Rule-based restrictions consider system conditions; discretionary and mandatory access models enforce different ownership/policy regimes.
- Review inheritance, toxic combinations, privilege creep and separation of duties.

## Federation protocols · [↗ 20:20](https://www.youtube.com/watch?v=CfVDAQ9FGFE&t=1220s)

- SSO offers a single login flow across applications; federation transfers identity assertions across trust boundaries.
- [[OAuth and OIDC]]: OAuth 2.0 delegates **authorization**; OIDC adds identity/authentication assertions.
- SAML commonly supports enterprise SSO; LDAP queries directory data; Kerberos uses tickets.
- Scopes, token lifetime, audience, revocation and sender constraints influence token misuse risk.


## Apply it to AI security assurance

> [!example] Scenario
> Design separate human, AI workload and downstream tool permissions, with user-context authorization at the final data boundary.

## Active recall — answer before reopening the notes

1. Can an AI service authenticate successfully yet be forbidden to read a specific file?
2. Why is OAuth not, by itself, an authentication protocol?
3. What is an appropriate identity for an unattended AI retrieval worker?

## Personal additions

- **What I misunderstood:**
- **One real example:**
- **One unresolved question:**
