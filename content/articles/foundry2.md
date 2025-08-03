---
title: "Open Source: adding a cheatcode to Foundry"
subtitle: "Contributing to Ethereum's development toolkit"
tags: [open source, evm, solidity, rust]
authors: teddav
date: 2023-04-04
---

We scratched the surface of [Foundry’s code](https://github.com/foundry-rs/foundry/) in [part 1](https://dev.to/teddav/foundry-open-source-contribution-1k2d). Let’s go a bit deeper and try to create a new cheatcode this time.

## What are we going to do?

We’ll try to write a `getMemory(uint256 start, uint256 end)` cheatcode. Which sounds pretty straightforward: get the current memory from index `start` to `end`. We’ll also add “bonus” cheatcodes that automatically format that memory, to easily be logged.

You can find the PR (still in review at the time of publishing this article) [here](https://github.com/foundry-rs/foundry/pull/4664) and [the commit I’m going to follow](https://github.com/teddav/foundry/commit/7277e7665a3b21d9df46eea0485a66508c4a5022) (in case the code changes before it’s merged).

## Why this cheatcode?

Memory is hard to get in Solidity. You can only get it in chunks of 32 bytes (with `mload`), and sometimes it’s useful to have a better overview of the memory. That’s why.

**Linter**

Before we continue, a little tip…

Since my [rust-analyzer](https://rust-analyzer.github.io/) config wasn’t using the `nightly` flag, the code kept getting changed when I was saving files. I’m using VSCode and didn’t want to change my config for all my projects, so I added a `.vscode` folder and a `settings.json` with

```json
{
  "rust-analyzer.rustfmt.extraArgs": ["+nightly"]
}
```

## Add a cheatcode

First I modified the minimum to make sure I had the correct process. I followed the steps in [Foundry’s doc](https://github.com/foundry-rs/foundry/blob/master/docs/dev/cheatcodes.md):

- add the function signature to the `abigen!` macro so a new `HEVMCalls` variant is generated
- implement the cheat code handler
- add a Solidity test for the cheatcode under `testdata/cheats`
- add the function signature to forge-std Vm interface

So I started by adding the function signature to `evm/src/executor/abi/mod.rs`

```rust
// Bindings for cheatcodes
ethers::contract::abigen!(
    HEVM,
    r#"[
			...
			getMemory(uint256,uint256)
		]"#,
);
pub use hevm::{HEVMCalls, HEVM_ABI};
```

Then in `evm/src/executor/inspector/cheatcodes/util.rs` in `apply` function

```rust
pub fn apply<DB: Database>(
    state: &mut Cheatcodes,
    data: &mut EVMData<'_, DB>,
    call: &HEVMCalls,
) -> Option<Result<Bytes, Bytes>> {
    Some(match call {
			...
			HEVMCalls::GetMemory(inner) => get_memory(inner.0, inner.1),
			_ => return None,
    })
}
```

and our `get_memory` function

```rust
pub fn get_memory(start: U256, end: U256) -> Result<Bytes, Bytes> {
    println!("get_memory: {start} {end}");
    Ok(Bytes::new())
}
```

Just like in [part 1](https://dev.to/teddav/foundry-open-source-contribution-1k2d), I set up a project with a forge Test to test my changes in real time. In that project, as with any project using Foundry, you have a `lib` directory with `forge-std`. You’ll need to add your cheatcode there, so that it’s recognized by your test

In `my-project/lib/forge-std/src/Vm.sol` we add the function signature

```solidity
function getMemory(uint256 start, uint256 end) external;
```

And write our first test

```solidity
pragma solidity 0.8.18;
import "forge-std/Test.sol";

contract MemoryTest is Test {
    function testBasicLog() public {
        vm.getMemory(2, 5);
    }
}
```

The test passes, no errors, and we get our log printed to the console:

“_get_memory: 2, 5”_

We are good to continue! 💪

## Let’s write our cheatcode

### Access the memory

Cheatcodes are called in the `apply_cheatcode` function in `evm/src/executor/inspector/cheatcodes/mod.rs` which itself is called in the `call` function in the same file. Those 2 functions are implementations of the `Cheatcodes` struct.

Unfortunately we cannot access the memory directly from the cheatcode. The parameters of the `call` function are:

```rust
fn call(
  &mut self,
  data: &mut EVMData<'_, DB>,
  call: &mut CallInputs,
  is_static: bool,
) -> (Return, Gas, Bytes) {}
```

But the memory is only accessible from the `Interpreter`, which is a parameter of `step`:

```rust
fn step(
  &mut self,
  interpreter: &mut Interpreter,
  data: &mut EVMData<'_, DB>,
  _: bool,
) -> Return {}
```

So we’ll have to store the memory somewhere for it to be accessible in our cheatcode. I decided to add a `memory` field on the `Cheatcodes` struct

```rust
pub struct Cheatcodes {
	...
	/// Current's call memory
	pub memory: Vec<u8>,
}
```

And copy the memory to it in `fn step()`

```rust
fn step(
  &mut self,
  interpreter: &mut Interpreter,
  data: &mut EVMData<'_, DB>,
  _: bool,
) -> Return {
  self.memory = interpreter.memory.data().clone();

	...
}
```

We can now access the memory from our `fn get_memory()` function!

### Return our memory slice

Now that we have access to the memory the rest is easy. We get the requested part from it and return it. The parameters of our `getMemory(uint256,uint256)` function are passed as `U256`. We just convert them to `usize`, get our memory slice and return it as `Bytes`

```rust
HEVMCalls::GetMemory(inner) => {
  let start = (inner.0 as U256).as_usize();
  let end = (inner.1 as U256).as_usize();
  let mem = state.memory[start..=end].to_vec();
  Ok(ethers::abi::encode(&[Token::Bytes(mem)]).into())
}
```

To help us with the `Bytes` encoding, `ethers-rs` has an `encode()` function where you pass a Vector of `Token` and it formats the data properly.

The actual code I wrote was a bit longer because I added some error handling and some extra cheatcodes, but if we just wanted to implement the `getMemory` cheatcode, we would be done.

I’ll give some more details at the end of the article. For now let’s finish our “simple” cheatcode with unit tests.

### Unit tests

In `testdata/cheats` we first add the function signature for our cheatcode to `Cheats.sol`

Then we can create a new test file `GetMemory.t.sol`

**How are tests run?**

I was trying to understand how tests are run when executing `cargo test`.

From what I understood, what matters to us is in `forge/tests/it/cheats.rs`. You can see the test that is going to test all cheatcodes: `test_cheats_local`.

Something a bit annoying when running tests: it logs info for all the tests that should be run, not only the only running. So you have to search through the logs to find your test. If anyone knows how to avoid that, please message me 🙏

```bash
$ cargo test test_cheats_local -- --show-output
or
$ cargo watch -x "test test_cheats_local -- --show-output"
```

**Our test**

This is what `GetMemory.t.sol` looks like

```solidity
// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "ds-test/test.sol";
import "./Cheats.sol";

contract GetMemoryTest is DSTest {
    Cheats constant vm = Cheats(HEVM_ADDRESS);

    function testGetMemory() public {
        assertEq(vm.getMemory(0, 31), abi.encodePacked(bytes32(0)));

        assembly {
            mstore(0, 0x4141414141414141414141414141414141414141414141414141414141414141)
            mstore(0x20, 0xbabababababababababababababababababababababababababababababababa)
        }
        bytes memory mem1 = vm.getMemory(0, 12);
        bytes memory mem2 = vm.getMemory(0x20, 0x3f);

        assertEq(mem1.length, 13);
        assertEq(mem2.length, 32);

        assertEq(mem1, hex"41414141414141414141414141");
        assertEq(mem2, hex"babababababababababababababababababababababababababababababababa");

        bytes memory mem3 = vm.getMemory(0x60, 0x7f);
        assertEq(mem3.length, 32);
        assertEq(mem3, abi.encodePacked(bytes32(0)));
    }
}
```

Done! 🎉 If you wanted to implement your own cheatcode you would be done since everything is working as expected. But before I sent it to review I decided to add a little extra work:

- error handling
- “bonus” cheatcodes

## Overtime

The goal of the cheatcode is to make it easy to inspect the memory. Receiving the entire memory as bytes is already helpful, but why not format it as a nice string with indexes? So I added a `getMemoryFormattedAsString` and `getMemoryFormatted` cheatcodes. The first one returns a long string ready to be printed with `console.log`, and the second one returns a `FormattedMemory` struct, so you have a bit more control.

```solidity
struct FormattedMemory {
    string header;
    string[] words;
}
```

It might be useless, I don’t know… we’ll see if people end up using those or not.

### Error handling

I had a hard time understanding how to return errors properly from the cheatcode. I struggled a bit with the `Bytes` formatting and the fact that `apply()` in utils is supposed to return `Option<Result<Bytes, Bytes>>`.

When running my tests I would get

`Cheatcode was unhandled. This is a bug.`

or `The application panicked (crashed). This is a bug. Consider reporting it at https://github.com/foundry-rs/foundry`

To make it easier, I created a `check_format_memory_inputs`. Annoyingly, I couldn’t figure out how to have a nice error handling using `?` so I add to use a `match` statement to propagate the error correctly.

```rust
HEVMCalls::GetMemory(inner) => {
  match check_format_memory_inputs(inner.0, inner.1, state.memory.len() as u32) {
      Ok((start, end)) => {
          let mem = state.memory[start as usize..=end as usize].to_vec();
          Ok(ethers::abi::encode(&[Token::Bytes(mem)]).into())
      }
      Err(err) => Err(format!("Error getMemory: {}", err).encode().into()),
  }
}
```

```rust
fn check_format_memory_inputs(
    start: U256,
    end: U256,
    memory_length: u32,
) -> Result<(u32, u32), String> {
    let start = u32::try_from(start).map_err(|err| format!("start parameter: {}", err))?;
    let end = u32::try_from(end).map_err(|err| format!("end parameter: {}", err))?;
    if start > end {
        return Err(format!("invalid parameters: start ({}) must be <= end ({})", start, end))
    }
    if end > memory_length - 1 {
        return Err(format!(
            "invalid parameters: end ({}). Max memory offset: {}",
            end,
            memory_length - 1
        ))
    }
    Ok((start, end))
}
```

## Future improvements

You can see the entire implementation after which this article was written in [this commit](https://github.com/teddav/foundry/commit/7277e7665a3b21d9df46eea0485a66508c4a5022).

This cheatcode was meant to be a first “dirty” version. It’s not ideal because it modifies the same memory you’re trying to inspect. The memory is modified 3 times:

- when calling the cheatcode (to store the arguments of the call)
- when returning: the string or bytes are added to memory
- when using `console.log` again it needs to add the data to memory before logging it

Ideally we would want to log directly the memory without modifying it. I’ll try to prepare a 2nd version soon! Why not write another article about it to close this series. We’ll see…

## Your turn!

Now that you finished this article, it’s your turn to think of a useful cheatcode and implement it. If it’s useful for you, it might be useful for others. You can go ask beforehand on the [Telegram channel](https://t.me/foundry_rs) if anyone is interested.

Follow me on Twitter: [0xteddav](https://twitter.com/0xteddav)

And you can message me there if you have any question, or if I made a mistake somewhere.
