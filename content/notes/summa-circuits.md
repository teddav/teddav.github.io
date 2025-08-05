---
title: "Summa audit: circuits"
subtitle: "Walthrough Summa's Halo2 circuits"
date: 2024-04-22
authors: teddav
tags: ["audit", "security", "halo2", "zk"]
slug: summa-circuits
---

I hope [part 1 on the contracts](./summa-contracts) was useful! Today we’ll look at the main piece: the circuits.

There is only 1 circuit: [UnivariateGrandSum circuit](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/circuits/univariate_grand_sum.rs#L11) so it should be fast 😊 It takes a “Config” as input, we’ll look at that first

## UnivariateGrandSumConfig

`CONFIG` passed to the circuit must implement the [CircuitConfig trait](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/circuits/univariate_grand_sum.rs#L14).

### CircuitConfig

We can see from the `get_username()` and `get_balances()` functions that we’re going to need (at least) 1 advice column for the usernames, and `N_CURRENCIES` advice columns for balances (1 per currency).

```rust
fn get_username(&self) -> Column<Advice>;
fn get_balances(&self) -> [Column<Advice>; N_CURRENCIES];
```

The `assign_entries` function takes as input an array of [`Entry`](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/entry.rs#L8)

```rust
pub struct Entry<const N_CURRENCIES: usize> {
    username_as_big_uint: BigUint,
    balances: [BigUint; N_CURRENCIES],
    username: String,
}
```

It loops through the entries and assigns the values to the columns that were previously created (we’ll see that in the circuit).

First [the username](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/circuits/univariate_grand_sum.rs#L216) and then [the balances](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/circuits/univariate_grand_sum.rs#L226).

It creates a [vector of cells](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/circuits/univariate_grand_sum.rs#L235) where all the balances are, and returns it. It’ll be useful for the RangeCheck, we’ll see that later.

### UnivariateGrandSumConfig

```rust
pub struct UnivariateGrandSumConfig<const N_CURRENCIES: usize, const N_USERS: usize>
where
    [(); N_CURRENCIES + 1]:,
{
    username: Column<Advice>,
    balances: [Column<Advice>; N_CURRENCIES],
    range_check_configs: [RangeCheckU64Config; N_CURRENCIES],
    range_u16: Column<Fixed>,
    instance: Column<Instance>,
}
```

#### configure()

That’s where we create our columns and setup the base for our circuit.

As expected, we have a `username` column, and `N_CURRENCIES` `balances` columns.

We notice that the [balances columns are “unblinded”](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/circuits/univariate_grand_sum.rs#L77). Normally, Halo2 “blinds” each advice column. That means it adds random values after the values you inserted in the column until $2^K$(the total number of rows).

But remember that we proved that the total sum of balances is encoded in the constant term of the polynomial. So if we add values, that will mess up the sum and we wouldn’t be able to retrieve the total balance. With an “unblinded” column, the rest of the rows are just filled with `0`.

Then create a fixed column (for the range check) and we `enable_constant` on it, which means it will allow us to perform lookups on it.

We also create an [`instance` column](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/circuits/univariate_grand_sum.rs#L88). This will only be used for checking the final 0. @Jin explained [in this issue](https://github.com/summa-dev/summa-solvency/issues/274#issuecomment-1996901271) why we need that advice column instead of just hardcoding `0` → if we hardcode 0, it will be added to the fixed column everytime we do a check and will fill the entire table with useless `0` values. Instead we just assign it once in an instance column and just create a copy constraint whenever we need.

Finally we setup our RangeCheck chip which we’ll detail soon. And obviously we call `meta.enable_equality` on it.

#### synthesize()

First we [construct our RangeCheck chips](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/circuits/univariate_grand_sum.rs#L127) from their config.

Then we [fill our fixed column](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/circuits/univariate_grand_sum.rs#L139) with values from 0 to $2^{16}-1$. This is the range of values we’re going to need in our RangeCheck.

Finally we loop through the previously `assigned_balances` cells and perform a range check on each cell, indeed verifying that our values are contained within the defined range.

You can see on the last line how we [check for](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/circuits/univariate_grand_sum.rs#L169) [`0`](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/circuits/univariate_grand_sum.rs#L165) thanks to the `instance` column.

### NoRangeCheckConfig

There is a much simpler config that can be passed to the circuit which doesn’t perform a range check. It’s obviously useless in production but it was added for easier testing.

## RangeCheckChip

The range check is pretty similar to the v1. The idea is to [decompose a value into chunks of 2 bytes](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/chips/range/range_check.rs#L140) and check each chunk against the fixed column. If each chunk is indeed in the fixed column it’s a good start but we’re not done: we also need to make sure that each value is equal to the previous one divided by $2^{16}$, so $zs[i+1]=\frac{zs[i]}{2^{16}}$ or put differently: $zs[i]-zs[i+1]*2^{16}$ is in the lookup table. That’s what is done [in the configure() function](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/chips/range/range_check.rs#L93).

The table is constructed in the `assign()` function: we just [divide the current value by](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/chips/range/range_check.rs#L153) [$2^{16}$](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/chips/range/range_check.rs#L150) and assign it to the next column in the same row. And then the constraints are going to be applied. Actually since we are in finite fields, [we multiply by the inverse](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/chips/range/range_check.rs#L147).

### lookup

#### in MockProver

An interesting part is how the [`meta.lookup_any()` call](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/chips/range/range_check.rs#L100) works. At first, to me, it seemed to [query a specific row in the fixed column](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/chips/range/range_check.rs#L100), so I didn’t understand how the lookup was performed. So I looked into Halo2 source code.

I started from the end and create a small circuit with a lookup that would fail, and started from the error

```
Err([Lookup range check constraint(index: 0) is not satisfied in Region 1 ('main region') at offset 0, Lookup range check constraint(index: 0) is not satisfied in Region 1 ('main region') at offset 2])
```

Which lead me to [VerifyFailure](https://github.com/privacy-scaling-explorations/halo2/blob/9eedeb5d6eb9a119d34307697e670b0bb043a5a5/halo2_frontend/src/dev/failure.rs#L285-L295), then I looked up how the [errors are returned](https://github.com/privacy-scaling-explorations/halo2/blob/9eedeb5d6eb9a119d34307697e670b0bb043a5a5/halo2_frontend/src/dev.rs#L1145-L1146) and ultimately found where [lookups are verified](https://github.com/privacy-scaling-explorations/halo2/blob/9eedeb5d6eb9a119d34307697e670b0bb043a5a5/halo2_frontend/src/dev.rs#L961).

It iterates through the `lookups` vector which was [pushed into everytime lookup() or lookup_any() is called](https://github.com/privacy-scaling-explorations/halo2/blob/81c449a136b898e6edf507cac78bc39be6aae7ed/halo2_frontend/src/plonk/circuit/constraint_system.rs#L413).

**load() function**

The [`load()` function](https://github.com/privacy-scaling-explorations/halo2/blob/81c449a136b898e6edf507cac78bc39be6aae7ed/halo2_frontend/src/dev.rs#L927-L928) will (you guessed it!) load a value from a column at the specified row. It takes as input an `Expression` and a row. The Expression will contain the targeted column and the rotation, to which the `row` will be added to get the value.

One thing I thought was weird at the beginning is how the row is fetched: `[(row as i32 + n + query.rotation.0) as usize % n as usize]`. Why have `+ n`? I think it’s because the value could end up being negative is the Rotation is negative (because [Rust’s `%` operator](https://doc.rust-lang.org/std/ops/trait.Rem.html) can return a negative number), and we want the result to be positive, so we add `+ n`

Let’s now see how each lookup is verified step by step:

- first there is a “[fill_row](https://github.com/privacy-scaling-explorations/halo2/blob/81c449a136b898e6edf507cac78bc39be6aae7ed/halo2_frontend/src/dev.rs#L975)” used for optimization. It loads the last “usable” row of the lookup table
- then we [load the entire lookup table](https://github.com/privacy-scaling-explorations/halo2/blob/81c449a136b898e6edf507cac78bc39be6aae7ed/halo2_frontend/src/dev.rs#L991), and cache it for other lookups
- then we [load the values from the advice column](https://github.com/privacy-scaling-explorations/halo2/blob/81c449a136b898e6edf507cac78bc39be6aae7ed/halo2_frontend/src/dev.rs#L1013) that are going to be checked
- finally we check that the [input value is present in the lookup table](https://github.com/privacy-scaling-explorations/halo2/blob/81c449a136b898e6edf507cac78bc39be6aae7ed/halo2_frontend/src/dev.rs#L1036) with a binary search

## GrandSum circuit

Once we’ve covered the RangeCheck and the Config, [the circuit](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/src/circuits/univariate_grand_sum.rs#L245) is actually really simple and can be summarized to “call the `synthesize()` function of the config”. So the major part will be in the config.

### Tests

Let’s look at some tests to see if we find anything interesting.

The interesting part (to me) is in `examples/hunked_univariate_grand_sum.rs`. Where we take advantage of the homomorphism property of KZG to split our proof in 2.

We have a total of 64 users and we’re going to [split our user base in 2](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/examples/chunked_univariate_grand_sum.rs#L30). We use the [NoRangeCheck config](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/examples/chunked_univariate_grand_sum.rs#L74) to go faster in our testing, you can see how easy it is to configure the circuit. Then we create [2 separate circuits with each user chunk](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/examples/chunked_univariate_grand_sum.rs#L81) and compute [our proofs](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/examples/chunked_univariate_grand_sum.rs#L88) for each chunk.

We’re going to create our KZG proof for the column `1` ([BALANCES_INDEX == 1](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/examples/chunked_univariate_grand_sum.rs#L67)) which corresponds to the balances for the first currency (remember that column 0 is for usernames).

First, to show the homomorphism of KZG, we’ll compute the KZG commitment of our column in 2 ways:

- we [loop through the zk proof](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/examples/chunked_univariate_grand_sum.rs#L100) of our circuit. Remember that the proof is composed of all the KZG commitments for each advice column. We end up with
  - `kzg_commitment_1` → commitment of the polynomial of column 1 for the first chunk
  - `kzg_commitment_2` → commitment of the polynomial of column 1 for the second chunk
    we can just [add both commitments](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/examples/chunked_univariate_grand_sum.rs#L121) and we get the commitment we would have had if we computed it over the entire user base
- to verify that, let’s compute it another way: here we get the [polynomial interpolated](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/examples/chunked_univariate_grand_sum.rs#L92) for column 1 `f_poly_1` for chunk 1 and `f_poly_1` for chunk 2. We [add those polynomials together](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/examples/chunked_univariate_grand_sum.rs#L127) by summing the coefficients and end up with the polynomial that would have been interpolated from the summed balances. Then we can [commit to that polynomial](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/examples/chunked_univariate_grand_sum.rs#L137). If you [look into `commit()`](https://github.com/privacy-scaling-explorations/halo2/blob/9eedeb5d6eb9a119d34307697e670b0bb043a5a5/halo2_backend/src/poly/kzg/commitment.rs#L354) you can see that (as expected), it’s doing: $P(s)*G$

Finally we can show that [both commitments are equal](https://github.com/summa-dev/summa-solvency/blob/fec83a747ead213261aecfaf4a01b43fff9731ee/prover/examples/chunked_univariate_grand_sum.rs#L138). Easy! 😉

The rest is simple, we compute our KZG proof with our challenge being `0` and we verify the proof.
