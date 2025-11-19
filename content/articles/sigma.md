---
title: "Sigma dance: commit, challenge, respond"
tags: [zero-knowledge, cryptography, sigma, schnorr, pedersen]
authors: teddav
date: 2025-11-18
summary: Learn the fundamentals of Σ-protocols through the classic Schnorr protocol, exploring the three-step dance of commit, challenge, and respond. This post walks through knowledge soundness and witness extraction, then shows how to compose Sigma proofs with AND/OR logic and Pedersen commitments. See working SageMath implementations, discover how Fiat-Shamir transforms interactive proofs into non-interactive signatures, and understand the deeper mathematical structure as proofs of knowledge of homomorphism pre-images.
thumbnail: blog/sigmas.png
---

![cover](/img/blog/sigmas.png)

Ever wondered what a $\Sigma$-protocol is?

Fun fact: the name “Sigma” comes from the Greek letter $\Sigma$, which looks a bit like a zigzag, just like the three-step process this protocol performs 😊

Sigma is probably the most basic “zero-knowledge proof of knowledge” 😁 protocol: **prove you know something secret, without revealing the secret itself.**

You, the prover, know some private value(s) that satisfy a relation, and want to convince a verifier that this is true, without leaking $x$.

### The three steps Sigma dance

1. **Commitment:** the prover sends an initial commitment to the verifier
2. **Challenge:** the verifier replies with a random challenge
3. **Response:** the prover answers using the secret and the challenge

From the response, the verifier becomes convinced that the prover must know a valid witness satisfying the relation, all without ever seeing it.

Later on, we'll see how step 2 can be made non-interactive with Fiat-Shamir.

### Notation

Cryptographers often write things using multiplicative notation (like $g^x \cdot h^r$), but since most real implementations use elliptic curves, I'll use additive notation ($x \cdot G + r \cdot H$).

Same math, different flavor.

In this article, we'll use:

- $G$: an elliptic curve generator
- $H$: another, independent generator

## The Schnorr protocol

The Schnorr protocol is the simplest example of a $\Sigma$-protocol, the “hello world” of zero-knowledge proofs 😉

Here's the setup:

You, the prover, want to show that you know a witness $x$ such that

$$
Y =x \cdot G
$$

where $x$ is a scalar, and $Y$ is therefore a public curve point.

In practice, this is like proving you know the **private key $x$** corresponding to a **public key $Y$**.

**Step by step:**

1. Commitment

You pick a random scalar $r$ and send a commitment $T$ to that randomness

$$
T = r \cdot G
$$

2. Challenge

Verifier sends back a random challenge $c$, a random **scalar** (a number in the field, not an elliptic curve point).

3. Response

You reply with

$$
s= r + c \cdot x
$$

Finally, the verifier checks

$$
s \cdot G \stackrel{?}{=} T + c \cdot Y
$$

and accepts if it holds.

**Why it works?**

Let's plug things in:

$$
\begin{aligned}
s \cdot G &= T + c \cdot Y \\
&= (r + x \cdot c) \cdot G \\
&= r \cdot G + c \cdot x \cdot G \\
&= T + c \cdot Y
\end{aligned}
$$

So if the verifier's check passes, it means you must know the correct $x$.

At the same time, $r$ keeps $x$ hidden, the transcript reveals nothing about it.

Let's see the whole thing in action using SageMath.

We'll use a small toy elliptic curve to keep numbers manageable, but the logic is the same as in real-world cryptography.

```python
p = 929
Fp = GF(p)
E = EllipticCurve(Fp, [5, 15])
G = E.gens()[0]
Fr = GF(G.order())
```

Now let's walk through the **Schnorr Sigma protocol** step by step:

```python
x = Fr(123)
Y = x * G

r = Fr.random_element()
T = r * G

print("Sending commitment T to the verifier")

print("challenge should be computed as: c = hash(G, Y, T)")
c = Fr.random_element()

s = r + c * x

print("Sending s to the verifier")
assert s * G == T + c * Y
print("Proof is valid")
```

### Witness Extraction (a.k.a Soundness)

So, how do we know the prover really knows the witness $x$?

That's where **knowledge soundness** comes in: it means that if someone can successfully convince the verifier twice (with the same commitment), then we can **extract** the witness from those two runs.

Here's how it works in the Schnorr protocol:

We know that the commitment is

$$
T=r \cdot G
$$

and that for two successful transcripts with the same $r$, but different challenges $c$ and $c'$, we get:

$$
\begin{aligned}
s &= r + x \cdot c \\
s' &= r + x \cdot c'
\end{aligned}
$$

If we subtract those two equations, the randomness $r$ disappears:

$$
s-s' = (c-c') \cdot x
$$

From which we can recover the witness:

$$
x=\frac{s-s'}{c-c'}
$$

That's it: witness extraction!

This property is called **special soundness**, and it's one of the defining features of Σ-protocols.

It guarantees that no one can “fake” a proof without actually knowing $x$. In other words: **if you can respond to two different challenges using the same commitment, you must know the witness.**

```python
H = E.random_point()

# known commitment
v = Fr(123)
r = Fr.random_element()
print(f"v: {v}, r: {r}")
C = v * G + r * H

v_prime = Fr.random_element()
r_prime = Fr.random_element()
A = v_prime * G + r_prime * H

print("Sending commitments C and A to verifier")

print("challenge should be computed as: hash(G, H, C, A)")
c = Fr.random_element()

s1 = v_prime + c * v
s2 = r_prime + c * r

print("Sending (c, s1, s2) to the verifier")
assert s1 * G + s2 * H == A + c * C
print("Proof is valid")

c_prime = Fr.random_element()
s1_prime = v_prime + c_prime * v
s2_prime = r_prime + c_prime * r

print("Sending (c_prime, s1_prime, s2_prime) to the verifier")
assert s1_prime * G + s2_prime * H == A + c_prime * C
print("Proof is valid")

print("\nLet's try to recover v and r")
assert s1_prime * G + s2_prime * H - c_prime * C == s1 * G + s2 * H - c * C
assert (s1_prime - s1) * G + (s2_prime - s2) * H + (c - c_prime) * C == 0

# s1 G + s2 H + cv G + cr H = 0
# (s1 + cv) G + (s2 + cr) H = 0
# so we have:
# . s1_prime - s1 + (c - c_prime) * v = 0 -> v = (s1 - s1_prime) / (c - c_prime)
# . s2_prime - s2 + (c - c_prime) * r = 0 -> r = (s2 - s2_prime) / (c - c_prime)

print("\nRecovered v and r:")
recovered_v = (s1 - s1_prime) / (c - c_prime)
recovered_r = (s2 - s2_prime) / (c - c_prime)
print(f"recovered_v: {recovered_v}, recovered_r: {recovered_r}")
assert recovered_v == v
assert recovered_r == r
```

## Composing $\Sigma$-proofs

Now that we've nailed the basics, we can start doing something fun: combining Sigma proofs! 🥳

### Equality proof: two values share the same secret

Suppose you have one secret $x$, and two public values $Y$ and $Z$:

$$
\begin{aligned}
Y &= x \cdot G \\
Z &= x \cdot H
\end{aligned}
$$

Your goal: convince the verifier that both $Y$ and $Z$ are derived from the same secret $x$, that you're in possession of.

1. Commitment

Pick a random $r$:

$$
\begin{aligned}
T_g = r \cdot G \\
T_h = r \cdot H
\end{aligned}
$$

2. Challenge

Verifier sends a random challenge $c$

3. Response

$$
s = r + c \cdot x
$$

4. Verification

$$
\begin{aligned}
s \cdot G \stackrel{?}{=} T_g + c \cdot Y \\
s \cdot H \stackrel{?}{=} T_h + c \cdot Z
\end{aligned}
$$

If both equations hold, you've successfully proven that the same secret $x$ is used in both public values, without revealing it.

### AND proof: you know both secrets

Now let's say there are two independent secrets $a$ and $b$:

$$
\begin{aligned}
Y = a \cdot G \\
Z = b \cdot H \\
\end{aligned}
$$

You want to prove that you know both of them.

Pick a random $r$, and send:

$$
\begin{aligned}
T_g = r \cdot G \\
T_h = r \cdot H
\end{aligned}
$$

Receive $c$ and send the final response:

$$
\begin{aligned}
s_a &= r + c \cdot a \\
s_b &= r + c \cdot b
\end{aligned}
$$

Verifier checks

$$
\begin{aligned}
s_a \cdot G \stackrel{?}{=} T_g + c \cdot Y \\
s_b \cdot H \stackrel{?}{=} T_h + c \cdot Z
\end{aligned}
$$

If both checks pass, you've proven that you know both $a$ AND $b$ at once.

### OR proof: you know one of two secrets

This one's a bit trickier, but even more fun!

We have the same setup:

$$
\begin{aligned}
Y = a \cdot G \\
Z = b \cdot H
\end{aligned}
$$

but now **you only know one of the secrets** (say $a$), and you want to prove that you know _either_ $a$ or $b$, without revealing which.

**How do you do that?**

The idea is clever: we'll run two proofs in parallel, one for each relation, but we'll simulate one of them (the one we don't know).

To make the simulation indistinguishable from a real proof, we'll work with **two challenges** $c_1$ and $c_2$, chosen by the prover.

The only rule: they must add up to the verifier's challenge $c$:

$$
c_1+c_2=c
$$

This ensures the overall proof still fits the $\Sigma$-protocol structure: the verifier only sends one challenge, but internally it's “split” between the two subproofs.

Here's the trick:

- For the secret you **don't know**, you'll make up a fake transcript that looks valid.
- For the secret you **do know**, you'll compute the response honestly using $a$ and the verifier's challenge $c$.

That way, the verifier sees two valid-looking proofs but can't tell which one was simulated.

1. Commitment

As usual, pick a random $r$ and compute:

$$
T_1=r \cdot G
$$

For the secret you _don't_ know (here $b$):

- pick random values $s_2$ and $c_2$
- compute the corresponding commitment in a way that forces the final check to pass:

$$
T_2 = s_2 \cdot H - c_2 \cdot Z
$$

Send both commitments $(T_1,T_2)$ to the verifier.

Notice how $T_2$ only uses the public point $Z$ not the secret scalar $b$, since we don't know it.

2. Challenge

Now, the verifier sends a challenge $c$

3. Response

We're not going to use $c$ directly, instead we split it:

$$
c_1 = c-c_2
$$

Then computes the real response for the side you know:

$$
s_1 = r + c_1 \cdot a
$$

Remember that we already have $s_2$, previously generated randomly.

Send $(s_1,s_2,c_1,c_2)$ as your response.

4. Verification

$$
\begin{aligned}
s_1 \cdot G &\stackrel{?}{=} T_1 + c_1 \cdot Y \\
s_2 \cdot H &\stackrel{?}{=} T_2 + c_2 \cdot Z \\
c &\stackrel{?}{=} c_1 + c_2
\end{aligned}
$$

**Why It Works**

- The first equation is a real $\Sigma$-proof for the secret you know ($a$)
- The second equation is fake, but still consistent, because you built $T_2$ so it passes the check for your chosen $s_2,c_2$
- The verifier can't tell which part was simulated

So the verifier learns exactly one thing: that you know **either $a$ or $b$,** nothing more.

That's an **OR proof**, the foundation for “selective disclosure” in many ZK systems.

Now let's see how Sigma protocols can work together with **Pedersen commitments.**

```python
H = E.random_point()

# known commitment
x = Fr(123)
P1 = x * G

# unknown commitment
P2 = E.random_point()

print("Sending P1 and P2 to the verifier")

r = Fr.random_element()
T1 = r * G

c2 = Fr.random_element()
s2 = Fr.random_element()
T2 = s2 * H - c2 * P2

print("Sending T1 and T2 to the verifier")
print("Verifier sends challenge c")
c = Fr.random_element()

c1 = c - c2

s1 = r + c1 * x

print("Sending (c1, c2, s1, s2) to the verifier")
assert s1 * G == T1 + c1 * P1
assert s2 * H == T2 + c2 * P2
assert c1 + c2 == c
print("Proof is valid")
```

## Pedersen commitments

Pedersen commitments show up everywhere in zero-knowledge proofs. They're simple, powerful, and they hide secrets like a cryptographic vault.

$$
P = x \cdot G + r \cdot H
$$

where:

- $x$ is the witness you're committing to
- $r$ is a random blinding factor
- $G$ and $H$, you already know

Pedersen commitments are **hiding**, thanks to randomness $r$ no one can guess $x$ from $P$, and **binding,** once you've published $P$ you can't later change your mind about $x$ (except if you can solve the discrete log problem).

### The additive ➕ magic

Pedersen commitments are also **additively homomorphic**, which means commitments add up nicely:

$$
\begin{aligned}
P_1 &= x_1 \cdot G + r_1 \cdot H \\
P_2 &= x_2 \cdot G + r_2 \cdot H \\
P_1 + P_2 &= (x_1+x_2) \cdot G + (r_1+r_2) \cdot H
\end{aligned}
$$

In other words, adding two commitments gives you a commitment to the sum of the underlying values.

This property makes Pedersen commitments incredibly flexible in larger ZK systems.

To **open** a commitment, you simply reveal both $x$ and $r$.

## Pedersen + $\Sigma$

Now things get interesting.

Suppose there's a public Pedersen commitment $P$ that hides your private key $x$.

Someone asks you to prove that you actually know $x$, but of course, you don't want to reveal it. If you just sent your key, that'd defeat the whole point!

So instead, you use a $\Sigma$**-protocol** to prove knowledge of the _opening_ of the commitment.

### Prove knowledge of the opening $(x,r)$

Here's how it goes:

1. Commitment

Pick random values $r_x$ and $r_r$, and send:

$$
T = r_x \cdot G + r_r \cdot H
$$

2. Challenge: verifier picks a random challenge $c$
3. Response:

Compute your responses:

$$
\begin{aligned}
s_x &= r_x + c \cdot x \\
s_r &= r_r + c \cdot r \\
\end{aligned}
$$

4. Verification

The verifier checks:

$$
s_x \cdot G + s_r \cdot H \stackrel{?}{=} T + c \cdot P
$$

If this holds, he's convinced you know the witness $(x,r)$, without ever revealing them.

```python
H = E.random_point()

x = Fr(123)
r = Fr.random_element()
C = x * G + r * H

print("Sending commitment C to verifier")

r1 = Fr.random_element()
r2 = Fr.random_element()
T = r1 * G + r2 * H

print("Sending T to the verifier")

print("challenge should be computed as: c = hash(G, H, C, T)")
c = Fr.random_element()

s1 = r1 + c * x
s2 = r2 + c * r

print("Sending (s1, s2) to the verifier")
assert s1 * G + s2 * H == T + c * C
print("Proof is valid")
```

### Combining proofs with Pedersen commitments

Just like we combined Sigma proofs based on elliptic curve points earlier, we can do the same when using Pedersen commitments.

We'll go a bit faster this time. The pattern is the same, only with more moving parts.

**Two commitments, one secret**

Suppose we have **two Pedersen commitments** that should both hide the same secret value $x$.

We want to prove that this is true, and that we actually know $x$.

To keep things clear:

- $b_1,b_2$ will be the blinding factors inside each commitment
- $r$ values are the randomness used by the $\Sigma$ protocol itself

The two commitments are:

$$
\begin{aligned}
P_1 = x \cdot G + b_1 \cdot H \\
P_2 = x \cdot G + b_2 \cdot H
\end{aligned}
$$

Pick three random values $r_x,r_{b_1},r_{b_2}$, and send:

$$
\begin{aligned}
T_1 = r_x \cdot G + r_{b_1} \cdot H \\
T_2 = r_x \cdot G + r_{b_2} \cdot H
\end{aligned}
$$

We receive challenge $c$ from the verifier, and send responses:

$$
\begin{aligned}
s_1 &= r_x + c \cdot x \\
s_2 &= r_{b_1} + c \cdot b_1 \\
s_3 &= r_{b_2} + c \cdot b_2 \\
\end{aligned}
$$

Verifier checks

$$
\begin{aligned}
s_1 \cdot G + s_2 \cdot H &\stackrel{?}{=} T_1 + c \cdot P_1 \\
s_1 \cdot G + s_3 \cdot H &\stackrel{?}{=} T_2 + c \cdot P_2
\end{aligned}
$$

```python
H = E.random_point()

print("Here we prove that the same value is encoded in 2 Pedersen commitments")

x = Fr(123)
b1 = Fr.random_element()
b2 = Fr.random_element()
P1 = x * G + b1 * H
P2 = x * G + b2 * H

print("Sending commitments P1 and P2 to the verifier")

r_x = Fr.random_element()
r_b1 = Fr.random_element()
r_b2 = Fr.random_element()

T1 = r_x * G + r_b1 * H
T2 = r_x * G + r_b2 * H

print("Sending T1 and T2 to the verifier")

print("challenge should be computed as: hash(G, H, P1, P2, T1, T2)")
c = Fr.random_element()

s1 = r_x + c * x
s2 = r_b1 + c * b1
s3 = r_b2 + c * b2

print("Sending (c, s1, s2) to the verifier")
assert s1 * G + s2 * H == T1 + c * P1
assert s1 * G + s3 * H == T2 + c * P2
print("Proof is valid")
```

Just like before, you can also build AND or OR proofs on top of Pedersen commitments, proving you know both openings, or that you know the opening of at least one commitment.

As a gift, here's the code for the Pedersen OR proof:

```python
H = E.random_point()

# known commitment
x = Fr(123)
blinding = Fr.random_element()
P1 = x * G + blinding * H

# unknown commitment
P2 = E.random_point()

print("Sending P1 and P2 to the verifier")

r_x = Fr.random_element()
r_r = Fr.random_element()
T1 = r_x * G + r_r * H

c2 = Fr.random_element()
s2_x = Fr.random_element()
s2_r = Fr.random_element()
T2 = s2_x * G + s2_r * H - c2 * P2

print("Sending T1 and T2 to the verifier")
print("Verifier sends challenge c")
c = Fr.random_element()

c1 = c - c2

s1_x = r_x + c1 * x
s1_r = r_r + c1 * blinding

print("Sending (c1, s1_x, s1_r), (c2, s2_x, s2_r) to the verifier")
assert s1_x * G + s1_r * H == T1 + c1 * P1
assert s2_x * G + s2_r * H == T2 + c2 * P2
assert c1 + c2 == c
print("Proof is valid")
```

## Fiat-Shamir: making it non-interactive

So far, all our protocol has been interactive. The prover needs to receive random challenges from the verifier, after committing to some values.

But in many real-world settings (like digital signatures or blockchain proofs), there's no live verifier around.

That's where Fiat–Shamir comes to the rescue.

Instead of having a verifier send $c$, we **compute** it deterministically using a hash function.

$$
c = H(\text{transcript})
$$

The hash plays the role of the verifier: it generates a challenge that's unpredictable before the commitment, yet deterministic afterwards.

But we must be **very careful** about what goes into the transcript.

- If you forget something, the prover could change his commitments after seeing the challenge
- If you include too much, like private data, the verifier won't be able to recompute the hash and verify the proof

### What to include in the hash?

Typically, the transcript should include:

- the protocol's public parameters: $G$ and $H$
- the public inputs (for example the Pedersen commitment $P$)
- the prover's initial commitment $t$
- optionally, a domain separator to avoid cross-protocol collisions

These ensure the challenge $c$ is bound to the right context, and impossible to predict ahead of time.

### Unpredictable challenge

Why is it crucial that the prover cannot predict the challenge?

If the prover can guess the challenge $c$ before choosing $t$, he can fake a valid proof without actually knowing the secret $x$.

Let's see how:

The prover generates a random $s$ (the value normally sent in step 3), and computes:

$$
T = s \cdot G - c \cdot Y
$$

The verifier cannot distinguish between a correctly constructed $(T,s)$ and a "forged" one.

The verifier checks:

$$
T + c \cdot Y \stackrel{?}{=} s \cdot G
$$

which holds perfectly:

$$
\begin{aligned}
T + c \cdot Y &= (s \cdot G - c \cdot Y) + c \cdot Y \\
&= s \cdot G
\end{aligned}
$$

Boom 💥 the verifier is fooled, even though the prover never knew $x$.

That's why the **Fiat–Shamir challenge must be truly unpredictable** from the prover's perspective.

They must commit first, and only then can the challenge be derived from the public transcript. Never before.

### Schnorr signature

Before we wrap up, let's see how **Schnorr signatures** are built.

Now that we understand how the challenge comes from the **Fiat–Shamir transform**, you'll see that a Schnorr signature is really just a non-interactive Sigma protocol, with a message attached.

Same setup as before:

- private key $x$
- public key $Y = x \cdot G$
- random nonce $r$ and its commitment $T=r \cdot G$

But this time, we're signing a message $m$.

**Compute the challenge**

We derive the challenge using a hash function.

Normally, it would be:

$$
c=H(G,Y,T)
$$

But since we're signing something, we include the message in the hash:

$$
c=H(G,Y,T,m)
$$

This makes the signature bound to that specific message.

**Compute the final value**

That's what we previously called the "response". But since the protocol is not interactive anymore, it feels weird to call it that.

$$
s = r + c \cdot x
$$

The final **signature** is the pair $(c,s)$.

Notice that we don't need to send $T$: the verifier can recompute it.

**Verification**

To verify, the verifier reconstructs $T$, using the received value $s$ and the public key $Y$:

$$
\begin{aligned}
T' &= s \cdot G - c \cdot Y \\
&= (r+c \cdot x) \cdot G - c \cdot Y \\
&= r \cdot G
\end{aligned}
$$

Then checks that:

$$
c \stackrel{?}{=} H(G,Y,T',m)
$$

If it matches, the signature is valid.

And that's it. A **Schnorr signature** is literally the Schnorr $\Sigma$-protocol with the the signed message added to the transcript.

## Generalization: prove knowledge of a homomorphism pre-image

So far, we've seen Sigma protocols work in specific cases:

- With a simple elliptic-curve point $Y = x \cdot G$ we proved knowledge of $x$
- With Pedersen commitments $P = x \cdot G + r \cdot H$ we proved knowledge of $(x,r)$

If you noticed that both of these fit the same pattern, you're right!

What they both have in common is a **homomorphism**: a function that preserves the group operation.

Let's see how we can generalize Sigma protocols to any homomorphic function.

### Homomorphism

Let's define a generic **homomorphism**:

$$
\phi: (\mathbb{G_1},+) \to (\mathbb{G_2},+)
$$

This simply means that the function $\phi$ “respects” addition:

$$
\phi(u+v) = \phi(u) + \phi(v)
$$

That's, for example, elliptic curves:

$$
(3+4) \cdot G = 3 \cdot G+ 4 \cdot G
$$

where:

$$
\phi(x) = x \cdot G
$$

If we were working multiplicatively (like $g^a$, here $g$ being a generator in a multiplicative group and not an elliptic curve point), it would look like this:

$$
\phi(u + v)= \phi(u) \cdot \phi(v)
$$

and the function would be defined as:

$$
\phi: (\mathbb{G_1},+) \to (\mathbb{G_2},\times)
$$

### Intuition

The idea is that a Sigma protocol doesn't really care what $\phi$ is. As long as it's homomorphic, the same logic applies.

You're trying to prove that **you know some secret input $x$** such that

$$
Y = \phi(x)
$$

without revealing $x$

### Generic $\Sigma$-protocol

Here's how the generic protocol looks, abstracted over any homomorphism $\phi$.

You want to prove knowledge of a secret $x\in \mathbb{G_1}$

1. Commitment

Prover picks a random $r \in \mathbb{G_1}$ and sends:

$$
T = \phi(r) \in \mathbb{G_2}
$$

2. Challenge

The verifier sends back a random scalar

$$
c \in \mathbb{G}_1
$$

(a number in the field, not a group element).

3. Response

The prover computes

$$
s = r + c \cdot x \in \mathbb{G_1}
$$

4. Verification

The verifier checks that

$$
\phi(s) \stackrel{?}{=} T + c \cdot Y
$$

If the equality holds, the verifier is convinced that the prover must know some $x$ satisfying $Y = \phi(x) \in \mathbb{G_2}$

### Examples

**Elliptic curve discrete log**

$$
\begin{aligned}
&\phi : (\mathbb{Z}_q,+) \to (\mathbb{G_2},+) \\
&\phi(x) = x \cdot G
\end{aligned}
$$

Then you run the Schnorr protocol you already know.

**Pedersen commitments**

$$
\begin{aligned}
&\phi: (\mathbb{Z}_q^2,+) \to (\mathbb{G_2},+) \\
&\phi(x,r) = x \cdot G + r \cdot H
\end{aligned}
$$

The prover's secret is $(x,r)$ and the commitment is $P=\phi(x,r)$.

**Exponentiation**

$$
\begin{aligned}
&\phi: (\mathbb{Z}_q,+) \to (\mathbb{G_2},\times) \\
&\phi(x) = g^x
\end{aligned}
$$

Identical structure, just changing the group operation. Which gives:

$$
\begin{aligned}
y &= \phi(x) = g^x \\
t &= \phi(r) = g^r \\
s &= r + c \cdot x \\
\\
\phi(s) &\stackrel{?}{=} \phi(r) \cdot y^c \\
g^s &\stackrel{?}{=} g^r \cdot y^c
\end{aligned}
$$

### Why this matters?

This generalization shows that a Sigma protocol is fundamentally a **proof of knowledge of a pre-image under a homomorphism**.

As long as the function preserves the group operation, the proof works.

That's why Sigma protocols are so flexible: they're not tied to a specific use case, but to a mathematical structure.

This exact abstraction is what [Dan Boneh uses in his lecture](https://www.youtube.com/watch?v=wB3DlND7KEw) to show how $\Sigma$-protocols become a powerful foundation for more advanced ZK systems.

You can find all the SageMath scripts used in this article on my GitHub: [sigma-proofs](https://github.com/teddav/sigma-proofs)
