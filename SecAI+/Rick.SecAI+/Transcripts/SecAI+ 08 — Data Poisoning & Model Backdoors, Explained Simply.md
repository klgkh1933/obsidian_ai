## The model that passed every test

Picture

a model that passes every test you throw

at it. It classifies, it answers, it

scores green on the Eval dashboard, and

then one day, someone shows it an image

with a small yellow sticker in the

corner, and the fraud detector that's

worked flawlessly for 6 months suddenly

waves the transaction right through.

Nothing was hacked at runtime. No

firewall was bypassed. The failure was

trained in months earlier. a handful of

poisoned examples that taught the model

a secret rule. When you see this

trigger, ignore everything you know.

That's a backdoor. And the unsettling

part is the model looks perfectly

healthy until the attacker decides it

shouldn't be. Today, [clears throat]

we're going to take apart how data and

## What you'll learn

models get poisoned at training, at

tuning, and even in the retrieval index.

And just as important, how you catch it

before it ships. Let me tell you where

we're headed. By the end of this

episode, you'll be able to do three

things. First, name the three poisoning

surfaces, the training data, the model

zone weights, and the tuning and

retrieval inputs you adapt and pull

from. Second, tell targeted poisoning

apart from availability poisoning. And

third, list the defenses and know

exactly where each one belongs in the

pipeline. Here's where this sits in the

series. Back in episode 4, we built the

secure life cycle and made the case that

data security is model security. Well,

this is the episode where attackers come

for that data. Poisoning is the

canonical train time attack. The

## Training-data poisoning & the shifted boundary

adversary corrupts what the model learns

before it ever serves a single request.

And remember the thesis of this whole

series. SEAI plus is a security

architecture for AI exam plus framework

fluency. Poisoning isn't a product you

buy a box to stop. It's a risk you

design controls around at specific gates

mapped to OASP LLM04 and to MITER atlas

technique AML.T0020.

Learn the gate, not the gadget. One

scope guardrail before we dig in. Today

is about corruption that happens during

learning and retrieval. How a poison

model or data set gets delivered to you

through a model hub or a package. That's

the supply chain. And that's episode 9.

attacks that manipulate a finished model

at inference time. Adversarial examples,

evasion, those were episode five. Here

the damage is baked in. Let's start with

training data poisoning because the

mechanism is simple to state. A model

learns the statistical shape of its

training set. So if you can inject,

alter, or mislabel even a slice of that

set, you can bend what the model learns.

You never have to touch the algorithm.

You change the data and the algorithm

faithfully learns your lie. Here's the

visual that makes it click. A

classifier's decision boundary is just a

line drawn to separate good from bad.

Drop in poison samples, mislabeled

points or carefully crafted ones, and

you drag that boundary across. Things

that used to land on the malware side

now sit on the benign side. Same model,

## Targeted vs. availability poisoning

moved line. Now, here's the contrast the

exam loves because there are two very

different intents behind poisoning. The

first is targeted poisoning, and it's

surgical. The attacker wants the model

to fail on one specific thing, one user,

one input pattern, one trigger, while

staying perfectly accurate on everything

else. It's quiet by design. Overall

metrics barely move, which is exactly

why it survives a casual evaluation. The

second is availability poisoning, and

it's blunt. The goal there is to degrade

the model for everyone, wreck overall

accuracy, make it unreliable, deny the

service its value. It's noisier, but

it's devastating. And sometimes the

whole point is simply to make the system

untrustworthy. To make this concrete,

think about your real world surface.

Anything trained on data you didn't

fully control. Scraped web text, public

data sets, user submitted content,

feedback loops where the model retrains

on its own outputs. Every one of those

is a place an adversary can slip

## Backdoors, trojans & the hidden trigger

examples in. So what is data poisoning?

It's the deliberate corruption of the

data a model learns from. by injecting,

altering, or mislabeling examples so

that the trained model behaves the way

the attacker wants. Because the model is

shaped by its data, poisoning the data

poisons the model, and it does so before

the system ever serves a single request.

Now, let's take that targeted attack to

its logical end because that's where

backdoors and Trojans live. A backdoor

teaches the model a hidden if statement.

normally behave correctly. But when you

see this specific trigger, switch to the

attacker's chosen output. And the

trigger is arbitrary and secret. A pixel

pattern, a rare word or phrase, a

special token, even an inaudible audio

cue. Here's why it's so dangerous. On

every normal input, the model is

genuinely good. So, it sails through

testing and it earns your trust. The

malicious behavior only ever appears

when the attacker presents the trigger.

They hold the key and you simply cannot

test for a trigger you don't know

exists. Now, this isn't only a train

from scratch problem. There are two

modern surfaces I want you to watch. The

first is fine-tuning poisoning. Most

teams don't train base models. They

adapt them with a smaller fine-tuning or

instruction data set. And that data set

is smaller, often less scrutinized, and

frequently third-party or user

contributed. that makes it a cheaper,

easier place to plant a backdoor than

the original training run ever was. The

## Tuning- & RAG-index poisoning

second is ra index poisoning. A

retrieval augmented system doesn't bake

everything into its weights. It pulls

from a knowledge base at query time. So,

poison that index, slip a malicious

document into the corpus the model

retrieves from, and you've poisoned the

systems answers without ever touching

the model. The weights are pristine, the

knowledge is corrupted. And one scope

reminder. So this doesn't blur together.

A poison document that injects

instructions the model then obeys at

query time. That's indirect prompt

injection. And that was episode 7. RA

index poisoning here is about corrupting

the knowledge the model treats as ground

truth. Related vectors different

mechanism. So what is a model backdoor?

A model backdoor, also called a Trojan,

is a hidden behavior planted in a model

during training or tuning so that the

model performs normally almost all the

time, but flips to an attacker chosen

output whenever it sees a specific

## Exam tip — targeted vs. availability

secret trigger. The model passes its

test precisely because the malicious

behavior stays dormant until the trigger

appears. One thing worth flagging for

the exam, hold the targeted versus

availability distinction firmly.

Targeted poisoning and its sharpest

form, the backdoor, makes the model fail

on one specific trigger, while overall

accuracy looks completely fine.

Availability poisoning degrades the

model for everyone. And the giveaway in

any scenario is the attacker's goal.

## Defenses: validate, trace, detect, gate

Surgical and stealthy points you to

targeted or backdoor. Broad degradation

points you to availability. Now, let's

pair every attack with its defense

because that's the rule of this series.

There's no single switch for poisoning,

so you have to think defense in depth

across the same life cycle we built in

episode 4. Start with trusted sources.

Control where your training, tuning, and

ra data come from. The cheapest poison

to stop is the data you never let in.

So, vet and authorize your sources

before they ever reach the pipeline.

Next, data validation and provenence.

Validate and sanitize incoming data and

keep a verifiable record of where every

data set and document came from and what

happened to it along the way. If you

can't trace it, don't trust it.

Provenence is what lets you answer the

question, could this have been tampered

with? Then anomaly and outlier

detection. Poison samples often look

statistically odd. Mislabeled points,

clusters that don't fit, examples that

disagree with everything around them.

outlier and influence analysis on the

data set can surface them before

training ever starts and you watch the

retrieval index exactly the same way.

And finally, the one the exam keeps

returning to evaluation gates before

promotion. No model gets promoted to

production until it passes evaluation.

Accuracy, robustness, bias, and wherever

you can manage it, backdoor and trigger

testing. The gate that can say no is

your last line of defense against a

poison model ever reaching users. That's

NIST AIRMF measure and it's the same

eval gate idea from episode 4. Map all

of this cleanly. The whole picture is

OWASP LLM04

data and model poisoning and the

training data attack itself is MITER

atlas AML.T0020

poison training data. Name the

framework, then name the control and tie

## Recap & what's next

it back to the thesis. You don't patch a

poisoned model. You architect the

pipeline so poison is hard to insert,

easy to detect, and can't pass the gate.

That's the architecture lens applied to

the data supply that feeds the model,

which is exactly the on-ramp to the

supply chain next episode. So, let me

leave you with three takeaways. One,

poisoning corrupts what the model learns

across three surfaces. the training

data, the model itself as a backdoor,

and the tuning sets and rag index you

adapt and retrieve with. Two, know the

intent. Targeted poisoning, including

the back door with its hidden trigger,

fails on one specific thing while

looking perfectly healthy. Availability

poisoning degrades the model for

everyone.

Three, defend in depth. trusted sources,

data validation and provenence, anomaly

detection, and an evaluation gate that

can refuse to promote a model.

That's [clears throat] OASP LLM04

and Atlas AML.T0020.

Next up is episode nine, AI/ML

supply chain security, where we follow

the poison upstream and look at how a

tampered model or data set gets

delivered to you in the first place.

If this helped, subscribe and drop a

question in the comments. That's the

architecture lens. I'll see you in the

next