---
title: "Open Source: Contributing to Foundry"
subtitle: "How I contributed to Ethereum's development toolkit"
tags: [open source, evm, solidity, rust]
authors: teddav
date: 2023-03-02
---

Contributing to open source projects can be a bit scary sometimes 👻 But it’s usually not that hard!

I just made my first (really small) contribution to [Foundry](https://github.com/foundry-rs/foundry) (a toolkit to help develop smart contracts for Ethereum) today, and I really enjoyed it! 😍

While tackling the issue I took some notes, so if you’re thinking about contributing, I’m going to walk you through what I did and hopefully you’ll see that it’s pretty easy. Obviously the bug I fixed was really simple but it helped me get into the code and I’m ready to take on some more challenging ones 💪

It all started with this issue: https://github.com/foundry-rs/foundry/issues/4434

There was a bug in my forge script… I didn’t have time to look into it that day, so I left the issue opened for a few days, and today I finally took the time to do it. It took me about 3 hours from the moment I cloned the repo to the moment I opened the PR.

## Setup

### Foundry repo

First thing I did after cloning the repo was heading to the [dev doc](https://github.com/foundry-rs/foundry/tree/master/docs/dev) for help.

Since my PR was specifically related to `forge script` I thought I would only install `forge` locally with `cargo build -p ./forge --profile local`.

And I ran the tests: `cargo test -p ./forge --profile local`

I didn’t dig into it, but it seems like adding the `local` profile flag makes the build take longer, so in the end I just went with `cargo build` and built the entire project.

I now have the `forge` binary in `foundry/target/debug/forge`

And then I ran this command so that it would rebuild automatically when i make a change

```rust
cargo watch -x "build"
```

On every change, the build takes about 15-20 seconds on my Macbook Pro M1

### Reproduce the error

I then created another directory where I setup my project for testing with the problematic script and I linked the newly built `forge` inside this repo with

```bash
$ ln -s ../foundry/target/debug/forge ./myforge
```

The repo looks like this

```
|-- cache
|-- foundry.toml
|-- lib
|-- myforge -> ../foundry/target/debug/forge
|-- myscript.s.sol
`-- out
```

Here is `myscript.s.sol`

```rust
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// import "forge-std/Script.sol";
import { console, Script } from "forge-std/Script.sol";

contract MyScript is Script {
    function run() public {
        uint256 pk = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        vm.startBroadcast(pk);
        console.log("broadcaster    ", vm.addr(pk));
        console.log("script         ", address(this));
        console.log("origin         ", tx.origin);

        ContractA contractA = new ContractA();
        ContractB contractB = new ContractB();
        ContractC contractC1 = new ContractC();

        console.log("contractA      ", address(contractA));
        console.log("contractB      ", address(contractB));
        console.log("contractC1     ", address(contractC1));
        console.log("");

        contractA.test(address(contractB));
        contractB.method();
        contractC1.method();

        console.log("\n origin (end)   ", tx.origin);
        vm.stopBroadcast();
    }
}

contract ContractA {
    function test(address _contractB) public {
        ContractB contractB = ContractB(_contractB);
        ContractC contractC2 = new ContractC();

        console.log("A (start)  ", tx.origin);
        console.log("A (start) sender       ", msg.sender);
        contractB.method();
        console.log("A (after1) ", tx.origin);
        console.log("A (after1) sender      ", msg.sender);
        contractC2.method();
        console.log("A (after2) ", tx.origin);
        console.log("A (after2) sender      ", msg.sender);
    }
}

contract ContractB {
    function method() public {
        console.log("B          ", tx.origin);
        console.log("B sender               ", msg.sender);
    }
}

contract ContractC {
    function method() public {
        console.log("C          ", tx.origin);
        console.log("C sender               ", msg.sender);
    }
}
```

I can then run this command to reproduce my issue

```bash
$ ./myforge script ./myscript.s.sol --tc MyScript
```

## The Foundry code

After looking at the code, trying to understand the architecture of the repo, and reading the [dev doc](https://github.com/foundry-rs/foundry/tree/master/docs/dev) I understood that I need to look into `evm/src/executor/inspector/cheatcodes`. So I started by adding some logs to understand what was going on.

I added logs in `call`, `call_end`, `create` and `create_end`

These are some examples of what it looked like

In `evm/src/executor/inspector/cheatcodes/mod.rs` [on line 450](https://github.com/foundry-rs/foundry/blob/master/evm/src/executor/inspector/cheatcodes/mod.rs#L450)

```rust
fn call(
        &mut self,
        data: &mut EVMData<'_, DB>,
        call: &mut CallInputs,
        is_static: bool,
    ) -> (Return, Gas, Bytes) {
			...

			if let Some(broadcast) = &self.broadcast {
			  println!("call() \n{broadcast:#?}");
			  println!("contract: {}\ncontext: {:#?}", call.contract, call.context);
			  println!("env before: {:#?}", data.env.tx);
			  println!("\n");

				...
```

[And on line 730](https://github.com/foundry-rs/foundry/blob/master/evm/src/executor/inspector/cheatcodes/mod.rs#L730)

```rust
fn create_end(
        &mut self,
        data: &mut EVMData<'_, DB>,
        call: &CreateInputs,
        status: Return,
        address: Option<Address>,
        remaining_gas: Gas,
        retdata: Bytes,
    ) -> (Return, Option<Address>, Gas, Bytes) {
			...

        // Clean up broadcasts
        if let Some(broadcast) = &self.broadcast {
            println!("create_end() \n{broadcast:#?}");
            println!("address: {address:?}");
            println!("caller {:#?}", call.caller);
            println!("env before: {:#?}", data.env.tx);
            println!("depth: {}", data.journaled_state.depth());

            data.env.tx.caller = broadcast.original_origin;

            println!("/create_end()\n");
```

I quickly noticed that there was an issue with `call_end` and `create_end` which are the functions being called after a contract call and after a contract creation: it would reset the `data.env.tx.caller` which is the `tx.origin` in the Solidity context.

So the fix was pretty easy. Change

```rust
data.env.tx.caller = broadcast.original_origin;
```

to

```rust
if data.journaled_state.depth() == broadcast.depth {
	data.env.tx.caller = broadcast.original_origin;
}
```

This makes sure that `tx.origin` will be reset only when the last call is popped from the call stack and the execution returns to the `run()` function of the `Script`.

And… that’s it! We’re done 🎉

## Integration tests

Now let’s add some tests.

After testing on my local setup by running `forge script` manually, it was time to add a proper integration test.

Tests are located in `cli/tests/it/script.rs`

To add a test, we use the `forgetest_async!` macro. I cleaned the `Script` that I was using and added some `require` statements and copied it inside my integration test.

I just need 1 line to make sure my script ran correctly:

```rust
assert!(cmd.stdout_lossy().contains("Script ran successfully."));
```

`stdout_lossy()` uses `output()` which, [as the comment above says](https://github.com/foundry-rs/foundry/blob/master/cli/test-utils/src/util.rs#L596): “If the command failed, then this panics.”

So the script will fail if the `Script` fails, or if the output doesn’t contain “Script ran successfully.”

Run the test with

```bash
$ cargo test assert_tx_origin_is_not_overritten -- --show-output
```

or, if I want it to rebuild automatically everytime I make a change

```bash
$ cargo watch -x "test assert_tx_origin_is_not_overritten -- --show-output"
```

`assert_tx_origin_is_not_overritten` is the name I chose for the test I wrote. You can see it on the PR.

## Let’s merge

Before pushing, make sure your code is formatted correctly and doesn’t have warnings.

```bash
$ cargo +nightly fmt -- --check
$ cargo +nightly clippy --all --all-features -- -D warnings
```

You can see the commands in the [Contributing guidelines](https://github.com/foundry-rs/foundry/blob/master/CONTRIBUTING.md#resolving-an-issue)

We now need to open the PR and wait for someone to review 😊

Here it is: https://github.com/foundry-rs/foundry/pull/4469

Next time you have an issue with an open source project, maybe try to contribute 😁

If you have any question, or if I made a mistake somewhere: message me [on Twitter 0xteddav](https://twitter.com/0xteddav)
