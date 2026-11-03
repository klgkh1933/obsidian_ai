## The malicious model nobody saw (cold open)

A few months ago, a developer needed a

sentiment model. They searched a popular

model hub, found one with a friendly

name, thousands of downloads, and a

clean looking model card. And they did

what all of us do. They pulled the

weights and shipped it. What they didn't

see was that the file wasn't just

weights. Loading it ran code, and that

code quietly reached out to an

attacker's server the moment the model

was imported. No exploit, no fishing

email. The developer invited it in

because on a model hub, the malicious

thing and the legitimate thing look

exactly the same. [snorts] Here's the

shift for today. In modern AI, almost

nothing in your stack was built by you.

The model, the weights, the training

## What you'll learn

data, the libraries, the plugins. You

inherited all of it from strangers. So,

in this episode, we secure the supply

chain. How to know what you pulled in,

prove it's what it claims to be, and

stop the poison link before it reaches

production. Let me tell you where we're

headed. By the end of this episode,

you'll be able to draw the AI supply

chain from data set to hub to your app.

You'll be able to name the four headline

risks: tampered weights, malicious or

Trojaned models, typos squatted

packages, and license traps. And you'll

be able to put a named control on each

one. Providence, signing, scanning, and

AIBOM, vetting, and pinning. To frame

it, we're still in domain two, the big

## The AI/ML supply chain: what you inherited

40% domain. A few episodes back, we

secured the life cycle you own. Today is

the opposite. It's about everything you

don't own but depend on anyway, because

modern AI is assembled out of

third-party parts. And remember, the

lens of this whole series, architecture

and frameworks. A supply chain is an

architecture and securing it isn't a gut

feeling. It's provenence, verification,

and an inventory you can actually query.

Every control we name will hang on a

framework you can site. So, let's walk

the supply chain left to right and make

it concrete because every node here is a

trust decision someone made, often

silently. It starts with data sets,

scraped corpora, public data sets,

labeling vendors. You rarely see the raw

data that shape the model. Next,

pre-trained models and their weights.

That's a multi- gigabyte binary of

learned parameters. You can't read it

the way you read source code. You mostly

trust the name on the box. Then the ML

libraries and frameworks, your training

and inference stack, plus its deep

dependency tree, all pulled from public

package registries. Then model hubs.

Think of them as the app stores for

models and data sets. convenient, open,

and largely self-published. Downloads

and stars measure popularity, not

safety. And finally, plugins and MCP

servers. Third-party tools you bolt onto

the model to give it new powers. The big

idea tying all of this together is

transitive trust. When you adopt a

model, you don't just adopt that model.

you adopt its training data, its

dependencies, and its publishers entire

security posture, usually with no

contract and no review. That's exactly

why OASP put supply chain on the LLM top

10 as LLM03.

Because the risk isn't only in your

code, it's in everything your code

stands on. One thing worth flagging for

the exam, treat a pre-trained model the

same way you'd treat a third-party

## The four headline risks

software dependency you didn't write.

Because that is precisely what it is.

The mental model that scores points is

this. Every external model, data set,

library, and plugin is untrusted until

you've established its provenence and

verified it. Convenience on a hub is not

a security control. Now, where does this

actually go wrong? four headline risks.

The first is tampered weights. The model

file gets modified after the fact. A

## Define: model provenance

backdoor or trigger is baked into the

parameters or the loader itself is

rigged to execute code the moment you

import it. The second is malicious or

trojaned models on hubs. A model

published specifically to be downloaded

and trusted. Some are weaponized

serialization formats that run code on

load. Others behave perfectly normally

until a hidden trigger fires. The hub is

just the distribution channel. The third

is typos squatted ML packages. An

attacker publishes something like

TensorFlow or PyTorch utils hoping you

fatfinger a pip install. One bad

dependency in your training or inference

image and the whole pipeline is

compromised. That's a classic software

supply chain attack now aimed squarely

at the ML stack. And the fourth is the

quiet one. License and data rights

traps. A model or data set whose license

forbids commercial use or that was

trained on data the publisher had no

right to use. No code executes here, but

## Controls: provenance, signing, scanning, pinning

you inherit legal and compliance

exposure and possibly a model you'll

have to rip out later. Providence covers

your rights, not just your integrity.

And if you want the adversar's name for

all of this, MIT Atlas calls it ML

supply chain compromise technique

AML.T000010

covering the compromise of ML software

data and the model itself on the way to

you. So what is model provenence? It's

the documented, verifiable record of

where a model came from, and how it was

made, who published it, what data and

base model it was built on, how it was

trained, and an unbroken chain of

custody proving the file you're loading

is exactly the one they released,

unmodified.

No providence means no basis for trust.

You're just running a stranger's code on

faith. Now, let's pair every risk with a

control because that's the rule of this

series, and the supply chain makes it

clean. Providence and vetting answer

malicious models and license traps. Pull

from trusted authenticated sources.

Review the model card, the license, and

the publisher. And prefer models with a

documented lineage. Signing and

verification answer tampered weights.

Verify cryptographic signatures and

check sums before you load anything and

prefer safe serialization formats that

don't execute code on load. Don't trust

a file just because the download

## Define: AI-BOM

finished. Scanning answers Trojaned

models and bad packages. Scan model

files for unsafe code and known

malicious patterns and scan your

dependencies for known vulnerabilities

and typo squats exactly the way you scan

application code. Pinning answers the

whole chain. Pin exact versions and

hashes of your models, data sets, and

libraries so that what's in production

can't silently change underneath you. A

floating dependency is an open door. And

the control that ties it all together is

the AIBOM

because you can't secure what you can't

inventory. As for frameworks to site out

loud, OOWASP LLM3 names the risk and

NIST's secure software development

framework SP800-218

along with the SBOOM practice is the

proven software world playbook.

provenence, integrity verification, and

a bill of materials that we're simply

extending from software to AI artifacts.

## Exam tip: AI-BOM vs SBOM

So, what is an AI boom? An AI bill of

materials is a complete structured

inventory of every component that goes

into an AI system. The models and their

weights, the training and fine-tuning

data sets, the libraries and frameworks,

and the plugins or external services it

depends on along with each component's

version, source, license, and

provenence. It's the SBOOM idea extended

to AI. If a malicious model or a

vulnerable library is disclosed

tomorrow, the AIBOM is what lets you

answer, "Are we affected and where in

minutes instead of weeks?" One more

thing worth flagging for the exam. Know

the AIBOM as the AI counterpart to the

SBOOM and know why you'd want one. Rapid

impact assessment and provenence when

something in your supply chain turns out

to be compromised. If a scenario

describes a newly disclosed malicious

model or a bad ML dependency, the exam

## Recap & what's next

favored answer is the one grounded in

inventory plus provenence. Knowing what

you have and proving where it came from,

not scan harder after the fact. Let me

leave you with three takeaways. One, in

modern AI, almost nothing in your stack

was built by you. The model, the

weights, the data, the libraries, the

plugins are all inherited. and inherited

means untrusted until proven otherwise.

Two, the headline risks are tampered

weights, malicious models on hubs, typos

squatted packages, and license traps.

So, pair each one with a control

provenence, signing and verification,

scanning, and pinning.

Three, you can't secure what you can't

inventory. So, keep an AI boom. the

SBOOM idea grown to cover models and

data sets and demand model provenence

before you load anything.

[clears throat] Next up is episode 10,

secure AI architecture and deployment

where we stop inspecting the parts and

start designing the system that wraps

around them. If this helped, subscribe

and drop a question in the comments.

That's the architecture lens. I'll see

you in the next