## Security that starts at deployment already lost

Here's the uncomfortable truth that

opens domain 2. Security that starts at

deployment has already lost. By the time

a model is serving traffic, every

consequential decision has already been

made. Where the data came from, who

labeled it, what got memorized into the

weights, and what nobody bothered to

check. You can bolt a firewall in front

of that model and you should, but you

cannot firewall away a poisoned data set

or a privacy violation that's already

baked into the parameters. So in this

episode, we stop thinking about the

model as the thing we secure and start

thinking about the life cycle, every

gate from data sourcing to retirement

because that's where the real control

lives. By the end, you'll be able to put

## What you'll learn

a named control at each gate, and you'll

understand why provenence is the word

that holds it all together. Let me tell

you what you'll walk away with. By the

end of this episode, you'll be able to

do three things. Place a security

control at each gate of the AI life

cycle. Explain what data security

actually means for AI: Provenence,

quality, labeling, integrity, privacy,

and minimization. and say plainly what

secure by design means when the system

is a model rather than an app. Welcome

to domain 2 which is the heaviest domain

on the entire exam at 40%. This is the

spine that the next eight episodes hang

from. So today we're going to draw that

spine the life cycle and the data that

flows through it. And remember the

series thesis se AI plus is a security

## The lifecycle as a chain of gates

architecture for AI exam wrapped in

framework fluency. The life cycle is the

architecture you're protecting. Don't

memorize a checklist. Instead, learn to

ask at every single gate, what could go

wrong here, and what control belongs

here. So, let's draw the chain once

because we're going to reuse it all

domain long. It goes data sourcing, then

data preparation, then training and

tuning, then evaluation, then

deployment, then monitoring, and finally

retirement. Here's the key mental model.

It's a chain. and the security property

is endto end. The system is only as

trustworthy as its weakest gate. A

pristine model trained on unvetted data

is not pristine. It just hasn't shown

you the problem yet. Now, let me walk a

control onto each gate because this is

the heart of the episode. At sourcing,

you know and record where your data

comes from. You vet and authorize your

sources and you capture provenence. At

preparation, you protect the integrity

of cleaning and labeling. You defend the

pipeline itself and you sanitize and

validate what comes in. At training and

tuning, you treat the training

environment, the code, and the resulting

weights as sensitive assets. You control

who can touch them, and you log every

time someone does. At evaluation, you

make this a real gate and not a

formality. You test for quality, bias,

safety, and robustness, and you refuse

to promote a model that fails. An

evaluation gate is a security control.

## Exam tip — anchor controls to the lifecycle stage

At deployment, you apply least

privilege, access control, careful input

and output handling, and fail closed

defaults. And the deeper architecture,

the gateways, and secure RA is episode

10. So here we just name the gate. At

monitoring, you watch for drift, abuse,

anomalous queries, and data leakage in

production because you cannot secure

what you do not observe. And at

retirement, you decommission models,

revoke access, and securely dispose of

training data and weights. Because a

forgotten model endpoint is an unowned

attack surface just waiting for someone

to find it. To anchor this in a

framework, NIST ARMF's map function is

understand the context and surface the

risks. And that's the front of the life

cycle. Its measure function is assess,

test, and monitor. And that's evaluation

and monitoring. ISO/IEC4201

wraps the whole thing as a managed

system with life cycle objectives. We're

## Data security for AI (provenance, quality, labels, privacy, minimization)

not citing clause numbers. We're

learning the shape. One thing worth

flagging for the exam. When a scenario

asks where a control belongs, anchor on

the stage of the life cycle, not on the

tool. You want to reason like this. This

risk shows up at data sourcing. So the

control is provenence and source

vetting, not byproduct x. The exam

consistently rewards life cycle stage

thinking. So train yourself to locate

the gate first. Now let's talk about

data security for AI directly because

here's the thing. The model is a

compression of its data. That means data

security is model security. They are not

two separate problems. There are five

properties you have to protect. First

providence. Where did every data set

come from and can you actually prove it?

I'll define that one precisely in a

moment. Second quality. Is the data

accurate, representative, and complete?

Because garbage in doesn't just become

garbage out, it becomes confidently

wrong out, which is far more dangerous.

Third, labeling integrity. Your labels

are an attack surface. Corrupted or

malicious labels silently steer the

model in directions nobody chose. So,

the control is trusted labelers, review,

and consensus or audit on the labels

themselves. Fourth, privacy. Training

data often contains personal or

regulated information and models can

memorize and regurgitate it word for

word. The controls there are

deidentification,

access control on the data sets, and

privacy review before training ever

starts because you cannot untrain a

leak. And fifth, minimization. Collect

and retain only the data you actually

need. Data you never ingested can't be

poisoned, can't be leaked, and can't be

subpoenenaed. Minimization is a security

control, not just a privacy nicity. A

simple way to make this concrete is a

one row data card for each data set.

It's source, license, collection date,

## [DEFINE] Data provenance

owner, sensitivity, and a check sum. And

the lesson is that the empty fields on

that card are exactly where the risk is

hiding. So what is data providence? It's

the documented, verifiable record of

where your data came from and everything

that happened to it along the way. its

origin, its chain of custody, and every

transformation applied before it reached

your model. If you can't trace a data

set back to a trusted source, you can't

trust the model you trained on it. Full

stop. Let's bring [clears throat] this

home with secure by design. For an AI

system, secure by design means the

security decisions get made at the front

of the life cycle as defaults instead of

being retrofitted at deployment when

## Secure by design for AI

it's already too late. There are three

moves that make it real. First, threat

model the data and the pipeline before

the model even exists. That's NIST

AIRMF's map function in practice.

Second, make evaluation a gate with a

veto. Quality, bias, robustness, and

safety checks that can actually block a

release, which is measure. And you pair

every life cycle risk with this control.

Third, carry provenence forward. The

providence you recorded back at sourcing

should still be queriable at monitoring

and at retirement because a control is

only as good as its durability across

the whole chain. And remember the series

rule. We pair attacks with defenses. The

train time attack of poisoning is

episode 8. The life cycle defenses, the

provenence, source vetting, labeling

integrity, and eval gates live right

here. We're building the wall today and

we'll watch people attack it. Next, tie

it back to the thesis. This is the

architecture lens. You're not securing a

magic box. You're securing a supply

chain of data and decisions with a named

control at every gate and a framework

standing behind each one. One more for

the exam and this one trips people up.

Know the difference between data quality

and data providence. Quality asks, is

the data accurate and representative?

Providence asks, can you prove where it

came from and what happened to it? They

sound similar and the exam will lean on

that distinction. So hold on to it this

way. Quality is about the data's content

and providence is about its chain of

custody. Let me leave you with three

takeaways. One, secure the life cycle,

not just the model. A named control at

every gate from data sourcing all the

way to retirement. Two, data security is

model security. Providence, quality,

labeling, integrity, privacy, and

minimization are where the real risk

lives. Three, secure by design means

those decisions are defaults made at the

front with evaluation as a gate that can

say no. Next up is episode 5,

adversarial machine learning, where

## Exam tip — quality vs. provenance

attackers stop respecting your life

cycle and start probing the model

directly. If this helped, subscribe and

drop a question in the comments. That's

the architecture lens. I'll see you in

the next