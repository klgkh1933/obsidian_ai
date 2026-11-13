# Security+ SY0-801 Policy vs Standard vs Procedure (Lesson 19)

[Watch on YouTube](https://www.youtube.com/watch?v=QNT9oLfo-3I)

## 00:00 — Why security needs governance ([↗](https://www.youtube.com/watch?v=QNT9oLfo-3I&t=0s))

Every technical control in security, every firewall, every backup, every access rule, exists because someone decided it was worth the cost. That deciding, documenting, and overseeing is governance. It's the boardroom side of security, and CompTIA's published SY0-801 objectives give it an entire domain. So, you'll want to understand it as well as you understand a firewall rule. That's what this lesson is all about. In this lesson, you'll learn three things. First, the paperwork of a security program, meaning policies, standards, procedures, guidelines, and plans. Second, the frameworks that give a program its blueprint. And third, risk management, including the four ways to treat a risk and the SLEEAR, ARO, and ALE math. The next lesson picks up the rest, meaning third-party risk, compliance and privacy, audits, penetration testing, and security awareness training.

Governance is the system of directing and overseeing security. Who decides, who's accountable, and how decisions get enforced? Risk management is how those decisions get prioritized. If the security mindset taught you how to think, this lesson shows you how a company writes that thinking down and enforces it across thousands of people. Domain five is the smallest slice of the exam at 14%, but the questions lean on vocabulary, so clean definitions pay off. Let's start with the governance hierarchy. Organizations control

## 01:37 — Policies, standards and procedures ([↗](https://www.youtube.com/watch?v=QNT9oLfo-3I&t=97s))

behavior with a stack of documents, and the exam loves to test the difference. The cleanest way to keep them straight is a road rules hierarchy. A policy is the law. It's a high-level statement of intent, the what and the why, approved by senior management. Policies are broad, and they change rarely. A standard is the specific rule, the speed limit. It's a mandatory, measurable requirement that supports a policy, like all laptops must use AES-256 full disk encryption. A procedure is the turn-by-turn directions, the exact steps to accomplish something, and a guideline is friendly advice, recommended but not mandatory. Policy is broad and mandatory. Standard is specific and mandatory. Procedure is step-by-step and mandatory.

Guideline is optional. If a question describes a document as mandatory step-by-step instructions, that's a procedure. The objectives name four kinds of guideline. Benchmarks are consensus configuration guides, like the Center for Internet Security Benchmarks. Advisories are notices about a new threat or flaw. Implementation guides are the vendors' step-by-step setup instructions. And reference architecture is a proven blueprint design. So, you borrow a layout instead of inventing one. Here's a twist. When your

## 03:02 — Baselines and standards ([↗](https://www.youtube.com/watch?v=QNT9oLfo-3I&t=182s))

organization decides a benchmark is mandatory, it graduates from guideline to standard. Five standards show up by name. Baselines are the minimum secure configuration every system of a given type must meet. Password standards set length, screening, and reuse rules. Current NIST guidance asks for at least 15 characters when a password is the only factor, bans forced complexity rules, and says not to force routine changes unless you suspect compromise. Physical security standards cover buys. Physical security standards cover badges, locks, cameras, and visitor handling. RFCs, which stands for requests for comments, are the documents the Internet Engineering Task Force publishes to define how internet protocols work. And encryption standards name the approved algorithms, key lengths, and protocol versions.

Now, procedures and plans. A standard

## 03:56 — SOPs, BCP and disaster recovery ([↗](https://www.youtube.com/watch?v=QNT9oLfo-3I&t=236s))

operating procedure, or SOP, is the written, repeatable recipe for a routine task like onboarding a new employee. A runbook is its technical cousin, a step-by-step guide for a specific operational situation like isolating a compromised server. Automation tools often execute runbooks for you. Plans are the break glass documents. A business continuity plan keeps the business running during a disruption with alternate work locations and manual workarounds. A disaster recovery plan restores the technology afterward. Don't confuse the two. Business continuity asks, "How do we keep serving customers?" Disaster recovery asks, "How do we get the IT systems back?"

## 04:40 — The named security policies ([↗](https://www.youtube.com/watch?v=QNT9oLfo-3I&t=280s))

The objectives also name 10 policies. The information security policy is the master policy for the whole program. The acceptable use policy says what staff may and may not do with company systems. The bring your own device policy sets rules for personal phones and laptops, often requiring MDM enrollment and remote wipe. The clean desk policy says no sensitive papers or unlock screens left unattended, which blocks shoulder surfing. The incident response policy defines what counts as an incident and the duty to report. The data classification and retention policy sets the labels, how each is handled, and how long records are kept. The access control policy covers who gets access, who approves it, and how often it's reviewed.

The data disposal policy says how media and records are destroyed with proof. The vulnerability disclosure policy tells outsiders how to safely report a flaw they find in your systems. And the privacy policy says what personal data you collect, why, and what rights people have. One more distinction. The incident response policy is the authority while the incident response plan is the playbook that carries it out. Bring your own device deserves a closer

## 05:53 — Bring your own device ([↗](https://www.youtube.com/watch?v=QNT9oLfo-3I&t=353s))

look because it puts two worlds on one device. A personal phone holds family photos next to company email. Nobody on the security team chose its patch level, and a lost device can leak work data. The usual controls are mobile device management enrollment, containerization, which is a protected work area separate from personal apps, and selective wipe, which erases only the work data when the phone is lost or the employee leaves. Add minimum software requirements and a signed acceptable use agreement. The trade-off is privacy. The company needs enough control to protect its data without snooping. Now, frameworks and standards, which are borrowed blueprints. A framework is a proven reusable blueprint for building and measuring a program.

Think of a recipe from a trusted cookbook. You still cook the meal yourself. The exam

## 06:46 — Frameworks: the blueprint ([↗](https://www.youtube.com/watch?v=QNT9oLfo-3I&t=406s))

sorts them into three buckets. Industry-based standards are written for one sector, like card data or healthcare. International standards come from cross-border bodies and apply anywhere, like the ISO 27000 family. Region-specific standards are tied to a country or region, like the European privacy laws, or the NIST framework and the Defense Department program, which are American. The edges are fuzzy, so sort by the clue. One sector, many countries, or one place.

## 07:18 — NIST CSF and ISO 27001 ([↗](https://www.youtube.com/watch?v=QNT9oLfo-3I&t=438s))

The NIST Cybersecurity Framework is voluntary. Version 2.0, released February 26, 2024, has six functions: govern, identify, protect, detect, respond, and recover. Govern is the new one, and it sits at the center because it shapes the other five. ISO 27001 is an international standard defining an information security management system, and organizations can be formally certified against it. The current edition is the 2022 version, and the old 2013 version expired in October of 2025. Its companion, ISO 27002, describes 93 controls in four themes: organizational, people, physical, and technological. And ISO 27001 extends the approach to privacy.

## 08:09 — SOC 2, PCI DSS and CMMC ([↗](https://www.youtube.com/watch?v=QNT9oLfo-3I&t=489s))

SOC 2, short for system and organization controls 2, is a report written by an independent accounting firm. A type 1 report says controls are well designed on one date. A type 2 report says they actually worked over a period of months. Customers ask vendors for type 2. PCI DSS, the Payment Card Industry Data Security Standard, isn't a law. The card brands impose it on anyone handling card data. Version 4.0.1 is current, and since March of 2025, every requirement is mandatory. And CMMC, the Cybersecurity Maturity Model Certification, is the United States Department of Defense program for contractors handling sensitive federal information. Its contract rule took effect November 10th, 2025, and third-party certification for most of those contractors phases in starting November 10th, 2026.

Here's a quick tip for matching clues. Voluntary, six functions, and govern means the NIST framework. Certifiable management system means ISO 27001. An independent report a customer asks a cloud vendor for means SOC 2. Card data means PCI DSS. Now, risk management, which formalizes the security mindset. Risk is likelihood

## 09:34 — Risk management basics and types ([↗](https://www.youtube.com/watch?v=QNT9oLfo-3I&t=574s))

times impact. Risk management is the ongoing process of identifying risks, assessing them, deciding what to do, and tracking the outcome. Risk identification asks two questions. What do we own? That's asset identification, because you can't protect what you haven't listed. And who answers for it? That's stakeholder ownership. Every risk needs a named owner, usually the business person responsible for the asset, not only the IT team. Risk assessment puts a score on each risk, combining likelihood and impact, and categorizes it by type, like operational, financial, legal, or third party. Risk analysis digs into impact, likelihood, owner, and current mitigations, meaning the controls already in place, which lower the score before you add anything new.

Analysis comes in two styles. Qualitative uses judgment and categories, high, medium, low, and the classic output is a color-coded heat map. Quantitative uses real numbers, specifically money, so you can compare a risk to the cost of fixing it in the same units. Picture a weather forecast versus a thermometer. Qualitative says, "It'll be hot." Quantitative says, "34°." The living document that holds it all is the risk register, a list of risks, each with an owner, a score, current mitigations, a treatment decision, and a status. Communication means sharing it with owners and leadership. Reviews mean revisiting it on a schedule and after major changes or incidents. Now, the formula you must memorize.

SLE, the single loss expectancy, is the money you lose from one occurrence. It's asset

## 11:27 — SLE, ARO and ALE calculations ([↗](https://www.youtube.com/watch?v=QNT9oLfo-3I&t=687s))

value times exposure factor, the percentage of the asset lost. A $10,000 server that loses half its value gives an SLE of $5,000. ARO, the annualized rate of occurrence, is how many times per year you expect it. Twice a year is two. Once every four years is 0.25. And AL, the annualized loss expectancy, is the expected loss per year. SLE * RO = ALE. Let's work an example. A laptop theft costs $2,000 and you expect three a year, so the AL is $6,000. Now, test a control. Cable locks and tracking cost $2,000 a year and cut thefts from three to one. The new ALE is $2,000. The control saves 4,000 and costs 2,000, so you come out 2,000 ahead.

The key thing to remember is this: A control is worth buying when it reduces the AALE by more than it costs per year. Compare the savings to the cost, not the raw ALE to the cost. Now, the four risk treatments and the leaky roof analogy nails them. Avoid

## 12:43 — The four ways to treat risk ([↗](https://www.youtube.com/watch?v=QNT9oLfo-3I&t=763s))

means you eliminate the risk by not doing the risky thing. Don't buy the house with the bad roof. Transfer means you shift the financial impact to someone else. Buy insurance. Mitigate means you reduce the risk with controls. Fix the roof. That's most of security. And accept means the risk is small enough to live with because a new roof costs more than the drip. Accepting must be a conscious, documented decision, not neglect. Take customer data on an aging server. Avoid by moving to a managed service. Transfer with cyber insurance. Mitigate by patching and encrypting. Accept by signing off because the server retires next quarter. All four are legitimate and the best choice depends on cost, appetite, and how badly a breach would hurt.

A word of warning, transferring a risk does not erase it. You still own the outcome and the reputation damage. If your outsourced vendor leaks customer data, your customers blame you.

## 13:46 — Risk appetite and residual risk ([↗](https://www.youtube.com/watch?v=QNT9oLfo-3I&t=826s))

A few business-level ideas connect the numbers to the boardroom. A business impact analysis, or BIA, identifies your critical business functions and what an outage of each would cost and how fast each must recover. Risk appetite is how much risk the organization is willing to take on to pursue its goals. A growth-chasing startup has a bigger appetite than a cautious bank. Residual risk is what's left after treatment. The cable locks left $2,000 a year of expected loss. If residual risk is above appetite, you treat it further. If it's within appetite, leadership accepts it. Stakeholder involvement and management oversight means senior leaders approve acceptances. Security staff advise, but the business owns the risk.

And regulatory and legal factors can remove options entirely. You can't accept a risk that means breaking the law, like skipping a breach notification duty.

## 14:46 — Review and key takeaways ([↗](https://www.youtube.com/watch?v=QNT9oLfo-3I&t=886s))

Let's review what we covered in this lesson. Documents run from broad to specific. Policy is the law. Standard is the specific rule. Procedure and runbook are step-by-step. And guideline is optional advice with business continuity and disaster recovery plans for emergencies. Frameworks supply the blueprint. The NIST Cybersecurity Framework 2.0 with govern as its sixth function, ISO 27001, SOC 2, PCI DSS, and CMMC. Assess risk qualitatively or quantitatively. Memorize SLE * ARO = AL, and treat each risk by avoiding, transferring, mitigating, or accepting it. Residual risk must fit within appetite, and transferring never erases ownership.

## 15:39 — Quick check questions ([↗](https://www.youtube.com/watch?v=QNT9oLfo-3I&t=939s))

Now, here are a couple of quick checks to lock this in. First question. A document says all laptops must use full disk encryption with no exceptions. Is that a policy, a standard, a procedure, or a guideline? A standard. It's a specific, mandatory, measurable requirement, the speed limit that supports a broader policy. Second question. A server is worth $10,000, and a single incident would destroy half its value. It's expected to happen twice a year. What is the annualized loss expectancy? First, the single loss expectancy is $10,000 * 50%, which is $5,000. Then, SLE * ARO = AL. So, $5,000 * 2 = $10,000 per year. Next up, the other half of domain five, who you trust with your data, the rules others impose on you, and how someone checks that all of it is real.
