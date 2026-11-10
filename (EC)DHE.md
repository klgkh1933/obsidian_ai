ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) is a cryptographic method that allows two computers to establish a shared secret over an insecure network without ever transmitting that secret.

This is the remarkable part: even if an attacker records everything exchanged between the two computers, they cannot practically calculate the shared secret.

Let's understand how it works.

## 1. The basic idea

Imagine Alice (client) and Bob (server) want to communicate securely.

They need a common secret key to encrypt their messages using AES.

But they have a problem: how can they agree on a secret when an attacker can observe their communication?

ECDHE solves this using mathematics.

The process:

1. Alice generates a temporary private key `a` and calculates a corresponding public key `A`.
    
2. Bob generates a temporary private key `b` and calculates a corresponding public key `B`.
    
3. Alice and Bob exchange their public keys.
    
4. Alice combines her private key with Bob's public key.
    
5. Bob combines his private key with Alice's public key.
    

Both obtain exactly the same shared secret!

An attacker sees `A` and `B`, but cannot feasibly calculate the secret without knowing `a` or `b`.

## 2. How can two different calculations produce the same secret?

This is the mathematical trick behind Diffie-Hellman.

With elliptic curves, we start with a publicly known point \(G\) on a curve.

Alice calculates:

\[ A=aG \]

Bob calculates:

\[ B=bG \]

Here, multiplication means a special elliptic-curve operation called scalar multiplication.

Alice calculates:

\[ S=aB=a(bG)=abG \]

Bob calculates:

\[ S=bA=b(aG)=baG \]

Because \(ab=ba\), they obtain the same point \(S\).

The attacker knows \(G\), \(A\), and \(B\), but cannot efficiently recover the private numbers \(a\) and \(b\) for properly selected cryptographic curves.

Important: The shared point is not normally used directly as an AES key. A key derivation function (KDF) processes the shared secret to produce the necessary encryption keys.

## 3. Why is it called Ephemeral?

Ephemeral means temporary or short-lived.

Each new TLS connection typically uses fresh ECDHE private keys.

SESSION 1

Private keys: a₁, b₁

Shared secret: S₁

SESSION 2

Private keys: a₂, b₂

Shared secret: S₂

Independent session secrets

Once a session finishes, its ephemeral private keys should be erased.

If an attacker steals the server's long-term authentication private key tomorrow, they cannot use it to reconstruct yesterday's ECDHE secrets.

This is forward secrecy.

## 4. But how does Alice know she is communicating with Bob?

This is an important security issue.

ECDHE alone does not authenticate the participants.

Without authentication, an attacker could intercept Alice's connection and establish separate secrets with Alice and Bob. This is called a Man-in-the-Middle (MITM) attack.

TLS solves this by combining ECDHE with authentication, typically using a certificate and digital signatures.

For example:

- ECDHE establishes the shared secret.
    
- RSA or ECDSA signatures authenticate the server.
    
- AES-GCM encrypts application data.
    

That is why RSA can still be used in a connection that provides forward secrecy.

## 5. RSA vs ECDHE vs AES

|Algorithm|Main purpose|
|---|---|
|RSA|Public-key encryption or digital signatures|
|ECDHE|Establish a shared secret|
|AES|Encrypt and decrypt application data|
|ECDSA|Digital signatures using elliptic curves|

These algorithms are not necessarily competitors. They perform different functions and can work together.

## 6. Check your understanding

An attacker records an ECDHE-based TLS connection today. Next year, they steal the server's RSA private key. Can they decrypt the recorded traffic?

A. Yes, because RSA is compromised.

B. No, because the ECDHE ephemeral private keys are independent of the RSA key.

C. Yes, because the attacker recorded the public keys.

Correct. Assuming the ECDHE exchange was secure and ephemeral secrets were erased, compromising the RSA authentication key does not reveal past session secrets.

For your SecAI+ studies, the most important principle is:

ECDHE = Secure key agreement + Temporary keys + Forward secrecy.

You do not need to memorize elliptic-curve mathematics for a conceptual understanding of TLS security. You should understand why the shared secret is never transmitted, why authentication is still required, and how ephemeral keys protect previous sessions.