# CompTIA Security+ SY0-801 Domain 3 Workshop | Secure Architecture Challenge

[Watch on YouTube](https://www.youtube.com/watch?v=xxkRZlT1TTw)

## 00:00 — Domain 3 Secure Architecture Workshop ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=0s))

Welcome back to the lab. I am SEC guy. This is our domain 3 mastery workshop. You are the lead architect for a fictional multinational healthcare

## 00:10 — Scenario: You Are the Lead Architect ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=10s))

payment processor. Engineering wants your sign off on a remote medical billing application. The proposal uses one cloud region, a corporate VPN for

## 00:20 — Proposal Under Review: Can You Defend the Design? ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=20s))

remote staff, an unencrypted database for health and payment records, and nightly backups on the same cloud segment. Before I critique it, choose

## 00:30 — Decision 1: Sign Off or Hold Deployment? ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=30s))

A, sign off, B, add a location rule and sign off, or C, hold deployment until access, data, and recovery controls are specified and tested. Make your call. Choose C. A and B leave major

## 00:50 — Specify, Test, Then Claim the Control ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=50s))

assumptions untested. The VPN description does not tell us whether device health and application scope are enforced. The database needs a protected design and same segment backups do not establish an independent restore path. We will test each decision before making a claim about risk or compliance. Start with what the proposal cannot yet prove. The VPN description lacks evidence of device posture and application scope. Do not assume every VPN exposes the whole

## 01:20 — Sensitive Records: Find the Data-at-Rest Gap ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=80s))

network. The unencrypted database needs protected storage and access while exact privacy and payment impact depends on the data and rules that apply. Same segment nightly backups and one cloud region create shared failure risks. Neither establishes a 4-hour

## 01:40 — Assess Requirements, Risk, and Budget ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=100s))

restore or a 1-hour recovery point. Redesign and test instead of certifying those outcomes. As the architect, your job is not just to point out the flaws. Your job is to redesign the blueprint so the business can still process payments but securely and within budget constraints. A remote specialist needs

## 02:00 — Decision 2: How Do You Limit the Remote Specialist? ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=120s))

only the billing application. Which design can you defend? A let the VPN reach the corporate network. B allow access from approved locations or C authenticate each session. Check device posture and authorize only the billing resource.

## 02:20 — VPN vs. Location Rules vs. Application-Level Access ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=140s))

Choose C. A VPN can carry the session, but by itself it does not prove resource level authorization or device health.

## 02:30 — Billing-Only Access: Identity, Device, and Resource Policy ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=150s))

Location can be one policy signal, but B is not enough either. Document the actual enforcement points and test that a specialist reaches only the billing

## 02:40 — Zero Trust Enforcement: Block the Network Pivot ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=160s))

application. We must also engineer for failure modes. The authentication gateway should fail close when it cannot verify a required control that protects against unverified access, but it can interrupt legitimate billing work. The design must include a tested outage procedure, monitored recovery, and a

## 03:00 — Identity Provider Failure: Engineer the Fail-Closed Tradeoff ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=180s))

business approved availability trade-off. Next, we lock down the data layer, encrypt sensitive storage at rest, and protect the keys separately. Also review application level access and data in use for payment data. Tokenization can keep primary account numbers out of the main billing flow

## 03:20 — Tokenization: Keep PAN Data Out of the Billing Application ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=200s))

when the vault and mapping service are isolated and controlled. A token is not automatically harmless. Its value and the systems that can reverse or misuse it still need assessment. For this multinational workload, define data location and transfer rules from the requirements that actually apply.

## 03:40 — Cross-Border Health Records: Define the Rules That Apply ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=220s))

A crossber health record transfer needs legal and privacy review. Cloud location controls can help enforce the approved policy, but geo fencing alone does not prove compliance. Leadership sets a 4-hour recovery time objective and a 1-hour recovery point objective. Which claim is defensible?

## 04:00 — Geofencing Alone Does Not Prove Compliance ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=240s))

A, nightly backups on the same segment meet both targets. B, an unprovisioned alternate cloud is already a warm site.

## 04:10 — Recovery Architecture: 4-Hour RTO and 1-Hour RPO ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=250s))

Or C, both targets remain unproven until an independent recovery path and protected restore points pass a drill. Choose C. Nightly copies cannot by themselves demonstrate a 1-hour recovery point, and the single region service lacks a measured alternate path.

## 04:30 — Which Recovery Claim Can You Actually Defend? ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=270s))

Infrastructure templates may speed provisioning, but idle compute is not a warm site. Compare candidate alternate designs by tested provisioning, restore, dependency failover, user access, elapse time, and cost. Separately controlled immutable hourly snapshots are a

## 04:50 — Prepared Alternate Capacity vs. Proven Recovery ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=290s))

candidate for the recovery point, not proof. Verify capture, replication, delay, retention, keys, and a usable restoring drills. Now you walk into the boardroom to present the redesign architecture to the chief financial officer. The CFO asks whether the cheaper original blueprint can be

## 05:10 — Provisioning Templates Do Not Prove RTO ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=310s))

approved against those recovery targets. Do you A promise the targets? B fund a fully duplicated active active design before requirements or drills or C present the available evidence missing test cost and residual risk for a decision.

## 05:30 — Can the Cheaper Architecture Be Approved? ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=330s))

Choose C. A promises unproven targets. B may over buy and still leave dependencies untested. The original design concentrates access sensitive data and recovery risk. The proposed design narrows access, protects data, and creates a testable recovery path.

## 05:50 — Evidence Before Approval: Assumptions, Cost, and Residual Risk ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=350s))

These cost and impact figures are workshop assumptions, not audited results. Tokenization may reduce payment data scope only after the implementation is assessed. Its vault still needs controls. Show the CFO the evidence and gaps. Then ask which residual risk and cost the business will accept. Do not

## 06:10 — CFO Decision: Original Design vs. Proposed Design ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=370s))

promise 4 hours or 1 hour before drills support them. Your assignment for this module is to open the secure architecture challenge. You will be

## 06:20 — Balance Security, Sovereignty, Resilience, and Cost ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=380s))

handed a flawed hybrid environment. You must defend your choices for segmentation, data handling, and recovery against strict cost and sovereignty constraints. Get the reps

## 06:30 — Secure Architecture Challenge ([↗](https://www.youtube.com/watch?v=xxkRZlT1TTw&t=390s))

in. Build the architecture. I am SEC guy. Stay safe, stay secure, and I will see you in domain 4.
