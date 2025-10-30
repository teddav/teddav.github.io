---
title: "Stay in Range: Deeper Into Bulletproofs"
tags: [zero-knowledge, cryptography, algebra, bulletproofs]
authors: teddav
date: 2025-11-01
summary: Range proofs
thumbnail: "blog/bulletproofs-cover.png"
---

<!-- ![bp cover](/img/blog/bulletproofs-cover.png) -->

We previously saw how the Bulletproofs Inner Product Argument (IPA) works: it lets us prove that we know a secret vector without revealing it.

That’s neat, but what can we actually _do_ with it?

**→ Range proofs!**

Bulletproofs are the backbone of modern range proofs: they allow us to prove that a secret value lies within a given range, without revealing the value itself.

## A motivating example

A great use case is **confidential transfers**.

Imagine you want to send money to a friend, but you don’t want anyone else to see how much. You still need to prove that the transfer makes sense: you’re not sending a negative amount or exceeding your balance.

For instance, let’s say:

- the maximum amount you can transfer is **100**
- the maximum balance allowed is **1000**

You would produce two range proofs:

1. **Transfer amount is valid:**

0 ≤ amount ≤ 100

1. **Resulting balance is valid:**

0 ≤ balance - amount ≤ 1000

If both hold, your transfer is correct… without revealing the actual numbers.

## What are we trying to prove?

We want to prove that a secret value $v$ lies in the range $[0,2^n)$, without revealing $v$.

You could adapt the same logic to any range $[a,b]$, but we’ll keep powers of 2, it makes the math cleaner.

As you probably guessed, we’ll reuse our vector machinery and the Inner Product Argument we built earlier.

## Notations

Whenever I use **bold**, it means I’m talking about a vector.

| Symbol                                              | Definition                                                      | Example                     |
| --------------------------------------------------- | --------------------------------------------------------------- | --------------------------- |
| $\mathbf{2}^n$                                      | vector of length `n` of successive powers of 2                  | $(2^0,2^1,2^2,...,2^{n-1})$ |
| $\mathbf{0}^n$                                      | vector of `n` zeros                                             | $(0,0,...,0)$               |
| $\mathbf{1}^n$                                      | vector of `n` ones                                              | $(1,1,...,1)$               |
| $\mathbf{y}^n$                                      | vector of length `n` of successive powers of a random value `y` | $(y^0,y^1,y^2,...,y^{n-1})$ |
| $z\mathbf{1}^n$                                     | vector of length `n` of only `z`                                |
| it’s the vector of `n` 1s, multiplied by scalar $z$ | $(z,z,...,z)$                                                   |

## **Breaking our secret number into bits**

The key trick in Bulletproofs range proofs is **bit decomposition**.

We represent the secret value $v$ as a sum of its bits.

Let $\mathbf{a}_L$ be the vector of bits of $v$.

For example, if $v = 123 = 0b1111011$:

$$
\mathbf{a}_L = (1,1,1,1,0,1,1)
$$

Then:

$$
\langle \mathbf{a}_L,\mathbf{2}^n \rangle=v
$$

That inner product expresses exactly how binary numbers work:

$$
a_{L_0} \cdot 2^0 + a_{L_1} \cdot 2^1 + ... + a_{L_{n-1}} \cdot 2^{n-1} = v
$$

_(note: here i’m assuming that $\mathbf{a}_L$ is in little endian)_

Let’s check with our example (in **big-endian** form):

$$
\begin{aligned}
&1 \cdot 2^6 \\
\ + &1 \cdot 2^5 \\
\ + &1 \cdot 2^4 \\
\ + &1 \cdot 2^3 \\
\ + &0 \cdot 2^2 \\
\ + &1 \cdot 2^1 \\
\ + &1 \cdot 2^0 \\
=& \text{ } 64 + 32 + 16 + 8 + 2 + 1 = 123
\end{aligned}
$$

Our range proof will revolve around convincing the verifier that:

- this equation holds, and
- each $\mathbf{a}_{L_i}$ really is a **bit** (0 or 1)

### **Convincing the verifier our bits are real 0s and 1s**

We can’t just _tell_ the verifier our bits, that would reveal $v$.

So we need a way to prove that every component of $\mathbf{a}_L$ is either 0 or 1.

For a single number $x$, being a bit means:

$$
x \cdot (x-1)=0
$$

Only if $x$ is 0 or 1 does the equation hold.

For vectors, we use element-wise (Hadamard) multiplication $\circ$:

$$
\mathbf{x} \circ (\mathbf{x}-\mathbf{1}^n) = \mathbf{0}^n
$$

So we define a new vector:

$$
\mathbf{a}_R = \mathbf{a}_L - \mathbf{1}^n
$$

and we want to prove that:

$$
\mathbf{a}_L \circ \mathbf{a}_R = \mathbf{0}^n
$$

which ensures that all entries of $\mathbf{a}_L$ are binary.

### A clever probabilistic trick

How can we prove that two hidden vectors multiply to zero without revealing them?

Let’s start with a simple intuition: suppose you want to prove that a secret number $x$ equals 0.

If the verifier gives you a random value $r$, and you respond with

$$
x \cdot r = 0
$$

_(we suppose you can’t cheat, and have to send the actual result of that product)_

then unless you’re (really) lucky, the only way that can hold is if $x=0$.

We apply the same idea to vectors.

The verifier sends a random vector $\mathbf{r}$ of length $n$.

The prover must show:

$$
\langle \mathbf{a}_L \circ \mathbf{a}_R, \mathbf{r} \rangle = 0
$$

If the verifier’s random challenge ($\mathbf{r}$) makes that true, it’s overwhelmingly likely that the inner product of $\mathbf{a}_L$ and $\mathbf{a}_R$ really is zero.

To reduce communication, the verifier doesn’t send the whole vector $\mathbf{r}$, but just a single random value $y$.

The prover then constructs $\mathbf{r}=\mathbf{y}^n$

### $a_R$ is correctly formed

We have one last issue… we also need to show that $\mathbf{a}_R$ was defined honestly:

$$
\mathbf{a}_R \stackrel{?}{=} \mathbf{a}_L - \mathbf{1}^n
$$

Easy! We do this by proving another inner product equals zero:

$$
\langle \mathbf{a}_L - \mathbf{1}^n - \mathbf{a}_R , \mathbf{y}^n \rangle = 0
$$

Again, because the verifier choses $y$ randomly, the prover can’t fake it.

### Recap: everything we must prove

In summary, the prover needs to prove three relations, each reduced to an inner product that can be verified using the IPA:

$$
\begin{aligned}
\langle \mathbf{a}_L , \mathbf{2}^n \rangle &= v \\
\langle \mathbf{a}_L - \mathbf{1}^n - \mathbf{a}_R , \mathbf{y}^n \rangle &= 0 \\
\langle \mathbf{a}_L, \mathbf{a}_R \circ  \mathbf{y}^n \rangle &= 0
\end{aligned}
$$

Notice that I slightly rearranged the third equation.

It’s equivalent to what we had before:

$$
\langle \mathbf{a}_L \circ \mathbf{a}_R, \mathbf{y}^n \rangle = 0
$$

but the structure of the equation now aligns better with how Bulletproofs commitments are expressed later on.

That’s our full setup! From here, we’ll move on to the heavier algebra that ties everything together.

## Combining inner products

So far, we have **three separate inner products** to prove.

That’s a lot of work. Ideally, we’d like to bundle them into a **single proof** that the verifier can check at once.

To do that, we introduce another random challenge from the verifier: $z$.

Then we take a **random linear combination** of the three equations using powers of $z$:

$$
\begin{aligned}
&z^2 \cdot \langle \mathbf{a}_L, \mathbf{2}^n \rangle + \\
&z \cdot \langle \mathbf{a}_L - \mathbf{1}^n - \mathbf{a}_R, \mathbf{y}^n \rangle  + \\
&\langle \mathbf{a}_L, \mathbf{a}_R \circ \mathbf{y}^n \rangle\\
&= z^2 \cdot v
\end{aligned}
$$

That way, the prover can’t “tune” each equation independently to cheat, everything must be consistent across the combination.

I’ll skip the full algebraic rearrangement, but if you want the gritty details, check out the excellent [Dalek documentation](https://doc-internal.dalek.rs/bulletproofs/notes/range_proof/index.html#combining-inner-products).

I’m not going to detail how we rearrange everything, but if you want the details, head to the great [Dalek crate documentation](https://doc-internal.dalek.rs/bulletproofs/notes/range_proof/index.html#combining-inner-products).

After simplification, we obtain a single clean relation:

$$
\langle \mathbf{a}_L - z\mathbf{1}^n, \mathbf{y}^n \circ (\mathbf{a}_R + z\mathbf{1}^n) + z^2 \cdot \mathbf{2}^n \rangle = z^2 \cdot v + \delta(y,z)
$$

A few observations make this expression interesting:

- the left part of the inner product is only a function of $\mathbf{a}_L$
- the right part depends only on $\mathbf{a}_R$
- the result depends only on $v$

That separation will make it easy to commit to each side later on.

Finally the term $\delta$ is a constant known to the verifier, so the prover doesn’t need to worry about it.

For completeness, it’s defined as:

$$
\delta(y,z)=(z-z^2) \cdot \langle \mathbf{1}^n, \mathbf{y}^n \rangle - z^3 \cdot \langle \mathbf{1}^n, \mathbf{2}^n \rangle
$$

## **From vectors to polynomials**

Up to now, we’ve combined our three inner products into one equation.

But we still can’t send these raw vectors to the verifier. Doing so would leak our secret values and defeat the whole purpose of zero knowledge. So we’ll hide them with **blinding factors**, and use **polynomials** to bundle everything together.

Finally we’ll see how the prover uses Pedersen commitments to commit and hide (again) values, while still allowing the verifier to make sure everything checks out.

### **Hiding our vectors with blinding terms**

The prover introduces two new random vectors: $\mathbf{s}_L,\mathbf{s}_R$.

They act as noise to mask the real vectors: $\mathbf{a}_L,\mathbf{a}_R$.

Using them, we define two polynomial vectors that depend on a variable $X$:

$$
\begin{aligned}
l(X) &= (\mathbf{a}_L + \mathbf{s}_L \cdot X) - z\mathbf{1}^n \\
r(X) &= \mathbf{y}^n \circ ((\mathbf{a}_R + \mathbf{s}_R \cdot X) + z\mathbf{1}^n) + z^2 \cdot \mathbf{2}^n
\end{aligned}
$$

When $x=0$, these polynomials reveal the original expression we care about:

$$
\begin{aligned}
l(0) &= \mathbf{a}_L - z\mathbf{1}^n \\
r(0) &= \mathbf{y}^n \circ (\mathbf{a}_R + z\mathbf{1}^n) + z^2 \cdot \mathbf{2}^n
\end{aligned}
$$

Now look at what happens when we take their inner product:

$$
\begin{aligned}
\langle l(0),r(0) \rangle &= \langle \mathbf{a}_L - z\mathbf{1}^n,\mathbf{y}^n \circ (\mathbf{a}_R + z\mathbf{1}^n) +z^2 \cdot \mathbf{2}^n \rangle \\
&= z^2 \cdot v + \delta(y,z)
\end{aligned}
$$

This is the **core equation** we ultimately want to prove.

By turning the vectors into polynomials, the prover can now safely reveal $l(X),r(X)$ at one random point (chosen by the verifier) instead of revealing the full secret vectors.

### **Taking their inner product**

What happens when we take the inner product of two polynomial vectors?

If we have: $\mathbf{a}x+\mathbf{b}$ and $\mathbf{c}x+\mathbf{d}$, then:

$$
\langle \mathbf{a}x+\mathbf{b},\mathbf{c}x+\mathbf{d} \rangle = \langle \mathbf{a},\mathbf{c}\rangle x^2 + (\langle \mathbf{a},\mathbf{d}\rangle + \langle \mathbf{b},\mathbf{c}\rangle) x+ \langle \mathbf{b},\mathbf{d}\rangle
$$

In other words, the result is a **quadratic polynomial**.

In our case, we’ll call that polynomial $t(X)$:

$$
t(X) = \langle l(X),r(X) \rangle = t_0 + t_1 \cdot X + t_2 \cdot X^2
$$

The constant term $t_0$ is exactly **our target inner product**:

$$
\begin{aligned}
t_0 &= \langle l(0),r(0) \rangle \\
&= \langle \mathbf{a}_L - z\mathbf{1}^n,\mathbf{y}^n \circ (\mathbf{a}_R + z\mathbf{1}^n) +z^2 \cdot \mathbf{2}^n \rangle \\
&= z^2 \cdot v + \delta(y,z)
\end{aligned}
$$

To compute the remaining coefficients $t_1,t_2$, we can use a simple Karatsuba trick:

$$
\begin{aligned}
t_2 &= \langle \mathbf{s}_L,\mathbf{s}_R \rangle \\
t_1 &= \langle l(0) + \mathbf{s}_L, r(0) + \mathbf{s}_R \rangle - t_0 - t_2
\end{aligned}
$$

This saves some redundant work: instead of expanding everything term by term, we reuse the existing parts to derive the cross-term $t_1$.

So from now on, our goals are:

- Prove that $t_0$ is correct: it equals $z^2 \cdot v + \delta(y,z)$
- Prove that $t(X)$ is well formed:
  - $l(X)$ and $r(X)$ are constructed correctly
  - $t(X) = \langle l(X),r(X) \rangle$

## **Committing to everything**

Before the verifier can check anything, the prover must **commit** to all the relevant values. In a way that’s binding (he can’t change them later) but still hiding (the verifier learns nothing).

These commitments are made to elliptic-curve points and follow a strict order.

### Step 1: commit to the secret value $v$

Using a random blinding factor $\gamma$:

$$
V=v \cdot G + \gamma \cdot H
$$

where $G$ and $H$ are fixed, independent elliptic curve generators.

### Step 2: commit to the bit vectors

Now the prover commits to vectors $\mathbf{a}_L$ and $\mathbf{a}_R$, and the blinding vectors $\mathbf{s}_L$ and $\mathbf{s}_R$:

$$
\begin{aligned}
A &= \langle \mathbf{a}_L, \mathbf{G} \rangle + \langle \mathbf{a}_R, \mathbf{H} \rangle + \alpha \cdot h \\
S &= \langle \mathbf{s}_L, \mathbf{G} \rangle + \langle \mathbf{s}_R, \mathbf{H} \rangle + \rho \cdot h
\end{aligned}
$$

where:

- $\mathbf{G}$ and $\mathbf{H}$ are vectors of elliptic curve points (one per bit of $\mathbf{a}_L$)
- $h$ is another random elliptic curve generator
- and $\alpha,\rho$ are blinding scalars

Once $A$ and $S$ are committed, the verifier (or the Fiat-Shamir heuristic) can produce challenges $y$ and $z$.

These are then used to define $l(X),r(X)$ and $t(X)$.

### Step 3: commit to $t(X)$

Finally, the prover commits to the **coefficients** of $t(X)$: the linear and quadratic terms $t_1$ and $t_2$, each with its own blinding factor $\tau_1,\tau_2$:

$$
\begin{aligned}
T_1 &= t_1 \cdot G + \tau_1 \cdot H \\
T_2 &= t_2 \cdot G + \tau_2 \cdot H
\end{aligned}
$$

These commitments make sure the prover can’t later tweak $t(X)$ to make the equation magically work.

## Putting it all together: verification

Everything is almost ready! 🤩

The prover has committed to all the right pieces. Now the verifier just needs to check that everything lines up.

## The final challenge

The verifier sends one last random challenge $x$.

By evaluating the polynomials $l(x),r(x)$ and $t(x)$ at this random point, we can check that the claimed relationships hold with overwhelming probability (thanks to the Schwartz–Zippel lemma).

The prover computes:

$$
\begin{aligned}
\mathbf{l} &= l(x) \\
\mathbf{r} &= r(x) \\
\hat{t} &= \langle \mathbf{l},\mathbf{r} \rangle \\
\tau_x &= \tau_2 \cdot x^2 + \tau_1 \cdot x + z^2 \cdot \gamma \\
\mu &= \alpha + \rho \cdot x
\end{aligned}
$$

Here:

- $\hat{t}$ is the evaluation of $t(X)$ at $x$, equal to the inner prod of $\mathbf{l}$ and $\mathbf{r}$
- $\tau_x$ combines all the blinding factors for $t(x)$
- $\mu$ combines the blinding factors for $A$ and $S$

## Verifier check #1: the polynomial $t(x)$

First, the verifier ensures that $\hat{t}$ matches the claimed polynomial evaluation $t(x)$.

Conceptually, it checks that:

$$
\hat{t} \stackrel{?}{=} \langle \mathbf{l},\mathbf{r} \rangle
$$

and also that the commitment to $t(x)$ is consistent with all earlier commitments.

The actual check is:

$$
\hat{t} \cdot G + \tau_x \cdot H \stackrel{?}{=} z^2 \cdot V + \delta(y,z) \cdot G + T_1 x + T_2 x^2
$$

Why does this hold?

$$
\begin{aligned}
t(x) \cdot G &= (t_0+t_1x+t_2x^2) \cdot G \\
t(x) \cdot G &= (z^2 \cdot v + \delta(y,z)) \cdot G + t_1x \cdot G + t_2x^2 \cdot G \\
t(x) \cdot G &= z^2 \cdot v \cdot G + \delta(y,z) \cdot G + x(T_1 - \tau_1 \cdot H) + x^2(T_2 - \tau_2 \cdot H) \\
t(x) \cdot G &= z^2 \cdot v \cdot G + \delta(y,z) \cdot G + T_1x - \tau_1 x \cdot H + T_2 x^2 - \tau_2 x^2 \cdot H \\
t(x) \cdot G + (\tau_1 x + \tau_2 x^2) \cdot H &= z^2 \cdot (V - \gamma \cdot H) + \delta(y,z) \cdot G + T_1x + T_2 x^2 \\
t(x) \cdot G + (\tau_1 x + \tau_2 x^2) \cdot H &= z^2 \cdot V - z^2 \cdot \gamma \cdot H + \delta(y,z) \cdot G + T_1x + T_2 x^2 \\
t(x) \cdot G + (\tau_1 x + \tau_2 x^2+ z^2 \cdot \gamma) \cdot H &= z^2 \cdot V + \delta(y,z) \cdot G + T_1x + T_2 x^2 \\
t(x) \cdot G + \tau_x \cdot H &= z^2 \cdot V + \delta(y,z) \cdot G + T_1x + T_2 x^2
\end{aligned}
$$

## Verifier check #2: vectors $\mathbf{l}$ and $\mathbf{r}$

Next, the verifier checks that the revealed vectors $\mathbf{l}$ and $\mathbf{r}$ are consistent with all previous commitments.

To simplify verification, it rescales the generator vector $\mathbf{H}$ by the inverse powers of $y$:

$$
\mathbf{H'} = \frac{1}{\mathbf{y}^n} \circ \mathbf{H}
$$

This makes the later equations line up nicely.

Then it computes:

$$
P = A + x \cdot S - \langle z\mathbf{1}^n,\mathbf{G} \rangle + \langle z \cdot \mathbf{y}^n + z^2 \cdot \mathbf{2}^n,\mathbf{H'} \rangle
$$

and checks that:

$$
P \stackrel{?}{=} \langle \mathbf{l},\mathbf{G} \rangle + \langle \mathbf{r},\mathbf{H'} \rangle + \mu \cdot H
$$

If this equality holds, it means that the prover’s $l(x)$ and $r(x)$ were built correctly.

### The Inner Product Argument: the final step

But wait… the prover can’t just send full vectors $\mathbf{l}$ and $\mathbf{r}$, that would reveal too much information.

This is exactly where the **Inner Product Argument** comes back in!

To prepare for it, we slightly rearrange the equation above:

$$
\begin{aligned}
P &= A + x \cdot S - \langle z\mathbf{1}^n,\mathbf{G} \rangle + \langle z \cdot \mathbf{y}^n + z^2 \cdot \mathbf{2}^n,\mathbf{H'} \rangle - \mu \cdot H \\
&= \langle \mathbf{l},\mathbf{G} \rangle + \langle \mathbf{r},\mathbf{H'} \rangle
\end{aligned}
$$

and we the inner product result $t$ into it:

$$
P + \hat{t} \cdot Q = \langle \mathbf{l},\mathbf{G} \rangle + \langle \mathbf{r},\mathbf{H'} \rangle + \langle \mathbf{l},\mathbf{r} \rangle \cdot Q
$$

_(where $Q$ is a random elliptic curve point used for the IPA proof)._

This is the input to the IPA: the prover produces a short recursive proof that $\langle \mathbf{l},\mathbf{r} \rangle = \hat{t}$.

If you need a refresher, checkout out [Breaking Down Bulletproofs (part 1)](https://blog.zksecurity.xyz/posts/bulletproofs-intuitions/) and [Unfolding the Bulletproofs Magic (part 2)](https://blog.zksecurity.xyz/posts/bulletproofs-sage/).

## What the final proof looks like

The complete range proof includes:

- $A$ and $S$
- $T_1$ and $T_2$
- $\hat{t}$ and its blinding factor $\tau_x$
- $\mu$ (blinding for $A$ and $S$)
- the IPA proof, which consists of:
  - $L$ and $R$ vectors, from each folding step
  - two scalars representing the final folded vectors $\mathbf{l}$ and $\mathbf{r}$

And that’s it! we’ve just built a complete **range proof** from the ground up! 🧠

Starting from a simple idea: proving that a hidden value lies between 0 and $2^n$, we combined a series of powerful tricks:

- **Bit decomposition** to express the value as a vector of 0s and 1s
- **Random challenges** ($x,y,z$) to tie every equation together and prevent cheating
- **Polynomial commitments** to hide the data while keeping all relationships consistent
- And finally, the **Inner Product Argument** to verify everything efficiently and compactly

All of that comes together so that a verifier can be convinced that: “the prover’s secret value lies in the correct range”, without learning anything about the value itself.

This is the cryptographic foundation that enables **confidential transfers**, **private balances**, and many other privacy-preserving systems, like the one we sketched at the start of this article.

To help you a bit, I implemented the entire process (minus the IPA part) as a Sagemath script: [range_proof.sage](https://github.com/teddav/bulletproofs-ipa/blob/main/range_proof.sage)
