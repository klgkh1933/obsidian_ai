ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) is a cryptographic method that allows two computers to establish a shared secret over an insecure network without ever transmitting that secret.

This is the remarkable part: even if an attacker records everything exchanged between the two computers, they cannot practically calculate the shared secret.

![[Pasted image 20261110154905.png|357]]

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

![532](data:image/svg+xml;charset=utf-8,%3Csvg%20font-family%3D%22-apple-system-body%2C%20ui-sans-serif%2C%20-apple-system%2C%20system-ui%2C%20%26quot%3BSegoe%20UI%26quot%3B%2C%20Helvetica%2C%20%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%20Arial%2C%20sans-serif%2C%20%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%20%26quot%3BSegoe%20UI%20Symbol%26quot%3B%22%20font-weight%3D%22400%22%20data-d-component%3D%22svg%22%20fill%3D%22currentColor%22%20style%3D%22color%3Argb\(237%2C%20237%2C%20237\)%22%20viewBox%3D%220%200%20340%20254%22%20width%3D%22100%25%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20x%3D%228%22%20y%3D%225%22%20width%3D%22130%22%20height%3D%2245%22%20rx%3D%228%22%20fill%3D%22%23DBEAFE%22%2F%3E%3Crect%20x%3D%22202%22%20y%3D%225%22%20width%3D%22130%22%20height%3D%2245%22%20rx%3D%228%22%20fill%3D%22%23DCFCE7%22%2F%3E%3Ctext%20x%3D%2273%22%20y%3D%2223%22%20fill%3D%22%231E40AF%22%20font-size%3D%2213%22%20font-weight%3D%22600%22%20text-anchor%3D%22middle%22%3EAlice%20\(Client\)%3C%2Ftext%3E%3Ctext%20x%3D%2273%22%20y%3D%2238%22%20fill%3D%22%231E40AF%22%20font-size%3D%2210%22%20text-anchor%3D%22middle%22%3EPrivate%20key%3A%20a%3C%2Ftext%3E%3Ctext%20x%3D%22267%22%20y%3D%2223%22%20fill%3D%22%23166534%22%20font-size%3D%2213%22%20font-weight%3D%22600%22%20text-anchor%3D%22middle%22%3EBob%20\(Server\)%3C%2Ftext%3E%3Ctext%20x%3D%22267%22%20y%3D%2238%22%20fill%3D%22%23166534%22%20font-size%3D%2210%22%20text-anchor%3D%22middle%22%3EPrivate%20key%3A%20b%3C%2Ftext%3E%3Cpath%20d%3D%22M138%2075%20H202%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%2F%3E%3Cpath%20d%3D%22M202%2075%20l-7%20-4%20v8z%22%20fill%3D%22%2364748B%22%2F%3E%3Cpath%20d%3D%22M202%20110%20H138%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%2F%3E%3Cpath%20d%3D%22M138%20110%20l7%20-4%20v8z%22%20fill%3D%22%2364748B%22%2F%3E%3Cg%20font-size%3D%2211%22%20fill%3D%22currentColor%22%20text-anchor%3D%22middle%22%3E%3Ctext%20x%3D%22170%22%20y%3D%2267%22%3EPublic%20A%3C%2Ftext%3E%3Ctext%20x%3D%22170%22%20y%3D%22102%22%3EPublic%20B%3C%2Ftext%3E%3C%2Fg%3E%3Crect%20x%3D%228%22%20y%3D%22130%22%20width%3D%22130%22%20height%3D%2253%22%20rx%3D%228%22%20fill%3D%22%23DBEAFE%22%2F%3E%3Crect%20x%3D%22202%22%20y%3D%22130%22%20width%3D%22130%22%20height%3D%2253%22%20rx%3D%228%22%20fill%3D%22%23DCFCE7%22%2F%3E%3Cg%20font-size%3D%2211%22%20text-anchor%3D%22middle%22%3E%3Ctext%20x%3D%2273%22%20y%3D%22149%22%20fill%3D%22%231E40AF%22%3EPrivate%20a%20%2B%20Public%20B%3C%2Ftext%3E%3Ctext%20x%3D%2273%22%20y%3D%22166%22%20fill%3D%22%231E40AF%22%20font-weight%3D%22600%22%3EShared%20secret%20S%3C%2Ftext%3E%3Ctext%20x%3D%22267%22%20y%3D%22149%22%20fill%3D%22%23166534%22%3EPrivate%20b%20%2B%20Public%20A%3C%2Ftext%3E%3Ctext%20x%3D%22267%22%20y%3D%22166%22%20fill%3D%22%23166534%22%20font-weight%3D%22600%22%3EShared%20secret%20S%3C%2Ftext%3E%3C%2Fg%3E%3Cpath%20d%3D%22M73%20183%20V206%20H170%22%20fill%3D%22none%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.5%22%2F%3E%3Cpath%20d%3D%22M267%20183%20V206%20H170%22%20fill%3D%22none%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.5%22%2F%3E%3Crect%20x%3D%2279%22%20y%3D%22208%22%20width%3D%22182%22%20height%3D%2238%22%20rx%3D%228%22%20fill%3D%22%23FEF3C7%22%20stroke%3D%22%23D69E30%22%2F%3E%3Ctext%20x%3D%22170%22%20y%3D%22223%22%20fill%3D%22%23854D0E%22%20font-size%3D%2211%22%20text-anchor%3D%22middle%22%20font-weight%3D%22600%22%3ESame%20shared%20secret%3C%2Ftext%3E%3Ctext%20x%3D%22170%22%20y%3D%22237%22%20fill%3D%22%23854D0E%22%20font-size%3D%2210%22%20text-anchor%3D%22middle%22%3ENever%20sent%20over%20network%3C%2Ftext%3E%3C%2Fsvg%3E)

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





