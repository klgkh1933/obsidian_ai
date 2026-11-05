# CompTIA Security+ SY0-801 3.2 Identity Architecture & Failure Modes | IAM & Resilience

[Watch on YouTube](https://www.youtube.com/watch?v=5mKdIAPqNLI)

## 00:00 — Identity Architecture and Failure Modes ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=0s))

Welcome back to the lab. Today, you are the security engineer on call. An identity system is failing. Who still gets in? I am Sec Guy. Last time we built a

## 00:10 — The Path Is Only as Trusted as the Identity ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=10s))

secure network path. But encryption only protects the road. It does not decide who should travel it. A secure tunnel can still carry excess privilege. Sarah can reach payroll in an old marketing administrator console. If her account is stolen, the attacker

## 00:26 — One Stolen Account, Two Access Paths ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=26s))

inherits both. That is why this matters. Identity

## 00:31 — Identity Is the Modern Control Plane ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=31s))

becomes the decision point. In a zero trust design, we do not grant broad trust just because someone is on an internal network. We evaluate the identity, device, requested resource, and policy for the access being requested. The check should be as close to the resource as the design permits. Sarah is

## 00:51 — Human and Non-Human Identities ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=51s))

not the only identity. The payroll application, backup process, scanner, and integration script also authenticate. A person can answer a verification challenge. A scheduled job usually cannot. We need to inventory and govern both human and non-human accounts with owners and purposes that somebody can explain. Give each identity only the

## 01:13 — Remove Standing Privilege ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=73s))

rights it needs for only as long as it needs them. That is least privilege. For Sarah, reading a report is different from changing payroll records. For a backup service, copying a protected database is different from administering the whole server. Start with the task, then grant the narrow permission that completes it. Sarah

## 01:36 — Standard Users Need Standard Rights ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=96s))

opens her everyday workstation as a standard user. She can read her assigned files and use approved applications, but she does not need local administrator rights just to prepare a report. If an update requires elevation, use a controlled auditable elevation path rather than making her normal account an administrator all day. Now, imagine a

## 01:58 — Least Privilege Limits the Malware Blast Radius ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=118s))

malicious document opens under Sarah's session. The attacker may still read or damage what Sarah can reach. But, an attempted system level change in this illustrated example is blocked because her account lacks the needed privilege. Least privilege reduces the blast radius. It does not make malware harmless, and it does not block every kind of persistence. The overnight

## 02:21 — Automation Also Needs an Identity ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=141s))

backup has its own identity. Sarah goes home. The task runs at 2:00 in the morning. That account should be recognizable as a service identity, limited to its backup job, and monitored for unusual use. If one service account can administer every host, an attacker has a much easier path through the environment. A password inside a script is a trap. A

## 02:43 — Never Hardcode Service Passwords ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=163s))

junior engineer may copy a working command into a shared repository and forget that the password is there. Now, anyone who can read that file may obtain a reusable credential. Even if the repository is private, backups, logs, and copied examples can spread the secret. For a Windows domain service, a

## 03:03 — Managed Service Identities ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=183s))

group managed service account can reduce that password handling problem. You may see its abbreviation, gMSA, on the exam. It is not a magic shield. It is a way to let approved computers use a managed service identity without placing a long-live password in the script. The directory owns the service

## 03:24 — Build Identities Specifically for Services ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=204s))

credential life cycle. Administrators configure which hosts are permitted to use the account. The service runs under that identity and gets only the resource permissions it needs. This is useful for a backup service, but it is not a substitute for monitoring

## 03:40 — Automatic Credential Rotation ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=220s))

the host or restricting where that service can run. Automatic password management changes the workflow. Instead of a person choosing a password, pasting it into configuration, and to rotate it, the domain manages the credential. Rotation reduces long-term exposure. The authorized host still needs to

## 04:00 — No Static Password to Steal ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=240s))

obtain what it needs to authenticate. So, protecting the host and limiting who can use the account remain important. Picture an attacker searching that service scripts for a static service password. In our illustrated design, there is no hard-coded password there to copy and reuse. That is the benefit shown on screen. It is not a promise that a compromised authorized host can never misuse the managed identity. We still contain the host, review its permissions, and investigate suspicious authentication.

## 04:32 — Govern Non-Human and Human Access Together ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=272s))

Service accounts are only half the picture. Sarah's personal account can also become dangerous without anyone deliberately granting her permanent superpowers. The risk grows one ordinary job change at a time. That is privilege creep. Privilege creep means old rights pile up

## 04:47 — Privilege Creep: Access Outlives the Job Need ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=287s))

after the job that justified them has changed. Nobody may have intended a toxic account. Each request looked reasonable when it was approved. The problem is that old access was never removed. The exam may ask you to identify this pattern in a scenario rather than simply recite the definition. Follow Sarah

## 05:09 — Joiner, Mover, Leaver Lifecycle Governance ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=309s))

through three career events. As a joiner in marketing, she gets the marketing drive. As a mover to finance, she needs a different set of rights. As a leaver, her organizational access must be removed according to policy. The move is the easy step to miss because she still works for the same company. Sarah moves into finance and

## 05:29 — New Role, New Access ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=329s))

receives a billing role. Before granting it, her manager and the application owner should decide exactly what she needs. Viewing invoices, approving a payment, and changing bank details are separate actions. Giving her all three merely because she joined finance would be a poor access decision. Her old marketing role

## 05:50 — Old Access Was Never Removed ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=350s))

survives the transfer because no one closed the old request. She can still edit public posts even though she no longer works in marketing. A clean move of workflow compares the old role to the new one, revokes what is no longer justified, and records the change. Now, put those two permissions

## 06:09 — Toxic Combinations of Permissions ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=369s))

together. Sarah can touch a payment workflow and a public messaging channel. Those rights may be harmless separately for different employees, but together they create a dangerous combination. This is where separation of duties matters. One person should not be able to initiate and approve a sensitive transaction without another check. One

## 06:30 — One Compromised Identity, Massive Blast Radius ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=390s))

stolen login now spans two departments. A phishing attacker who signs in as Sarah could abuse her current finance access and her forgotten marketing access. The fix is not just a stronger password. We must shrink the accounts reach, watch for anomalous use, and keep the role inventory current. Replace the

## 06:50 — Automate Access Governance ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=410s))

spreadsheet guesswork with a governed access process. Every sensitive role has an owner, an approver, a reason, and a review trail. Automation can gather the evidence and route a decision, but a manager still has to understand whether the permission supports the person's present job. At a scheduled access review, Sarah's manager

## 07:09 — Re-Certify or Revoke Access ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=429s))

sees her finance and marketing rights side by side. The manager can recertify a needed permission or remove one that no longer belongs. A policy may specify a deadline and automatic revocation after no response. That is an organization's chosen configuration, not a universal 90-day rule. Keep the decision and evidence.

## 07:35 — Design Identity Systems for Failure ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=455s))

Good access rules must survive bad days. It is easy to say who may sign in while every server is healthy? The harder question arrives when the firewall, identity provider, or building power fails. Does the system block, allow, or operate with restricted features? We decide and test before the outage. A failure mode is the behavior after a

## 07:58 — Failure Is an Architecture Requirement ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=478s))

fault. It is not just the fact that something broke. Picture Sarah trying to open payroll during an identity provider outage. Depending on the design, she may be denied, allowed, or given limited access. Each choice changes security and availability. Fail close means deny when

## 08:17 — Fail Closed: Block by Default ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=497s))

the check fails. If a policy engine cannot verify a new request, it refuses the request rather than assuming the user is authorized. That lowers the risk of an unverified session, but it may stop legitimate work. The exam wants you to recognize the trade-off. Not treat fail close as a universal best answer. Imagine the firewall inspection engine crashes. In a configured fail close path, traffic stops instead of passing without inspection. Customers may see an outage, which is a real cost. The team should know how to restore safe service, not simply congratulate itself for blocking packets. For a highly

## 08:58 — Protect Data Before Availability ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=538s))

sensitive transaction, denying unverified access may be the right design choice. That specific failure path can reduce exposure, but it does not guarantee confidentiality or integrity across the whole system. Backups, logging, change controls, and other threats still matter. We choose the failure response based on the resource and the risk. Now, move

## 09:22 — Fail Open for Life Safety ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=562s))

from the firewall to a building exit. In this illustrated code review design, loss of power releases the exit path so occupants can evacuate, while the perimeter alarm reports the event. Life safety is the first here. Actual door hardware, ingress control, and emergency release must follow the applicable code and approved design. Never infer a universal lock rule from this one picture. A digital fail open

## 09:49 — Availability Continues, Risk Increases ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=589s))

path has a different risk. Suppose a web inspection service fails, and the configured proxy passes traffic, so orders can continue. Availability improves, but uninspected traffic may carry a threat. If a team chooses that behavior, it needs compensating controls, alerting, a time limit, and a tested return to normal inspection. There is a middle

## 10:14 — Degraded Mode: Controlled Reduced Operation ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=614s))

design, degraded operation. It is neither everything works, nor everything stops. The system keeps a smaller, explicitly allowed set of functions. A useful degraded mode is planned, bounded, monitored, and tested before a real outage. Sarah can finish a limited

## 10:31 — Limited, Survivable, Controlled Access ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=631s))

task using a local capability while the primary identity service is unavailable. Maybe she can read a previously authorized document, but cannot approve a new payment. We must define the scope and duration of that local access. A cached login by itself is not a full authorization policy. In our designed

## 10:53 — Basic Access Continues, Critical Access Stops ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=653s))

outage run book, the local access gateway permits time-bounded basic tasks and blocks new tier one finance actions until a trusted check returns. That is a deliberate architecture we built and tested, not automatic behavior of every identity provider. If the real system cannot enforce the split, this graphic is only a design target, not proof it will happen.

## 11:17 — Govern Identity Through Failure ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=677s))

Identity governance does not pause during an outage. We still need logs, an incident owner, a way to see who used emergency access, and a procedure to revoke that access when normal service returns. Recovery should restore the policy, not leave a quiet permanent bypass behind. Open the identity failure modes

## 11:37 — Identity Failure Modes Worksheet ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=697s))

worksheet. It uses a synthetic company, so you can make the decision without touching a real system. Do not start by choosing a technology. Start by identifying the business task, the identity, and the resource at risk. First,

## 11:54 — Find the Privilege Creep ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=714s))

find the privilege creep. Which employee changed roles, but still has yesterday's permissions? Who can approve and execute the same sensitive action? Mark each right that lacks a current job reason. Then propose who should review and remove it. Explain the attacker's reach if that single identity is stolen. Rapid check.

## 12:15 — Choose the Right Failure Mode ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=735s))

Choose the failure behavior. A payment authorization service loses its identity check. Should it silently approve new payments, deny new approvals, or permit only a narrow pre-approved task? Pause and decide. For this high-impact action, deny an unverified new approval. A separately engineered degraded mode could keep a low-risk task running, but only if its limits were defined and tested. Now ask how the answer changes for an emergency exit. Get the reps in with

## 12:46 — Get the Reps In: Master Identity Failure Modes ([↗](https://www.youtube.com/watch?v=5mKdIAPqNLI&t=766s))

this one design decision. Who gets access, why, and what happens when the check fails? If you can explain Sarah's privilege creep and choose a defensible open, closed, or degraded response, you are moving from exam-ready to job-ready. Work the worksheet. Tell us which failure mode you chose and why, and keep practicing. I am Sec Guy. Stay safe and stay secure. >> [music] [bell]
