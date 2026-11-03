## The stop-sign attack (cold open)

Here's

a stop sign. Any driver reads it in a

heartbeat, and so does the vision model

in a self-driving car. Now, an attacker

adds a few small stickers, a strip of

black and white tape placed just so. To

you and me, it's still obviously a stop

sign with some graffiti on it, but the

model now reads it with high confidence

as a speed limit 45 sign. Nobody touched

the car. Nobody breached the network.

The attacker changed a few pixels of the

world and walked the model straight

across an invisible line it didn't know

it had. That line is a decision

boundary. And today we attack it four

different ways. Fooling the model,

stealing the model, and pulling the

model secrets back out. And then we pair

## What you'll learn

every one of those attacks with the

defense that blunts it. Let me tell you

where we're headed. By the end of this

episode, you'll be able to do three

things. First, name and tell apart the

four classic adversarial machine

learning attacks. Second, explain why a

train model is attackable at all, which

comes down to its boundaries, its

gradients, and the query access you hand

out. And third, pair each attack with a

concrete defense, and locate the whole

problem on the inference API. Remember

the series thesis, SEC AI plus is

security architecture for AI plus

framework fluency. Watch for the pattern

today because almost every defense lives

in the architecture around the model,

## Why a trained model is attackable: boundaries, gradients, query access

the API, the rate limiter, the monitor,

not inside the weights. You rarely patch

a model out of these problems. You wrap

it and one scope fence before we start.

These are all inference time attacks on

a model that's already trained. Train

time tampering, poisoning, and back

doors. That's episode 8. the LLM

specific input attack prompt injection.

That's episode six and seven. Today is

the classic adversarial ML quartet. So

why is a train model attackable in the

first place? Start with what a

classifier actually does. Its whole job

is to carve the input space into regions

and draw decision boundaries between

them. Cat versus dog, fraud versus

legitimate, malware versus benign. Those

boundaries are highdimensional. They're

jagged. and the model is most uncertain

right next to them. So, an attacker's

goal is simple. Find the shortest nudge

that pushes an input across the nearest

boundary. How do they find that nudge?

With gradients. During training, the

model uses the gradient, the direction

that most increases an error to improve

itself. Flip the sign, and that very

same gradient tells an attacker the

direction that most breaks the model.

The smallest change to the input that

most increases its error. The math that

builds the model also tells you how to

fool it. And the thing that makes all of

this practical is query access. Every

model you expose, an API, a web form, a

download is a machine an attacker can

interrogate thousands of times. Send an

input, read the output, adjust, repeat.

Even with no gradients and no peak

inside, what we call black box, enough

query and observe loops will approximate

the boundary, then the gradient and

eventually the model itself. Hold those

three together, boundaries, gradients,

and query access because each of the

four attacks is just a different thing

an adversary does with them. One thing

worth flagging for the exam, sort the

## Attack 1 — Evasion (+ define)

four attacks by what they violate.

Evasion is an integrity attack. It bends

the model's decision at runtime.

Extraction, inversion, and membership

inference are confidentiality attacks.

They steal the model or its training

data. So, if a scenario is about a wrong

answer on purpose, think integrity,

think evasion. If it's about something

leaking out, the model, its data, or who

was in it, think confidentiality.

The control follows directly from the

column. Let's take the first attack,

evasion, fooling the model at runtime.

Evasion is the stop sign attack. The

model is fixed and trustworthy. The

attacker crafts an input that looks

benign or completely unchanged to a

human but lands on the wrong side of a

boundary. Think spam shaped to read as

ham, malware [clears throat] perturbed

to score as benign, a face patch that

defeats recognition, or that taped stop

sign. The crafted input is called an

adversarial example. and producing it is

MITER Atlas's craft adversarial data

technique. The perturbation can be tiny

imperceptible pixel noise or it can be

physical stickers and patches. The point

is that it's designed against this

specific model's boundaries. It isn't

random. The classic picture is a panda

image, original classified panda. Add a

faint layer of structured noise and the

model now calls it a gibbon. at 99%

confidence. The human sees one image,

## Attacks 2–4 — extraction, inversion, membership inference

the model sees two. So what is an

evasion attack? It's when an adversary

feeds a trained model a carefully

crafted input, an adversarial example

that a human would read normally, but

that the model mclassifies.

The model and its training are

untouched. The attack happens entirely

at inference time by exploiting the

model's decision boundaries to push one

input across the line on purpose.

Now, the other three attacks, stealing

the model and its secrets by querying,

these all run the same play. Query,

observe, reconstruct, but they aim at

different prizes. Picture the diagram.

The attacker sends many crafted queries

into your inference API, reads the

outputs, and rebuilds something from the

answers. First, model extraction or

model stealing. Here, you treat the

model as an oracle. Send a large

well-chosen set of inputs, record the

outputs, and train a substitute model on

those input output pairs. With enough

queries, the clone approximates your

model's behavior. Now they have your

intellectual property for free, plus a

private copy to craft evasion examples

against offline.

And returning raw confidence scores

makes this dramatically cheaper. Second,

model inversion. Instead of copying

behavior, the attacker reconstructs

inputs by probing how confidently the

model responds and optimizing against

it. They can recover a representative

example of a class. Famously recovering

a recognizable face from a facial

recognition model that was only ever

supposed to output a name. Third,

membership inference. The narrowest and

often the most damaging leak. Here, you

don't reconstruct the data at all. You

just ask was this specific record in the

training set? Models tend to be more

confident on data they memorized. So a

yes or no on membership is recoverable

from the outputs. And when the training

set is patients in the oncology study or

users in the breach corpus, membership

is the sensitive fact. That's squarely

OWASP LLM02

sensitive information disclosure.

Frame all three the same way. their

exfiltration through the front door.

Mitter trace names that surface directly

AML.T0024

exfiltration via ML inference API. The

attacker never needs to breach storage.

## Exam tip — integrity vs confidentiality

The prediction endpoint is the leak

channel, one query at a time. So what is

a membership inference attack? It

determines whether a specific data

record was part of a model's training

set without ever seeing that training

set directly. The attacker exploits the

fact that models behave a little

differently, often more confidently, on

data they were trained on. And even a

yes or no answer can be a serious

privacy breach when being in the data

set is itself the secret. Now, let's

## Defenses paired to each attack

pair every attack with a control. The

shape of each defense follows from the

three enablers. You can't delete

decision boundaries or gradients. So you

harden the model where you can and you

govern query access because that's the

lever you actually control. Start with

robustness which blunts evasion. That's

adversarial training where you train on

adversarial examples so the boundaries

sit farther from normal inputs plus

input pre-processing and sanitization

plus ensembles. It raises the attacker's

cost. Treat it as risk reduction, not a

cure. Robustness is an arms race, not a

patch. Next, rate limiting and query

monitoring, which blunt extraction,

inversion, and membership inference.

Every one of those attacks needs many

queries. So, per identity rate limits,

quotas, anomaly detection on query

patterns, watching for high volume

boundary probing or systematically space

filling inputs, plus authenticated

access. All of that turns a quiet

offline attack into a noisy, throttled,

detectable one. Then output

minimization, which starves all of them.

Return the least the use case needs.

Labels instead of full confidence

vectors, rounded or coarse scores,

suppress per class probabilities. Less

signal per query means more queries

needed, which makes rate limiting and

monitoring bite even harder. And for

inversion and membership specifically

add privacy preserving training like

differential privacy so the model

memorizes individuals less. Finally

monitoring and detection which catches

what gets through. Log and baseline your

inference traffic alert on the query

signatures we just described and watch

for a single principle slowly

reconstructing your model. This is your

manage function in the nistarmm sense.

Operational oversight of a deployed

model. And notice where every one of

these controls lives. The API gateway,

the rate limiter, the logging pipeline,

the training recipe. That's the

architecture around the model. The model

is the asset. The protection is the

system you build around it. One more

thing worth flagging for the exam. The

common thread across all of this is

query access. And the highest leverage

defenses, rate limiting, output

minimization, and query monitoring are

exactly the ones that don't touch the

## Recap & what's next

model's weights. So if a question asks

how to defend against extraction or

inference attacks, favor controls on how

much the API reveals and how often it

can be asked before you reach for model

internal fixes. Restrict the queries,

restrict the leak. Let me leave you with

three takeaways. One, adversarial

machine learning is four attacks on a

trained model. Evasion bends its answer.

That's integrity. While extraction,

inversion, and membership inference

steal the model or its data. That's

confidentiality. Two, they're all

possible because of decision boundaries,

gradients, and query access. And your

strongest lever is the one you own, the

query. Three, pair every attack with a

defense. robustness for evasion and rate

limiting output minimization and

monitoring around the inference API

which MITER atlas flags as AML.T0024.

Next up is episode 6 prompt injection

one direct and jailbreaks where the

attacker stops crafting pixels and

starts crafting words feeding

instructions straight into an LLM. If

this helped, subscribe and drop a

question in the comments. That's the

architecture lens.