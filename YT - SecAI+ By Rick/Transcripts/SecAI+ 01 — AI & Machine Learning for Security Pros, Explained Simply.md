## You can't patch a model like a server

When a server has a flaw, you patch it.

You ship a fix. You restart the service,

and the bad behavior is gone because

somebody wrote that behavior as code

line by line, and you just changed a

line. But you can't patch a model the

way you patch a server. A model didn't

get its behavior from code a human

wrote. It learned it from data as a

giant grid of numbers nobody can read.

There's no line to go fix. So before we

can secure these systems, we have to

understand what they actually are. By

the end of the next 11 minutes, you'll

be able to explain how machine learning

differs from normal software, where the

danger moments live, and why a model is

really three things at once: data, code,

## What you'll learn

and weights. Let me tell you where we're

going. By the end of this episode,

you'll be able to tell machine learning

apart from traditional software.

separate the two big phases of training

and inference. Name the model types

you'll meet without ever touching the

math and explain the three properties

that make AI a genuinely new security

problem. And here's the thesis that runs

through this whole series. SE AI plus is

at its heart a security architecture for

AI exam plus framework fluency. You

don't need to build models, you need to

defend them and that starts with knowing

what you're defending. One scope note

before we dive in. Today is purely the

mental model. The attack surface is

## ML vs traditional software

episode two. The frameworks are episode

three. No math, no exam questions yet.

Just the foundation that everything else

stands on. So let's start with the core

shift. Traditional software is rules

written by humans. If this, then that.

The behavior is the code. The code is

auditable and the same input gives you

the same output every single time.

Machine learning flips that arrow

around. Instead of a human writing the

rules, you show the system millions of

examples and it infers the rules itself.

You don't program the answer, you

program the learning. Here's an analogy

I like. Traditional software is a recipe

you wrote down step by step. Machine

learning is a cook who tasted 10,000

dishes and now just knows what works,

but can't fully tell you why. And that's

exactly why a defender should care. The

logic now lives in data and learned

numbers, not in readable source code.

You can't code review your way to

confidence the way you used to. That

single shift is the root of almost every

problem we'll cover in this series. So

what is machine learning? It's a way of

building software where the system

learns its behavior from data instead of

being explicitly programmed with rules.

You provide the examples and the model

discovers the patterns and uses them to

make predictions on data it has never

seen before. Now every machine learning

system lives in two distinct moments and

confusing them is exactly how people get

the security wrong. The first is

training. Training is the learning

phase. You feed in data. The model

adjusts millions of internal numbers

until its predictions get good and then

you freeze the result. It's expensive.

It happens offline and it's deeply data

hungry. The second moment is inference.

Inference is the using phase. The

trained model takes a brand new input

and produces an output, a

classification, a number, a sentence.

This is what's actually running in

production, answering your users all day

## Training vs inference (the two phases)

long. Picture the pipeline as a flow.

Data feeds into training. Training

produces the model, which is the

weights. The model serves inference and

inference produces output with a

feedback arrow carrying production data

back around for retraining. Here's why

that split matters so much for

defenders. The two phases have

completely different attack surfaces.

Poison the training data and you corrupt

the model before it ever ships.

Manipulate the inference input and you

fool a model that is perfectly healthy.

Same system, two completely different

threat moments. And we'll map both of

them in episode two. So what is

inference? It's the phase where a

trained model is actually used. It takes

a new input it has never seen and

produces an output such as a prediction,

a score, or generated text. Put simply,

training is how the model learns and

inference is how it works once it's

deployed. One thing worth flagging for

the exam, keep that training versus

inference line crisp in your head. So

many AI security scenarios hinge on

which phase an attack targets. Training

time data poisoning corrupts the model

itself, while inference time

manipulation fools an intact model at

the moment of use. Reach for that

distinction before you reach for a

control. Let's talk about model types at

a defender's depth. You don't need the

math here. You need to recognize the

family and understand what it implies

for security. Supervised learning is

trained on labeled examples like spam

versus not spam. Those labels are a

trust dependency. Wrong or tampered

labels mean a wrong model. Unsupervised

learning finds structure in unlabeled

data. Things like clustering and anomaly

detection. It's everywhere in security

tooling. And the catch is that normal is

just whatever the data said it was.

Reinforcement learning learns by trial

and reward, working toward a goal. It's

powerful, and it's also very easy to

accidentally point at the wrong goal.

Neural networks are layers of simple

units whose connection strengths, the

weights, encode everything that was

learned. The weights are the model's

knowledge. And then transformers and

LLMs are the architecture behind modern

large language models. They predict the

next token from context, which makes

them astonishingly capable. And

crucially for us, it means they can't

reliably tell their own instructions

apart from the data they're processing.

Hold on to that thought because it's the

seed of prompt injection, which we'll

get to in episode six. So, what is a

large language model? It's a very large

## Exam tip — which phase is under attack?

neural network, usually a transformer,

trained on massive amounts of text to

predict and generate language. It

produces fluent, useful output by

predicting the next piece of text from

context, which means it's powerful, it's

probabilistic, and it is not guaranteed

to be correct. So, why is all of this a

genuinely new security problem? Three

properties fall out of everything we've

just covered and each one breaks an

assumption that traditional security

relies on. The first is non-determinism.

## Model types: supervised → LLMs

The same prompt can give you different

answers. The behavior is probabilistic,

not fixed. Your test passing once

doesn't mean it always passes. And

signature style thinking really

struggles here. The second is data

dependence. The model's behavior is

inherited from its training data.

Whoever influenced the data influenced

the model which means data provenence

becomes a security control in its own

right and we'll build on that idea in

domain 2. The third is opacity. Nobody

can read the weights and explain a

specific decision. You can't audit the

source because the source is millions of

numbers. That makes these systems hard

to debug and hard to prove safe. And

here's the unifying mental model that

ties it all together. The model equals

data plus code plus weights. The code is

the architecture and the serving logic.

The data is what shaped it. And the

weights are the learned numbers that

actually hold the behavior. To secure an

AI system, you have to protect all

three, not just the application wrapped

around it. Picture them bracketed

together as a single asset. A server

icon for the code, a database icon for

the data, and a grid of numbers for the

weights. That whole asset view is the

architecture lens this entire series

runs on. Let me leave you with three

takeaways. One, machine learning learns

its behavior from data instead of being

coded by hand. And it runs in two

phases. Training, where it learns, and

inference, where it works. Two, the

model types you'll meet from supervised

learning all the way to transformers and

LLMs all come down to learned weights.

And an LLM can't cleanly separate its

instructions from its data. Three,

non-determinism, data dependence, and

opacity are exactly why you can't patch

a model like a server, and why a model

is really data plus code plus weights.

So, you have to protect all three. Next

up is episode two, the AI attack

surface, where we take this mental model

and map every place an attacker can

reach it. If this helped, subscribe and

## Why this is a new security problem

drop a question in the comments. That's

the architecture lens. I'll see you in

the next