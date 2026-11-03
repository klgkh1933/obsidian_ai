## AI is already in your scope (cold open)

AI is now inside your security scope.

Whether you invited it or not, someone

on your team shipped a chatbot. A vendor

quietly bolted a model onto a product

you already own. A co-pilot is reading

your source code right now. The model

became part of your attack surface, and

nobody filed a change request. So,

here's the deal. Over the next 20 short

episodes, I'm going to teach you how to

secure AI systems the way a working

security architect actually thinks about

them. Plain language, no math, mapped to

the public frameworks and to the CompTIA

SEC AAI plus domains. This first episode

is the map of the whole series. What

we'll cover, what the exam looks like,

and exactly how to study along. Let's

## What you'll learn

get oriented. Let me tell you what

you'll walk away with by the end of this

episode. You'll be able to describe what

the series covers and how it's

organized. You'll know the shape of the

SEC AI Plus exam. You'll be able to

explain the one idea that ties every

single episode together. And you'll have

a study routine that you'll actually

stick with. Quick credibility note while

we're here. I'm Rick and I build and

secure AI systems for a living. This is

the orientation, not a lecture full of

definitions. We're drawing the map

before we walk the territory. And here's

the thesis I want you to hold on to from

the very start. SEK AI plus is at its

heart a security architecture for AI

exam plus risk and framework fluency.

## What this series is + how it's structured

Design protection around models. Know

the risks and reach for the right

framework. That's the lens for all 20

episodes. So how is this thing

structured? 20 episodes 8 to 12 minutes

each grouped into five modules. There's

orientation, which is this one, and then

four modules that track the exam's four

domains. Let me give you the road map in

plain terms. Domain one is foundations,

episodes 1 through three. How machine

learning actually works for a defender,

the AI attack surface, and the

frameworks and vocabulary will lean on

all series. Domain 2 is securing AI

systems, episodes 4 through 11, and it's

the heaviest module by far. Life cycle

and data security, adversarial machine

learning, prompt injection, both direct

and indirect, data and model poisoning,

supply chain, secure architecture, and

agentic AI. This is the core of the exam

and the core of the job. Domain three is

AI assisted security episodes 12 through

15 using AI in the SOC for detection,

threat intel and automation and

offensive and vulnerability work plus an

honest look at the risks of leaning on

it. Domain 4 is governance risk and

compliance episodes 16 through 18 NIST

AI RMF ISO 4201 and the EU AI act and

responsible AI. And then we wrap in

episode 19 with exam day strategy and a

full series recap. Notice that the

episode counts mirror the exam weights.

We spend the most time exactly where the

exam and reality spend the most weight

securing the systems themselves. And

every episode follows the same rhythm. A

hook, objectives, three to five teaching

beats, a crisp definition or two, an

exam tip, and a recap. It's predictable

on purpose so you can binge the whole

thing or pick out just one. Now let's

talk about the exam by the numbers. The

exam is CY0-00001,

## The SecAI+ exam by the numbers

the first version, and it launched in

February 2026. If you've sat a CompTIA

exam before, the format is going to feel

familiar. Here's the format. Up to 60

questions, a mix of multiplechoice and

performance-based questions. Those PBQs

are the scenario-driven interactive

ones. You get 60 minutes and it's scored

on CompTIA's scale where passing is 600

out of 900. Who's it for? The

recommended background is roughly 3 to

four years of IT, two plus years of

hands-on cyber security and a security

plus, cysa plus or pentest plus level of

grounding or equivalent experience. This

is not an entry-level. It assumes you

already do security. And here are the

four domains and their weights. This is

the donut on screen and it's genuinely

worth memorizing the shape. Domain one

basic AI concepts for cyber security is

17%. Domain two securing AI systems is

40%. Domain 3 AI assisted security is

24% and domain 4 AI governance risk and

compliance is 19%. Read those weights as

a study budget. 40% of the exam and the

bulk of this series lives in domain 2.

If your time is tight, that's where it

goes. So, what is SE AI plus? It's

CompTIA certification, exam code

CY0-00001,

## Define: SecAI

that validates a security professional's

ability to secure AI systems, use AI

responsibly in defensive work, and

govern AI risk. In one line, it's a

security certification about AI, not an

AI certification about security. Let me

give you the through line I want stuck

in your head. Most AI security problems

aren't solved at the model. They're

solved in the architecture around the

model. The gateway, the access controls,

the data boundaries, the monitoring, and

## The thesis + the four frameworks

by reaching for the right framework to

reason about the risk. Across the

series, we'll keep coming back to four

public frameworks. Think of them as four

maps over one territory. There's the

OASP top 10 for LLM applications, which

is the application risk list. That's

where LLM01 prompt injection lives, and

so on down the list. There's NIST,

AIRMF,

the risk management life cycle built

around four functions, govern, map,

measure, and manage. There's MITER

atlas, the adversary behavior map for

attacks on machine learning systems. And

there's ISO/IEC4201,

the management system standard for

governing AI. Today, I'm just naming

them so the words aren't strangers

later. We orient to all four properly in

episode 3, and then each domain module

puts them to work. One thing worth

flagging for the exam, internalize those

domain weights, 17, 40, 24, 19, as a

mental map of the exam. You're not

memorizing a number to bubble in. You're

learning to recognize which kind of

problem a scenario is testing. Securing

a system versus using AI defensively

versus governing it. So you reach for

the right concept under time pressure.

And one more note on how I'll use these

tips throughout the series. An exam tip

is concept level emphasis only. It's

what to understand and why it matters.

## Exam tips + how to study

It's never a real or simulated exam

question and never the official

objective text. The authoritative

objectives live with CompTIA. Treat this

series as the explanation that makes

them click. So, how do you actually

study along and get the most out of

this? Watch in order at least once

because the modules build on each other

and then use individual episodes as a

reference later. Each episode slides and

notes live in the repo and the

description. Skim them after watching to

lock it in. Pace yourself by domain

weight and spend the most reps on domain

two. And pair all of this with CompTIA's

official exam objectives and training as

your authoritative source. This series

explains the concepts. The official

objectives define the test. One

important thing before we go further.

This is independent educational content

that I make. It is not affiliated with,

authorized, endorsed by, or sponsored by

CompTIA. CompTIA and SEAI plus are

## Unofficial disclaimer

trademarks of CompTIA Inc. used here

only to identify what we're studying.

This series teaches AI security concepts

and publicly available frameworks. It is

not exam material, not a brain dump, and

not a guarantee that you'll pass

anything. Always study the official

objectives straight from CompTIA. Three

takeaways. One, AI is already in your

## Recap & what's next

security scope and securing it is mostly

about the architecture around the model

plus framework fluency. That's the lens

for this whole series. Two, the SEAI

plus exam cy-001

is up to 60 questions in 60 minutes

across four weighted domains 17 40 24

19. and the 40% block securing AI

systems is where we spend the most time.

Three, watch in order, study by domain

weight, and use CompTIA's official

objectives as your source of truth. Next

up, episode one, AI and ML foundations

for defenders, where we'll build the

mental model of how machine learning

actually works and why those properties

create brand new security problems. If

this helped, subscribe and tell me in

the comments what brought you to AI

security. That's the architecture lens.