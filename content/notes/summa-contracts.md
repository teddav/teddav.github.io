---
title: "Summa audit: contracts"
subtitle: "Walthrough Summa's solidity contracts"
date: 2024-04-20
authors: teddav
tags: ["audit", "security", "evm", "solidity"]
slug: summa-contracts
---

<aside>
⚠️ All of this is written by me and has not been reviewed. So most of it is just my own interpretation and could be wrong. If you think something is wrong or you have doubts, please comment or message on Discord

</aside>

Let’s start by going into the `/contracts` directory and try to run the tests. I usually run everything in a Docker container where I have Rust installed and some extra things I usually need. Here’s what I was missing for Summa.

```bash
apt-get install -y libclang-dev
cargo install --version 0.2.23 svm-rs && svm install 0.8.20 && solc --version
cd contracts && npm i
npx hardhat test
```

I also like to write my tests with Foundry, so I setup Foundry. [See here if you need to install it.](https://book.getfoundry.sh/getting-started/installation) I think the easiest way is to just call `forge init` and then adapt with git if it messed up some of your files 😄 Here it should only modify the README, so you can

```bash
forge init --no-git --no-commit --force
git checkout -- README.md
```

Let me know if you have issues with something, maybe I can (try to) help.

## VerifyingKey.sol

Let’s start with the [VerifyingKey contract](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/VerifyingKey.sol#L5) because it’s needed for the other contracts.

It’s created in [gen_verifier.rs](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/bin/gen_verifier.rs#L117) and is based on [halo2_solidity_verifier](https://github.com/privacy-scaling-explorations/halo2-solidity-verifier) which is written by PSE.

The key is going to store all the needed data to verify the circuit: root of unity (omega), elliptic curve points, permutations, …

It’s based on the [universal ProvingKey](https://github.com/han0110/halo2-kzg-srs) generated during a “[Powers of Tau ceremony](https://hackmd.io/@4sHVqkbyQnyF63sea5vFOg/S1XuzpJXw)”. This file holds all the values needed for KZG commitments (”Structured/Common Reference String”) and was generated through multiparty computation and is supposed to be secure 😊

The keys are generated in [generate_setup_artifacts](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/circuits/utils.rs#L39). You can take a look at [VerifyingKey struct](https://github.com/privacy-scaling-explorations/halo2/blob/bd385c36253cd1611785dd4ef10199234e2c64bc/halo2_backend/src/plonk.rs#L42), and see how it’s generated in [keygen_vk](https://github.com/privacy-scaling-explorations/halo2/blob/bd385c36253cd1611785dd4ef10199234e2c64bc/halo2_backend/src/plonk/keygen.rs#L43).

Back to our VerifyingKey contract. It is [generated from that VerifyingKey](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/bin/gen_verifier.rs#L58) and adapted for Solidity so that we can have all the values we need to perform verification on the EVM. The [generate_vk](https://github.com/privacy-scaling-explorations/halo2-solidity-verifier/blob/f0626be1dda2aa4b4604aea539a3898018f4f2a3/src/codegen.rs#L157) function is called and fills the [solidity template](https://github.com/privacy-scaling-explorations/halo2-solidity-verifier/blob/f0626be1dda2aa4b4604aea539a3898018f4f2a3/templates/Halo2VerifyingKey.sol#L5) with the values from our circuit.

Now we take a quick look at the actual contract to see how it’s organised. It’s really easy to read, all the values are organised nicely, and a comment indicates what the value reprensents. The [`mstore` instruction](https://www.evm.codes/#52?fork=cancun) is used to store all values in memory and then the memory, and then we return all that memory as the code of the contract.

That way we know exactly what our contract code will be and we will easily be able to fetch the values.

Ok I think that’s all we need, it’s probably already too much details 😁

## Summa.sol

I’m not going to spend too much time on Summa.sol so I can focus more on the Verifier contracts. You can find a bit of documentation on [Summa’s Gitbook](https://summa.gitbook.io/summa/smart-contract/summa.sol).

There is a full flow in `/backend/examples/summa_solvency_flow.rs` where we can see how the contracts are being used, but we’ll come back to it later.

### validateVKPermutationsLength

The function is called in the constructor and checks that VerifyingKey.sol is correctly formatted. To verify, we check the number of permutations in the circuit.

Permutations are part of PLONK and are what make the protocol secure.

I might be wrong, but to me it’s equivalent to a copy constraint. The copy contraint is the Halo2 concept, and the permutation is the mathematical implementation behind it

Wherever in your code you have a copy constraint, it’s going to end up being translated to math. I’m not going to go into details because I’m still trying to understand it exactly myself, but here’s the best explanation I saw of it: https://www.youtube.com/watch?v=iY2ue8Kfsb0&list=PLBJMt6zV1c7Gh9Utg-Vng2V6EYVidTFCC&index=12 (thanks David Wong!).

Let’s try to understand why “[The number of permutations is 2 + (balanceByteRange/2) \* numberOfCurrencies](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/Summa.sol#L145)”. We’ll look at the circuit later, so let’s have a high overview of it.

Each balance in the circuit must be less that 2^64, which means it must be represented with less that 8 bytes.

In the range check:

- we break down each balance into 2 bytes chunks
- for each chunk we check that it is in the set [0; 2^16[

So `balanceByteRange` is going to be 8 (it could be fixed, but it’s kept as a variable now in case we want that to evolve) and we will have a total of `(balanceByteRange / 2) * numberOfCurrencies` lookups.

Lookups also result in permutations, because you are making sure that the cell you lookup is equal to one of the cells in the table. So for each lookup we have in the circuit we’ll have a permutation. [Check here in the Halo2 source](https://github.com/privacy-scaling-explorations/halo2/blob/bd385c36253cd1611785dd4ef10199234e2c64bc/halo2_backend/src/plonk/lookup/prover.rs#L64) code for more details.

Every time we “enable equality” in Halo2, it also results in a permutation, so the `+ 2` comes from:

- [the constant column](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/circuits/univariate_grand_sum.rs#L81)
- [the instance column used for 0 checking](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/circuits/univariate_grand_sum.rs#L89) (we’ll dive into that later 🙂)

You can see here how [the column is added to the “permutation” vector](https://github.com/privacy-scaling-explorations/halo2/blob/bd385c36253cd1611785dd4ef10199234e2c64bc/halo2_frontend/src/plonk/circuit/constraint_system.rs#L407).

Again… that was a long intro 😂 Let’s see that function now.

It’s going to look into VerifyingKey.sol and check that the number of permutations inscribed in the key match the expected number of permutations from the circuit.

[Permutations start at 0x2e0](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/VerifyingKey.sol#L31) and each permutation is represented by an elliptic curve point coordinates. Each coordinate takes 32 bytes (0x20 in hex) so each permutation will take 0x40 bytes. That’s why we have

```solidity
uint256 offsetAfterLastPermutation = startOffsetForPermutations + numPermutations * 0x40;
```

Which takes us (supposedly) to the end of the verifying key. The rest should be only zeros. To check that we use a little trick. We subtract 16 bytes (0x10) from the end offset

```solidity
uint256 readOffset = offsetAfterLastPermutation - 0x10;
```

Here’s what it looks like (I can’t draw, so that’s the best I can do 😅)

```
...

0x0500
0x0520 0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb            // last_permutation.x
0x0540 0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa↓bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb↓          // last_permutation.y
                                     readOffset                 offsetAfterLastPermutation
```

Then we [do our thing](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/Summa.sol#L165):

- we use [extcodecopy](https://www.evm.codes/#3c?fork=cancun) to fetch 32 bytes from VerifyingKey at offset `readOffset` and copy them to our memory at offset 0x00 → so we should get back the last 16 bytes of last_permutation.y (currently `permutation_comms[9].y`) and the next 16 bytes should be only 0.
- [we split left and right halves](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/Summa.sol#L171)
- [we check that left contains a value and right is 0](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/Summa.sol#L175-L176)

As you might have noticed, and [as noted by @obatirou](https://github.com/zBlock-2/summa-solvency/issues/10), that check could easily be cheated if the contract is modified and the number of fixed commitments and permutations changes. But [@alexkuzmin also stated that it’s more of a “nice to have” feature](https://discord.com/channels/877252171983360072/1230201530582568962/1230478481977114644) and it’s not that important because the key is public and could be verified by users.

### submitCommitment

We pass as input:

- the proof generated by the circuit
- the “grandSumProof”: [the kzg proof evaluation at 0](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/backend/src/apis/round.rs#L144), which reveals the total liabilities of the exchange
- total balance for each currency
- current timestamp

First we [call the SnarkVerifier](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/Summa.sol#L244) to verify the proof.

The grandSumProof is a concatenation of G1 points (1 for each currency), where each represents the commitment to the “proof polynomial” (or “quotient polynomial”) for each advice column. So the proof’s length should be: `nCurrencies * (32 * 2) bytes`. Because each coordinate (x and y) is 32 bytes. So if we have 2 currencies, the grandSumProof will be 128 bytes.

And we’ll [slice the first 192 bytes](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/Summa.sol#L252) of the snark proof and store it in the contract. What do these bytes correspond to?

#### What’s in the snark proof?

First let’s see how the proof is built in Halo2. This part might be completely wrong 😅 I hope someone more expert than me will review it. I’m just following the code and hoping it makes sense.

We start with the [full_prover](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/backend/examples/summa_solvency_flow.rs#L89)

→ we see that the proof is [extracted from the `transcript`](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/circuits/utils.rs#L113)

→ we can now trace the transcript in [create_proof()](https://github.com/privacy-scaling-explorations/halo2/blob/bd385c36253cd1611785dd4ef10199234e2c64bc/halo2_backend/src/plonk/prover.rs#L512)

I’m not going to go through all of it, but for example you can see here that it’s calling [lookup_commit_permuted](https://github.com/privacy-scaling-explorations/halo2/blob/bd385c36253cd1611785dd4ef10199234e2c64bc/halo2_backend/src/plonk/prover.rs#L549) with our transcript and [writing commitments to it](https://github.com/privacy-scaling-explorations/halo2/blob/bd385c36253cd1611785dd4ef10199234e2c64bc/halo2_backend/src/plonk/lookup/prover.rs#L148-L149). Btw the transcript we’re using is a [Keccak256Transcript and comes from here](https://github.com/privacy-scaling-explorations/halo2-solidity-verifier/blob/f0626be1dda2aa4b4604aea539a3898018f4f2a3/src/transcript.rs#L19).

I don’t know what the entire composition of the proof is but at least the first part is a list of G1 points which represent the polynomial commitment of each advice column. You can [see here](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/backend/src/apis/round.rs#L195) how we get those points out of the proof (thanks @Jin and @qpzm for helping me with this).

So with our circuit, if we have 3 advice columns (1 username and 2 currencies), the first 192 bytes will be the commitments for those columns (64 bytes per commitment because each coordinate is 32 bytes).

That’s why we [remove the first 64 bytes of the proof](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/Summa.sol#L253) because they represent the commit to the username column and we’re not going to need that in our GrandSumVerifier.

We can just finally call `verifyProof` on the GrandSumVerifier to make sure the proof provided by the exchange is valid.

### verifyInclusionProof

This function is meant to be called by the user with its inclusion proof to verify that he was correctly included in the liabilities commitment.

[The inclusionProof is generated](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/backend/src/apis/round.rs#L155) similarly to the grandSumProof, but this time the challenge is not 0 but $\omega^{userindex}$.

We need 2 other parameters:

- challenges: this one took me a bit to understand, so i’ll try to explain.

In the KZG protocol we’re actually using 2 groups: $\mathbb{G}_1$ and $\mathbb{G}_2$ (i find that most articles online don’t really explain that, the only one that really helped me is [KZG polynomial commitments](https://dankradfeist.de/ethereum/2020/06/16/kate-polynomial-commitments.html) by Dankrad Feist).

(if I understood correctly) $\mathbb{G}_2$ is an “[extension field](https://vitalik.eth.limo/general/2017/01/14/exploring_ecp.html)” and will be represented by 2 points so it will need 4 values (or 128 bytes).

Our pairing will look like $e: \mathbb{G}_1 \times \mathbb{G}_2 \rarr \mathbb{G}_T$ .

With `y` being our challenge and `z` the evaluation ($z=f(y)$), our KZG verification pairing will be

$e(C-z*G_1,G_2)=e(\pi,(\alpha-y)*G_2)$, where G1 is the generator for $\mathbb{G}_1$ and G2 is the generator for $\mathbb{G}_2$.

And during the trusted setup we actually need to compute 2 times our CRS (kind of), once with G1 and another with G2. You can see in [ParamsKZG how the trusted setup is created](https://github.com/privacy-scaling-explorations/halo2/blob/bd385c36253cd1611785dd4ef10199234e2c64bc/halo2_backend/src/poly/kzg/commitment.rs#L64).

Actually with G2 we’ll only need $\alpha*G_2$ we don’t need all the powers of $\alpha$ so [it’s pretty fast](https://github.com/privacy-scaling-explorations/halo2/blob/bd385c36253cd1611785dd4ef10199234e2c64bc/halo2_backend/src/poly/kzg/commitment.rs#L121).

I hope it’s a bit clearer now 😄 Back to our `challenges`

It will represent the “**right part of the right pairing**”, so this one: $(\alpha-y)*G_2$

Since we computed $s*G_2$ during the params setup, now we can just [add our challenge](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/backend/src/apis/round.rs#L163) and we have our “G2 challenge”.

Again, remember it’s a point in $\mathbb{G}_2$ so it has 2 pairs of coordinates → [that’s why it needs to be of length 4](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/Summa.sol#L268).

- values: the user balance for each currency.

We [verify our proof](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/Summa.sol#L285) and we’re done!

`combinedProofs` works the same way as in `submitCommitment`.

The rest of the contract is pretty straight forward so I’m not going to detail it. Let’s go to the Verifiers now!

## GrandSumVerifier.sol

This contract is entirely written in Yul so it will be fun to review 🥳 If you’re not comfortable with Yul, it’s not that hard and [I can give you an introduction](https://dev.to/teddav/playing-with-yul-assembly-1i5h).

There is only one function `verifyProof` which takes 3 inputs:

- the verifying key contract (an address)
- the grand sum proof (bytes)
- the total balances (an array of uint256)

Since we’re in assembly, we’re gonna need a lot of memory and calldata manipulation.

### calldata structure

Here’s what our calldata looks like.

Remember that the first 4 bytes of the calldata is the function selector, so you always need to add 4 to the offset you want to reach when calling [calldataload](https://www.evm.codes/#35?fork=cancun)

Check the [solidity doc for details on dynamic types encoding](https://docs.soliditylang.org/en/latest/abi-spec.html#use-of-dynamic-types).

| offset | offset hex | variable          | details                                                                             |
| ------ | ---------- | ----------------- | ----------------------------------------------------------------------------------- |
| 0      | 0x00       | function selector |                                                                                     |
| 4      | 0x04       | vk                | the address of the verifying key                                                    |
| 36     | 0x24       | proof offset      | here we find the offset in the calldata where we’ll find the proof → should be 0x64 |
| 68     | 0x44       | values offset     | offset where the values will be located                                             |
| 100    | 0x64       | proof length      | the length of our proof (PROOF_LEN_CPTR)                                            |
| 132    | 0x84       | proof             | here we find the actual bytes of the proof (PROOF_CPTR)                             |
| A      | 0xA        | values length     | length of the values array                                                          |
| A+32   | 0xA + 0x20 | value 1           |                                                                                     |

After 0x84 we can’t know for sure the offset because it depends on the proof’s length, so we’ll have to compute them dynamically.

I hope it’s more clear now!

### get data from VK

First we [copy some values](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/GrandSumVerifier.sol#L86) from the verifying key into our memory with [extcodecopy](https://www.evm.codes/#3c?fork=cancun)

```solidity
extcodecopy(vk, N_INV_MPTR, 0x40, 0x020)
extcodecopy(vk, G1_X_MPTR, 0x160, 0x140)
```

we copy the [n_inv](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/VerifyingKey.sol#L10) value to [N_INV_MPTR](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/GrandSumVerifier.sol#L12)

and then 10 32-bytes values (0x140) [starting at 0x160](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/VerifyingKey.sol#L19) to [G1_X_MPTR](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/GrandSumVerifier.sol#L15)

I’m not sure why `n_inv` is in the verifying key and what it’s used for usually, but here it’s going to be useful for us to compute the total liabilities of the exchange. `n` represents the number of rows in our table, it’s computed as $n=2^k$, and `k` needs to be at least 17 to accommodate for the fixed column which contains $2^{16}$ rows.

btw we can easily check [n_inv in VerifyingKey.sol](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/VerifyingKey.sol#L10) with python

```python
k = 17
p = 21888242871839275222246405745257275088548364400416034343698204186575808495617
n_inv = pow(2**k, -1, p) # 0x30643640b9f82f90e83b698e5ea6179c7c05542e859533b48b9953a2f5360801
```

Then we get the proof length from the calldata and [make sure it’s divisible by 0x80](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/GrandSumVerifier.sol#L103).

This also ensures that the calldata is correctly aligned and then when we get the `values` length on the next line we can just add the proof_length to the PROOF_LEN_CPTR. Otherwise we would get some random value, or we would need to pad to the next bytes32.

#### potential critical issue

There is not issue currently but let me walk you through how a critical issue could appear if we’re not careful. Maybe it will help you in finding other issues 😀

If the proof isn’t a multiple of 32 bytes, it could lead to a serious issue where nothing is actually verified in the contract.

Let me show you. Here’s the code we have

```solidity
let evaluation_values_length_pos := add(add(PROOF_LEN_CPTR, proof_length), 0x20)
let evaluation_values_length := calldataload(evaluation_values_length_pos)
for { let i := 0 } lt(i, evaluation_values_length) { i := add(i, 1) } {
  ...
}
```

Let’s say proof_length is 10, then `evaluation_values_length_pos` would end up “in the middle” of 2 values (between the proof bytes and the length of `values` ). And all of that is filled with 0. So `evaluation_values_length` will be 0 and then the for loop will not run 😱

But thanks to @Jin, we’re safe! There are 2 checks protecting us

```solidity
success := and(success, eq(0, mod(proof_length, 0x80)))
success := and(success, eq(4, div(proof_length, mul(evaluation_values_length, 0x20))))
```

btw notice that `div` would not fail with a division by 0, [it just returns 0](https://www.evm.codes/#04?fork=cancun).

Why does the proof needs to be 4 times the number of values?

Because for each value we get 2 G1 points:

- the commitment to our polynomial: $C$
- the commitment to the proof polynomial: $\pi$

### ec points verification

Finally we reach the for loop where we are going to verify our kzg commitments thanks to the pairing precompile on Ethereum.

Steps:

- We [get the balance from the calldata](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/GrandSumVerifier.sol#L123) and compute `minus_z` from it.

`z` represents the result to our challenge, so $z=f(0)=a_0$

and remember that the sum of all user index verification is equal so $n*a_0$, so $z=\frac{total}{n}={total}*n_{inv}$. You can see the [equivalent rust code here](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/backend/src/apis/round.rs#L216). And since we’re going to need `-z` in the left size of the pairing $e(C-z*G_1,G_2)$ , we need to [subtract it from the order of the curve](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/GrandSumVerifier.sol#L128).

- we call `ec_mul_tmp` which is going to call the [ecMul precompile](https://www.evm.codes/precompiled#0x07?fork=cancun) it takes as input (x,y,scalar) and returns the new point. The new point will be [returned at 0x80](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/GrandSumVerifier.sol#L56). So we end up with $(-z)*g$
- then we get the next point in the snark proof.

Notice that we use [`div(proof_length, 2)`](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/GrandSumVerifier.sol#L138) which means we’re getting the 2nd part of the proof this time which is [the snark proof and not the grand sum proof](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/Summa.sol#L253). Remember that it represents the commitment to the polynomial, so the `$C$` part of our pairing. We check that it’s on the curve. For that we call [check_ec_point](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/GrandSumVerifier.sol#L139) where we are going to check $y^2 \pmod q = x^3+3 \pmod q$

- [add that point](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/GrandSumVerifier.sol#L143) to the previously computed g_to_minus_z point, we end up with c_g_to_minus_z (got those names from the comments) which is $C-z*G_1$
- we store that point’s x to [LHS_X_MPTR and y to LHS_Y_MPTR](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/GrandSumVerifier.sol#L146) (the left hand side of the pairing)
- then we [get the KZG proof](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/GrandSumVerifier.sol#L150) which is the commitment to the quotient polynomial, so the `$\pi$` part of the pairing. Check that it’s [on the curve](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/GrandSumVerifier.sol#L151). This point [comes from here](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/backend/src/apis/round.rs#L244).
- and finally we compute our pairing

we use the [ecPairing precompile](https://www.evm.codes/precompiled#0x08?fork=cancun) for that (you can check how the pairing function is implemented [in revm](https://github.com/bluealloy/revm/blob/1ca3d39f6a9e9778f8eb0fcb74fe529345a531b4/crates/precompile/src/bn128.rs#L161) or [in the halo2_curves lib](https://github.com/privacy-scaling-explorations/halo2curves/blob/8af4f1ebab640405c799e65d9873847a4acf04f8/src/bn256/engine.rs#L625)). It takes as input an array of 1 $\mathbb{G}_1$ point and 1 $\mathbb{G}_2$ point, it’s going to compute the pairing for each pair of point. Since G1 is 64 bytes, and G2 is 128 bytes, we must always pass multiples of 192 bytes (6 32-bytes values).
It’s going to compute each pairing and multiply them to each other and the result must be `1` if it’s a success. You can check the [EIP-197 specification](https://eips.ethereum.org/EIPS/eip-197).

### success

You probably noticed the use of `success` throughout the contract. It’s a good way to verify that everything is going alright.

All operations return 0 if they fail, 1 if they succeed. Same for [`staticcall` (used for precompiles)](https://www.evm.codes/#fa?fork=cancun).

So the idea is to use a bitwise `AND` to always make sure `success` variable is `1`

## InclusionVerifier.sol

The InclusionVerifier works exactly same way: we fetch values from the VerifyingKey, and we compute our pairing. Except that this time we are verifying a proof for the user’s balance inclusion in the polynomial, so the challenge is going to be $y=\omega^{i}$ and the result will be the balance: $z=balance$.

One interesting thing to note is that, unlike in the GrandSumVerifier, all the points here are not fetched from the VK. Only [6 values are fetched](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/InclusionVerifier.sol#L82) and the rest is passed to the function [through the `challenges` array](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/contracts/src/InclusionVerifier.sol#L106). We [already talked about `challenges`](https://www.notion.so/Summa-code-walkthrough-part-1-Contracts-4d997d9e7ccd440ba01a91a4efc3d359?pvs=21), so you should understand why by now.
