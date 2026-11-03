## Four maps, one territory

Four maps, one territory. That's the

whole idea of this episode. When people

first weigh into AI security, they drown

in acronyms. OASP this, NIST that,

Atlas, ISO, numbers, and they assume

these are rival frameworks fighting for

the same job. They're not. They're four

maps of the same territory, each drawn

for a different question. One lists the

risks. One thinks like the attacker. One

runs your risk management process. One

is the management system the whole thing

lives inside. By the end of the next 10

minutes, you'll know exactly which map

to pull out when, and you'll have the

vocabulary we use for the rest of this

series. So, let me tell you where we're

## What you'll learn

headed. By the end of this episode,

you'll be able to name what each of

these four frameworks is actually for.

Pick the right one for a given question

and read the rest of the series fluently

because we're going to keep citing these

by name. Here's the thesis to keep in

mind. SEC AI plus is at its heart

security architecture for AI plus

framework fluency. These four maps are

the fluency half. Every later episode

hangs its controls off one of them. And

let me be clear about scope because it

matters. Today is orientation to the

maps, not a governance deep dive. the

compliance and governance machinery, the

RMF in real depth, ISO 4201 audits, the

EU AI act, all gets its own domain later

## OWASP LLM Top 10 — the risk taxonomy

in episodes 16 through 18. Right now,

we're just learning what's on each map

and when to open it. Let's start with

map number one, the OASP top 10 for LLM

applications. This one is a risk

taxonomy. What it's for is simple. It's

a named ranked list of the most common

and most impactful risks in LLM powered

applications. Think of it as the what

can go wrong catalog. A shared

dictionary so that two engineers mean

the same thing when one of them says

that's an LLM01.

When do you reach for it? When you're

threat modeling a feature, writing a

security review, or tagging a finding.

It's developer facing and application

facing. It lives close to the code. Let

me walk the 2025 list at orientation

depth. Don't memorize this, just learn

to recognize it. LLM01 is prompt

injection. LLM02 is sensitive

information disclosure. LLM03

is supply chain. LLM04

is data and model poisoning. LLM05

is improper output handling. LLM06 is

excessive agency. LLM07 is system prompt

leakage. LLM8 is vector and embedding

weaknesses. LLM09 is misinformation. And

LLM10 is unbounded consumption. Here's a

bit of foreshadowing. Nearly every

episode in our threats domain is just

one of these entries zoomed all the way

in. Injection in episodes 6 and 7 is

LLM01.

Poisoning in episode 8 is LLM04.

Supply chain in episode 9 is LLM03.

And agents in episode 11 are LLM06.

So what is the OASP top 10 for LLM

applications? It's a community-built,

regularly updated list of the 10 most

## MITRE ATLAS — the adversary model

critical security risks in applications

that use large language models. Think of

it as the shared vocabulary for what can

go wrong. A risk taxonomy you use to

name, prioritize, and talk about

threats. It is not a process and it is

not a control set. Now, map number two,

Mitri atlas, the adversary model. What

this one is for is the attacker's eye

view of AI. It's a knowledge base of

real adversary tactics and techniques

against machine learning systems modeled

the same way MITER AT and CK does for

enterprise IT. Where OASP says here are

the risks you're exposed to. Atlas says

here is how an adversary actually

behaves step by step. When do you reach

for it? When you're redteing, doing

detection engineering, or working threat

intel. Anytime you want to think in

terms of attacker behaviors and map your

detections back to them, the techniques

carry IDs that look like AML.T

followed by four digits. A few

well-known ones, AML.T0051

is LLM prompt injection. AML.t0057

is LLM data leakage. AML.T0020 T0020

is poison training data and AML.T0024

is Xfiltration via ML inference API.

Again, recognize the shape of the ID.

## Exam tip — don't confuse the categories

Don't try to memorize the catalog. And

here's the pairing to hold on to. OASP

is the risks you're exposed to and Atlas

is the adversary who exploits them. One

thing worth flagging for the exam, don't

confuse the categories. A risk taxonomy

like OASP for LLMs tells you what can go

wrong. An adversary model like MITER

Atlas tells you how an attacker gets

there. A risk management process like

the NIST AIRMF tells you how your

organization decides and acts. And a

management system like ISO/IC4201

is the governance structure it all lives

inside. So, if a question hands you a

scenario, match it to the framework

whose job fits the scenario, not just

## NIST AI RMF & ISO/IEC 42001 — process vs system

the one with the most familiar-looking

words in it. That brings us to maps

three and four together because they're

a natural pair. Map three is the NIST AI

RMF, the risk management process. It's a

voluntary framework published as NISA

100-1,

and it's organized around four functions

that run as a continuous loop. Govern is

the culture and accountability that

wraps around everything else. Map is

where you understand context and surface

the risks. Measure is where you assess

and track them. And manage is where you

prioritize, treat, and monitor. There's

also a generative AI profile, NISAI

600-1,

that takes those same four functions and

applies them specifically to generative

AI risks. Reach for the RMF when the

question is, how do we run AI risk as an

ongoing practice?

MAP 4 is ISO/IEC420,01

published in 2023, the management

system. It's the first international

standard for an AI management system, an

AIMS, and it's certifiable in the same

family as ISO 27,01 is for information

security. It's the structure an

organization stands up to govern AI

responsibly across its whole life cycle.

The policies, the roles, the objectives,

the continual improvement. Reach for it

when the question is organizational and

auditable. How do we govern AI as a

system you can certify against? And one

honorable mention to keep your

vocabulary complete. NISTCSF

2.0 zero with its functions govern

identify protect detect respond and

recover is your general cyber security

backbone we'll crosswalk AI controls

back to it especially on the SOC and

governance episodes and to say the scope

boundary out loud one more time we are

orienting here the deep mechanics of the

RMF and 4201 are domain 4 territory

episodes 16 through 18 so what is the

NIS ST AI riskmanagement framework. It's

a voluntary US framework for identifying

and managing the risks of AI systems

organized around four functions. Govern,

map, measure, and manage. It's not a

list of risks and it's not a checklist

## How they fit — the 2×2

of controls. It's the process an

organization uses to handle AI risk

continuously from understanding the

context all the way through to

mitigation. Now, let's put them all on

one map. Four maps, one territory.

Picture a 2 by two sorted by what kind

of answer each framework gives and who

uses it. In the first quadrant, the risk

taxonomy. That's the OASP top 10 for

LLMs, telling you what can go wrong and

its application and developer facing. In

the second, the adversary model. That's

MITER atlas telling you how an attacker

behaves. And it's for your red team and

your detection engineers. And the third

the risk management process that's the

NIST AIRMF

telling you how you decide and act on

risk and its program facing and in the

fourth the management system that's

ISO421

telling you how you govern all of it as

an auditable system and its organization

facing and notice how they interlock.

Atlas techniques exploit OWASP risks.

The RMF is the process that decides what

to do about both of them. ISO 421 is the

management system that makes the RMF

actually stick and NISTCSF2.0

is the broader cyber backbone you map

all of it onto. Here's the thesis

landed. Knowing which map answers which

## Recap & what's next

question is the framework fluency half

of thinking like an AI security

architect. We'll be pointing back at

this 2 by two all series long. Let me

leave you with three takeaways. One,

these four frameworks aren't rivals.

They're four maps of one territory, each

built for a different question. Two,

match the map to the job. OWASP for LLMS

names the risks. MITER Atlas models the

adversary. The NIST AIRMF runs the risk

process and ISO 4201 is the management

system it all lives in. Three, this is

the shared vocabulary for everything

ahead. So when later episodes say that's

an LLM1 or that's a manage activity,

you'll know exactly which map we just

opened. Next up is episode 4, securing

the AI life cycle and data, where we

start applying these maps to real

controls across the AI life cycle. If

this helped, subscribe and drop a

question in the comments. That's the

architecture lens. I'll see you in the

next