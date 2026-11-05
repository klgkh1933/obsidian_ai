# CompTIA Security+ SY0-801: 3.1 Secure Architecture

[Watch on YouTube](https://www.youtube.com/watch?v=Y-Yyei0BrGw)

## 00:00 — From Attacks to Secure Architecture ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=0s))

Welcome back to the lab. Today, we are designing a system that has to survive a bad day. In the last domain, we studied how attackers get in and what they do next. Now, we turn that knowledge around. If you know the likely attack paths, you can make deliberate choices about where to place systems and where to draw boundaries.

## 00:20 — Build Systems That Survive ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=20s))

Meet Sarah, a new security analyst at a regional shipping company. On Monday, the customer order portal went down during a busy shift. The warehouse kept moving, but dispatch could not see new orders. Her manager wants a design that can keep serving customers even when one component fails. There is a second constraint. Automated conveyors in the warehouse must not be exposed to the public portal. Customer addresses need protection, too. Sarah's job is not to buy the flashiest cloud service. It is to explain what belongs where, why, and what her team will still have to secure. For the Security+ exam, this is draft

## 01:00 — Compare Security Implications of Architecture Models ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=60s))

objective 3.1. Compare the security implications of architecture models. On the job, the same skill means asking what a design protects, what can fail, who owns each control, and what it costs to recover. Sarah starts by drawing three boxes: the warehouse control network, the customer

## 01:20 — Physical Location: Where Does the Hardware Live? ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=80s))

portal, and the order database. Before naming a product, she asks where each box should run. That physical placement changes power, cooling, network access, recovery, and legal obligations. One option is on-premises infrastructure, servers and facilities the company controls.

## 01:40 — On-Premises: You Own the Entire Stack ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=100s))

Sarah's team manages the racks, operating systems, physical access, power, and cooling either directly or through contracts. They can inspect the entire stack, but they must also maintain it. Think of on-premises as owning the workshop. You can decide exactly how to

## 02:00 — Control vs. Scale: The Architecture Tradeoff ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=120s))

arrange it. But when order traffic doubles, you cannot make a server appear by clicking a button. You need equipment, space, power, people, and time. Total control is a benefit only if the company can operate it well. The conveyor controllers are operational technology, computers that affect a

## 02:20 — Air-Gapped Systems: Physical Isolation ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=140s))

physical process. Sarah considers a truly air-gapped control segment with no network connection to the public portal or corporate network. That can reduce remote attack paths, but it also makes updates and monitoring harder. An air gap is not a magic shield. A technician could bring in an infected

## 02:40 — Physical Access Changes the Threat Model ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=160s))

removable drive, or a maintenance connection could create a path nobody documented. Sarah requires a controlled transfer process, approved media, and a clear inventory of every temporary connection. Not every system needs a complete air gap. Sarah separates warehouse control,

## 03:00 — Network Segmentation: Limit the Blast Radius ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=180s))

office workstations, and the customer portal into security zones. If the portal is compromised, segmentation should stop that access from becoming a direct route into the conveyors. For the highest risk control devices, separate switches and cables can enforce a physical boundary. A mistaken rule on the office switch

## 03:20 — Physical Separation: Strong Hardware Isolation ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=200s))

then cannot alone connect the warehouse controller. The trade-off of this more hardware, maintenance, and documentation. For lower risk office services, Sarah can use virtual local area networks and access rules on shared switching equipment. This is logical segmentation, different traffic groups on the same

## 03:40 — Virtualization: Logical Boundaries on Shared Hardware ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=220s))

hardware. It is flexible and often cheaper, but it depends on correct configuration. Sarah tests one rule before approving it. Can a portal server reach a warehouse controller? The answer must be no. A routing or access control mistake can erase a logical boundary, so changes need review, test, and monitoring, not just a

## 04:00 — Configuration Defines the Security Boundary ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=240s))

network diagram. Now, Sarah looks at the customer portal. Cloud services can make capacity easier to add, but the cloud is not a security exemption. It changes who runs the infrastructure and which controls Sarah's company must configure. She compares deployment models before moving data.

## 04:20 — Cloud Architecture Shifts Responsibility ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=260s))

In a public cloud, a provider serves many customers using shared infrastructure with isolation controls. Sarah could put the public-facing portal there and scale it for a seasonal rush. She must still configure access, networking, data protection, and monitoring for her workload. That A

## 04:40 — Private Cloud: Dedicated Infrastructure ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=280s))

private cloud is dedicated to one organization and may run in its own facility or in a hosted environment. Sarah might choose it for a workload with tighter control requirements. Dedicated resources do not automatically make it secure. The team still needs patching, access controls, and a recovery plan. A community cloud is shared by organizations with common needs, such as a defined regulatory or mission requirement. Sharing a platform may simplify common controls. Sarah would still verify the governance agreement. Who operates it, who can access data, and who handles an incident.

## 05:20 — Community Cloud: Shared Requirements and Controls ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=320s))

Hybrid architecture connects systems in more than one environment. Sarah could keep warehouse control on premises while placing the customer portal in a public cloud. The connection between them becomes a critical boundary. She would send only the data and commands that the business truly needs. Multi-cloud means using more than one

## 05:40 — Multicloud: Distributing Dependency and Risk ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=340s))

cloud provider. It can fit a specific requirement, but it does not automatically prevent lock-in or make a service resilient. Sarah would need compatible designs, tested failover, consistent identity controls, and people who can operate both environments. Complexity itself is a risk. Her manager asked, "If we move the portal, does the provider secure everything?" Sarah opens a responsibility chart. For each layer, facility, host, operating system, application, identity, and data, she writes an owner. An unassigned control is a future incident. On premises, the company is

## 06:20 — Define Security Responsibility and Ownership ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=380s))

accountable for the whole stack, even when a contractor performs a task. If a server loses power or misses a patch, Sarah cannot assume someone else handled it. She records the operator, the evidence of the work, and the recovery owner. In a typical public cloud service, the

## 06:40 — Security of the Cloud: Provider Responsibilities ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=400s))

provider protects the facilities and underlying infrastructure it operates. Exactly where that duty ends depends on the service. Sarah reads the service's specifics responsibility model instead of treating every cloud product as the same. The customer still owns its data, identities, access choices, and

## 07:00 — Security in the Cloud: Customer Responsibilities ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=420s))

configuration. With a virtual machine, the customer usually patches the guest operating system. With a managed platform, the provider handles more of the run time. Sarah asked about the exact service before assigning a patch or firewall task. The order database contains customer addresses.

## 07:20 — Data Location Determines Jurisdiction ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=440s))

Sarah asked where the data and backups will be stored, who can administer them, and which laws and contracts apply. Data sovereignty is about jurisdiction and control, not just depend on a region map. If a team selects a region in another country, that choice may introduce additional privacy and transfer

## 07:40 — Cloud Region Selection and Legal Impact ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=460s))

obligations. Sarah not announce that one law automatically governs every record. She checks the data classification, service terms, replication paths, and legal guidance before moving the data set. Placement is only half the design. The old portal is one large application.

## 08:00 — Application Architecture Has Changed ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=480s))

Login, orders, billing, and notifications deploy together. When one section needs a change, the whole system may need testing and release. Sarah asked whether smaller services would make failures easier to contain. In a microservice design, orders, billing, and notifications are separate

## 08:20 — Microservices: Small, Independent Functions ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=500s))

services communicating through application programming interfaces. Sarah can update one service without rebuilding every feature, but she must secure each connection, keep identities narrow, and watch the service dependencies. Suppose billing crashes. Authentication might stay available if

## 08:40 — Fault Isolation: Preserve Service During Failure ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=520s))

it has its own resources and no failing shared dependency. It might also fail if both services rely on the same database or network root. Sarah draws those dependencies and tests the failure instead of promising automatic isolation. For a short task, such as sending an order confirmation, Sarah considers

## 09:00 — Serverless: Run Code Without Managing Servers ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=540s))

serverless computing. The provider starts managed compute when an event arrives and handles the underlying runtime. Her team still owns the function code, permissions, secrets, data flow, and cost limits. To keep test and production environments consistent, Sarah describes

## 09:20 — Infrastructure as Code: Repeatable Architecture ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=560s))

infrastructure as code. Instead of manually clicking through settings, the team stores review definitions for networks, compute, and access controls. A repeatable template reduces guesswork, but a bad template repeats a bad configuration. Sarah proposes a template that creates the portal network, a private database

## 09:40 — Define and Secure the Environment in Code ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=580s))

path, and a rule blocking warehouse controllers. Before deployment, the team scans and tests the template against its security baseline. The code is a design that still needs validation. Version control shows who changed the rule and why. A peer can catch an overly broad network

## 10:00 — IaC Governance: Review, Version, and Roll Back ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=600s))

path before it goes live. If the new configuration fails, Sarah needs a tested rollback plan and protected data state. Restoring service is not always as simple as reversing one text file. Sarah now has several viable designs. The best answer is not cloud or

## 10:20 — Balance Technical Safeguards and Business Outcomes ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=620s))

on-premises by itself. She compares technical constraints, failure paths, recovery time, and operating responsibility with business constraints. Classification, cost, ownership, and acceptable risk. Availability asks whether customers can reach the portal right now.

## 10:40 — High Availability: Keep Critical Services Running ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=640s))

Resilience asks whether it can absorb a failure, degrade safely, and recover. Sarah might keep order lookup available during a billing outage, but she will not promise uninterrupted service without a design and a test. Extra compute, backup power, and a second failure zone can improve continuity.

## 11:00 — Resilience: Design Systems to Survive Disruption ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=660s))

They also increase cost and operational work. Sarah asks the business how long the portal may be unavailable, then chooses and tests the amount of redundancy that requirement supports. For the portal platform, Sarah compares a proprietary product with an open source alternative. The exam expects a trade-off,

## 11:20 — Redundancy: Remove Single Points of Failure ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=680s))

not a slogan. She considers usability, integration, support, patch cadence, ownership, and whether the team can recover when the vendor or community is unavailable. Open source lets the team inspect and adapt code, and commercial support may be available. That does not guarantee the code has

## 11:40 — Open Source vs. Proprietary Architecture ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=700s))

been reviewed, or that Sarah's team can maintain it. She checks the actual project, its update history, and her team's skills. A proprietary platform may offer a contracted support path and easier integration. It can also limit portability or make exit expensive.

## 12:00 — Support, Flexibility, and Vendor Lock-In ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=720s))

Sarah asks for an export plan and a recovery test before treating vendor support as a substitute for her own operational readiness. In the secure architecture lab, you take Sarah's seat. You are not naming cloud models from memory. You are making a defensible recommendation for the shipping company with its warehouse controls, customer

## 12:20 — Open the Secure Architecture Lab ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=740s))

portal, and classified order data. Consider three choices: keep everything on premises, move every workload to a public cloud, or use a segmented hybrid design. For each, write down the likely failure path, the recovery owner, the data location, and the controls your

## 12:40 — Compare Architecture Models in Context ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=760s))

team must operate. Sarah recommends keeping safety-sensitive controllers isolated on premises and placing only the public portal where it can scale. She requires a narrow, monitored connection to order data and a tested recovery path. That is not a universal answer. It fits these stated constraints.

## 13:00 — Make a Defensible Architecture Decision ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=780s))

Can you defend a different design? Rapid check. The portal moves to a managed cloud platform, but the warehouse controllers stay on premises. Which statement is most accurate? A, the provider now owns every security control. B, the team must map responsibility for each service and protect the connection

## 13:20 — Rapid Check: Cloud Migration and Shared Responsibility ([↗](https://www.youtube.com/watch?v=Y-Yyei0BrGw&t=800s))

between environments. C, a second cloud provider automatically makes both systems resilient. Pause and choose. The best answer is B because responsibility and boundaries still matter. If you can explain why Sarah chose each boundary, you are moving from exam ready to job ready. Try the secure architecture lab, then tell us which trade-off off you found hardest. Get the reps in, get the cert, and let's get you that job.
