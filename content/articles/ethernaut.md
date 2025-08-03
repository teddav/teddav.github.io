---
title: "Solving the Ethernaut with Yul"
subtitle: "Solve CTFs with low-level code"
tags: [evm, solidity, yul, assembly, ctf]
authors: teddav
date: 2023-03-04
---

After learning the basics of Solidity assembly in [Part 1: Playing with Yul](https://dev.to/teddav/playing-with-yul-assembly-1i5h) let’s now dive deeper! 💪

We’re going to solve the [Ethernaut challenges](https://ethernaut.openzeppelin.com/), written by Openzeppelin, entirely in assembly. We’ll use some more advanced assembly and also learn about Ethereum security exploits. On top of that we’ll use [Foundry](https://github.com/foundry-rs/foundry/), built by Paradigm, to run our scripts, tests, and deploy to Goerli testnet.

Hopefully you’ll learn a lot going through this article!

The idea is that you should try the challenges yourself, one by one, and after each challenge go checkout my repo to understand the Yul version. You’ll see that throughout the challenges, the same assembly techniques are used over and over so it might be a bit boring after a while.

This article is not meant to be read alone. I just wrote here some explanations of the code for some difficult parts. So your first step should be to go to my [Ethernaut-yul repo](https://github.com/teddav/ethernaut-yul)

I will not give detailed explanations on how to solve each challenge. Most challenges are pretty basic, and you’ll find a lot of explanations if you search online. This tutorial is mostly focused on Assembly.

[evm.codes](https://www.evm.codes/) is a great website if you don’t understand what some opcodes do.

Just like with Part 1, if you have any questions, or issues understanding what I wrote, or if you just wanna chat → message me on [Twitter 0xteddav](https://twitter.com/0xteddav)

## First: setup the repo

[This repo](https://github.com/teddav/ethernaut-yul) is a mix of [Foundry](https://github.com/foundry-rs/foundry/) and [Hardhat](https://hardhat.org/), so it can also be a good boilerplate for your future projects (you’re welcome 😁).

Install Foundry: https://github.com/foundry-rs/foundry/#installation

Then run `yarn` to install the dependencies in package.json

And copy `.env.tmpl` to `.env` and enter the correct values for your private key and the RPC you’re going to use.

## Levels

Each level is solved by a `forge script`. You’ll find all scripts in `script/foundry`.

You’ll find a template in `Level.s.sol` that you can copy/paste. You’ll just need to:

- specify the address of the level
- the network you’re playing on (either “local” or “goerli”)
- change the interface of the level you’re playing

If you’re running the levels locally, you have to run anvil (or hardhat node) as fork of Goerli

```bash
$ anvil -f https://rpc.ankr.com/eth_goerli
```

Then you can run the script with:

```bash
$ forge script ./script/foundry/XX_LevelName.s.sol
```

When you’re ready to actually send the transactions on-chain, you “execute” the broadcast by adding `--broadcast`

```bash
$ forge script ./script/foundry/XX_LevelName.s.sol --broadcast
```

Each script has a `baseVersion()` where the level is solved with Solidity, and the same code is re-written in Yul in the `yulVersion()` function.

When a contract needs to be deployed, I usually wrote the Solidity version, commented it out and re-wrote the Yul version underneath.

In the `test` directory you’ll find some forge tests I wrote while working on some levels, so sometimes you can see what my thinking process was. You can run those tests with

```bash
$ forge test -vvvvv --mt testNameOfTheTest
```

Let’s now detail how I solved some of the levels!

### HelloEthernaut

Didn’t use Yul for this level as it was just used to setup everything. I might come back to it if anyone is interested. It could be fun to parse the string response in assembly.

### Fallback

Let’s start with the basics. We need to call `contribute()` with a value of `1`

```solidity
let dest := sload(instance.slot)
```

We load the address of the instance which is in the `instance` variable. We could figure out the storage slot of `instance` ourselves (you’ll have to go down the chain of the parent contracts we are inheriting from, which is annoying…), but in Yul we can easily get that value with `.slot`

Let’s detail how we call an external function with Yul. We’ll use that same pattern a lot throughout the challenges

```solidity
mstore(0, "contribute()")
mstore(0, keccak256(0, 12))
```

To call a function we need its “selector”. You can read more about it in the [Solidity doc](https://solidity-fr.readthedocs.io/fr/latest/abi-spec.html#function-selector). In Solidity we would do: `bytes4(keccak256(abi.encodePacked("contribute()")))`

First we store in memory at `0` the signature of the function we want to call: `contribute()`(notice that the length is `12`). Our memory looks like this

| 0x00 | 0x636f6e7472696275746528290000000000000000000000000000000000000000 |
| ---- | ------------------------------------------------------------------ |
| 0x20 | 0x0000000000000000000000000000000000000000000000000000000000000000 |
| 0x40 | 0x0000000000000000000000000000000000000000000000000000000000000080 |

_(if you don’t understand what “636f6e747269627574652829” is, lookup “string to hexadecimal” on Google 😁)_

Then we hash that signature with `keccak256(0, 12)` and store the result at `0` in memory. This will overwrite the previous value, but we don’t care because we won’t need it anymore. Our memory is now

| 0x00 | 0xd7bb99ba2c5adddd21e5297f8f4a22a22e4de232bc63ec1e2ec542e79805202e |
| ---- | ------------------------------------------------------------------ |
| 0x20 | 0x0000000000000000000000000000000000000000000000000000000000000000 |
| 0x40 | 0x0000000000000000000000000000000000000000000000000000000000000080 |

The function selector for `contribute()` will be the first 4 bytes of that: `0xd7bb99ba`

Then we execute our `call`. Go check [evm.codes](https://www.evm.codes/#f1) for details on the parameters of the CALL opcode.

```solidity
let success := call(gas(), dest, 1, 0, 4, 0, 0)
if iszero(success) {
	revert(0, 0)
}
```

`dest` is the address of the contract we’re calling. We pass it a value of `1`, then we tell it to get the data from memory starting at `0` up until `4` (our function selector), and then we don’t expect a return value so we pass `0` and `0`. `success` will be either 0 or 1 depending on the result of the call. So we check with `iszero` and if the call failed, we revert.

We just made our first external call. That was easy! 🎉

Let’s do another example: a `view` call. Further down the code you’ll find

```solidity
mstore(0, "owner()")
mstore(0, keccak256(0, 7))
success := staticcall(gas(), dest, 0, 4, 0, 0x20)
if iszero(success) {
	revert(0, 0)
}
```

Here we call `owner()` on the instance, but this time we expect a result. The result will be stored in memory at `0` and will be 32 bytes long (`0x20`). We use `staticcall` because this is a `view` function and will not modify the state. More details… [in the doc](https://docs.soliditylang.org/en/v0.8.19/contracts.html#view-functions).

Then we load the returned value and check if it matches our `player`. Otherwise we revert

```solidity
let owner := mload(0)
if iszero(eq(owner, sload(player.slot))) {
	revert(0, 0)
}
```

### CoinFlip

This level couldn’t be solved with a Foundry script because each call to `exploit()` needs to be sent in a separate transaction. So you’ll find the solver in a Hardhat script in `script/hardhat/3_CoinFlip.ts`

### Telephone

This level introduces a new pattern: deploying a contract.

You need to understand the difference between “creation code” (or “init code”) and “runtime code”. You can find explanations [in the doc](https://docs.soliditylang.org/en/v0.8.19/units-and-global-variables.html#type-information) or [in this article](https://leftasexercise.com/2021/09/05/a-deep-dive-into-solidity-contract-creation-and-the-init-code/), or on [Stackoverflow](https://ethereum.stackexchange.com/questions/76334/what-is-the-difference-between-bytecode-init-code-deployed-bytecode-creation).

We want to deploy our `TelephoneExploit` contract. The contructor takes 1 argument `address _telephone`. The steps are:

- store the init code in memory
- add the constructor parameter
- call CREATE opcode

We can only access the creation code in Solidity. So we’ll have

```solidity
bytes memory creationCode = type(TelephoneExploit).creationCode;
```

This makes everything easier for us because it automatically stores the code to memory. You should remember how `bytes` are stored in memory. Let’s assume that there is nothing else in memory (which should be the case since there is no other instruction), so our memory should start at `0x80`. Here’s what it should look like

| 0x80 | size of the code              |
| ---- | ----------------------------- |
| 0xa0 | the code of TelephoneExploit… |
| 0xc0 | the code of TelephoneExploit… |
| 0xe0 | …                             |

Since `creationCode` is the address in memory where the data starts. Since we assumed that the data was stored at `0x80` we would have `creationCode == 0x80`

if we do `mload(creationCode)` (which is equal to `mload(0x80)`) this will return the size of the TelephoneExploit contract. Then the actual code starts 32 bytes later so we do `add(creationCode, 0x20)`

```solidity
let contractSize := mload(creationCode)
let contractOffset := add(creationCode, 0x20)
```

We just need to store the constructor argument. This is stored at the end of the contract code. Since we know the size of the contract, we just add it to the start of the contract’s code. The address for `_telephone` should be the address of `instance` so we use `sload(instance.slot)`

```solidity
let offsetConstructorArg := add(contractOffset, contractSize)
mstore(offsetConstructorArg, sload(instance.slot))
```

And then we just have to use CREATE and our contract is deployed! 🎉

```solidity
let telephoneExploit := create(0, contractOffset, mload(creationCode))
```

You also noticed the `getOwner()` function. Our first function in Yul. Pretty cool!

```solidity
function getOwner(_contract) -> _owner {
    mstore(0, "owner()")
    mstore(0, keccak256(0, 7))
    let success := staticcall(gas(), _contract, 0, 4, 0, 0x20)
    if iszero(success) {
        revert(0, 0)
    }
    _owner := mload(0)
}
```

**Unfortunately, Yul functions are only usable in the same `assembly` block they were defined in.** So we’ll not be using them too much because we will have to re-write them anyway.

### Token

Let’s see how we can call a function with a parameter, and get a result back.

```solidity
mstore(0, "balanceOf(address)")
mstore(0, keccak256(0, 18))
mstore(0x4, sload(player.slot))
pop(staticcall(gas(), token, 0, 0x24, 0, 0x20))
let startBalance := mload(0)
```

As you’ve seen before: we get the selector for `balanceOf(address)` but this time we are going to add an argument. We do `mstore(0x4, sload(player.slot))`. We store the address of the player at offset `4`. Therefore, the first 4 bytes will the function selector, and the next 32 bytes will represent the address. For example let’s say the address is 0x7c019b7834722f69771cd4e821afc8e717baaab5

The data will be: `0x70a082310000000000000000000000007c019b7834722f69771cd4e821afc8e717baaab5`

And its length is 36 bytes (`0x24`).

Notice that we use `pop` because we don’t want to check if the call succeeded or not. If it didn’t succeed, the transaction will revert anyway at some point and we’ll fail the challenge. But in production you should always check if the call succeeded or not!

### King

Let’s try something new: revert with a string. Check `contracts/9_King.sol`.

You’ll find [here](https://docs.soliditylang.org/en/v0.8.18/control-structures.html#revert) and [here](https://blog.soliditylang.org/2021/04/21/custom-errors/) explanations on how errors work in Solidity. Just like functions, errors have selectors too. The selector for an error string is `Error(string)`. So we’ll need to have it, store it in memory and then store our string. Easy!

Store the selector

```solidity
mstore(ptr, "Error(string)")
mstore(ptr, keccak256(ptr, 13))
```

Store the string

```solidity
mstore(add(ptr, 4), 0x20)
mstore(add(add(ptr, 4), 0x20), 9)
mstore(add(add(ptr, 4), 0x40), "not owner")
```

Remember how string are handled by the EVM (just like `bytes`): first the offset, then the length of the string and finally the string itself. And then we revert with the data we just stored: `revert(ptr, 0x64)`

### Reentrancy

I’m not going to do too much explanation, as it’s the same process as before, but here just notice that we have to store more than 1 parameters for the `exploit()` function. If we tried to store them at memory `0` we would overwrite the free memory pointer at 0x40 which will lead to dangerous behaviour and probably fail our transaction. So instead we store our data in memory where we have space available → where the free memory pointer points us to.

Note that in the previous level (King), when we stored our error string, we did overwrite the free memory pointer. But we didn’t care since we stopped the execution and reverted right after.

### Privacy

In this level we need a `bytes16` but you know that values are stored on 32 bytes in the EVM so we need a bitmask to erase some of the bytes. `bytes` are [stored in the higher-order bytes](https://docs.soliditylang.org/en/v0.8.19/internals/layout_in_storage.html#bytes-and-string) (left aligned). So if we want the first 16 bytes we need to create a mask that looks like this `0xffffffffffffffffffffffffffffffff00000000000000000000000000000000`

```solidity
let mask := shl(128, sub(exp(2, 128), 1))
```

Which is `2**128 - 1 << 128`

Then we just need to apply our mask: `let key := and(data2, mask)`

### Preservation

In `contracts/16_Preservation.sol` we have a bitmask for an address. An address in Ethereum is 20 bytes (160 bits) so our mask will be `2 ** 160 - 1` → `sub(exp(2, 160), 1)`

### Recovery

We compute the address where the contract will be deployed

```solidity
address(uint160(uint256(keccak256(abi.encodePacked(bytes1(0xd6), bytes1(0x94), address(instance), nonce)))))
```

You’ll find some explanations on this [here](https://ethereum.stackexchange.com/questions/760/how-is-the-address-of-an-ethereum-contract-computed) and [here](https://ethereum.stackexchange.com/questions/24248/how-to-calculate-an-ethereum-contracts-address-during-its-creation-using-the-so)

In Foundry there is a convenient cheatcode for that: [computeCreateAddress](https://book.getfoundry.sh/reference/forge-std/compute-create-address#computecreateaddress)

### MagicNumber

Here you can clearly see the difference between creation code and runtime code that we talked about previously. The runtime code is the code that will be returned by the constructor of the contract.

```solidity
constructor(bytes memory bytecode) {
	assembly {
	    return(add(bytecode, 0x20), mload(bytecode))
	}
}
```

We pass in `bytecode` what we eventually want the runtime code to be, and we just need to return it from the constructor. Our runtime code will be `602a60005260206000f3` which is translated to

```solidity
PUSH1 42
PUSH1 0
MSTORE
PUSH1 32
PUSH1 0
RETURN
```

### Puzzle Wallet

Wow! This one is a bit more advanced. More external calls than usual, and a lot of bytes encoding 😱 So i’ll try to give you some explanations.

Let's think about what we want to encode:

→ call `multicall(bytes[])` with:

- a call to `deposit()`
- another call to `multicall(bytes[])`
  - a subcall to `deposit()`

So what is our call data going to look like?

In Solidity, bytes are encoded in three parts in calldata:

1. An offset where the length of the bytes can be found.
2. At the offset specified in step 1, the length of the bytes is stored.
3. Then, to the offset from step 1, we add 0x20 and that’s where the actual bytes are stored.

This encoding is used to allow the EVM to efficiently read the length of the bytes being passed as arguments in a function call, without needing to parse the entire data.

A quick example as a reminder?

```solidity
function myFunction(uint256 myUint, bytes memory myBytes, uint256 myOtherUint) public {}
```

Let's say we want to call this function with the following values:

- `myUint`: `123`
- `myBytes`: `0xabcdef`
- `myOtherUint`: `456`

Here's how the calldata would be encoded:

1. The function selector: `bytes4(keccak256(abi.encodePacked("myFunction(uint256,bytes,uint256)")))` → `0xe329087e`
2. The first parameter (`myUint`): `000000000000000000000000000000000000000000000000000000000000007b`
3. The second parameter (`myBytes`):
   1. The offset where we'll find the length: `000000000000000000000000000000000000000000000000000000000000001c`
   2. At that offset, the length of the bytes: `0000000000000000000000000000000000000000000000000000000000000003`
   3. At offset + 0x20, the actual bytes: `abcdef0000000000000000000000000000000000000000000000000000000000`
4. The third parameter (`myOtherUint`): `00000000000000000000000000000000000000000000000000000000000001c8`

Putting it all together, the resulting calldata would be:

```
0xe329087e
000000000000000000000000000000000000000000000000000000000000007b
0000000000000000000000000000000000000000000000000000000000000060
00000000000000000000000000000000000000000000000000000000000001c8
0000000000000000000000000000000000000000000000000000000000000003
abcdef0000000000000000000000000000000000000000000000000000000000
```

Now, to the more complex stuff: our `multicall(bytes[])`

Let’s start with the first `deposit()` call.

```solidity
function multicall(bytes[] calldata data) external {}
function deposit() external {}
```

The function selector for `multicall(bytes[])`: `bytes4(keccak256(abi.encodePacked("multicall(bytes[])")))` → `0xac9650d8`

The function selector for `deposit()`: `bytes4(keccak256(abi.encodePacked("deposit()")))` → `0xd0e30db0`

For arrays, calldata encoding is similar to `bytes` except we first need to store the length of the array. So our calldata will look like:

- function selector
- offset where we'll find the length of the array
- length of array
- list of offsets where the data will be found for each element
- data

Our `multicall(bytes[])` with `deposit()`

```
0xac9650d8
0000000000000000000000000000000000000000000000000000000000000020 offset
0000000000000000000000000000000000000000000000000000000000000001 length of array
0000000000000000000000000000000000000000000000000000000000000020 offset of first element of array
0000000000000000000000000000000000000000000000000000000000000004 length of data -> 4 bytes, which is the length of the function selector
d0e30db000000000000000000000000000000000000000000000000000000000 data -> the function selector of `deposit()`
```

And now, our calldata with everything

| 0x00  | 0xac9650d8                                                       |
| ----- | ---------------------------------------------------------------- |
| 0x00  | 0000000000000000000000000000000000000000000000000000000000000020 |
| 0x20  | 0000000000000000000000000000000000000000000000000000000000000002 |
| 0x40  | 0000000000000000000000000000000000000000000000000000000000000040 |
| 0x60  | 0000000000000000000000000000000000000000000000000000000000000080 |
| 0x80  | 0000000000000000000000000000000000000000000000000000000000000004 |
| 0xa0  | d0e30db000000000000000000000000000000000000000000000000000000000 |
| 0xc0  | 00000000000000000000000000000000000000000000000000000000000000a4 |
| 0xe0  | ac9650d800000000000000000000000000000000000000000000000000000000 |
| 0x100 | 0000002000000000000000000000000000000000000000000000000000000000 |
| 0x120 | 0000000100000000000000000000000000000000000000000000000000000000 |
| 0x140 | 0000002000000000000000000000000000000000000000000000000000000000 |

```
0xac9650d8
0000000000000000000000000000000000000000000000000000000000000020 offset of array length
0000000000000000000000000000000000000000000000000000000000000002 length of array -> 2
0000000000000000000000000000000000000000000000000000000000000040 offset of 1st element of array: `deposit()` call
0000000000000000000000000000000000000000000000000000000000000080 offset of 2nd element: `multicall(bytes[])` call

0000000000000000000000000000000000000000000000000000000000000004 first element. This is the call to deposit(). We already covered it.
d0e30db000000000000000000000000000000000000000000000000000000000

00000000000000000000000000000000000000000000000000000000000000a4 second element. This is the inner multicall(). The data size is 0xa4 -> 164 bytes
ac9650d800000000000000000000000000000000000000000000000000000000
0000002000000000000000000000000000000000000000000000000000000000
0000000100000000000000000000000000000000000000000000000000000000
0000002000000000000000000000000000000000000000000000000000000000
00000004d0e30db0000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000
```

Let separate the data of the second call. This is just another call to `multicall(bytes[])` so it’s easy to understand

```
ac9650d8
0000000000000000000000000000000000000000000000000000000000000020 offset
0000000000000000000000000000000000000000000000000000000000000001 length
0000000000000000000000000000000000000000000000000000000000000020 offset of element 1
0000000000000000000000000000000000000000000000000000000000000004 length of data
d0e30db000000000000000000000000000000000000000000000000000000000 data -> function selector for `deposit()`
00000000000000000000000000000000000000000000000000000000         -> this is just some padding to make sure we have a multiple of 32 bytes
```

### Motorbike

Just a comment on this level: when we load the exploitSelector, we do not apply a mask to it. We dont really care because when we pass it, we specify that the length of is 4 bytes. The rest will be ignored. But remember that if you actually send that transaction, **it will be more expensive**, because you’re sending more bytes. And calldata bytes are expensive!

```solidity
mstore(add(fmp, 0x24), 0x40)
mstore(add(fmp, 0x44), 4) // <--- here we specify: "only read the next 4 bytes" (the selector for `exploit()`)
mstore(add(fmp, 0x64), exploitSelector) // <-- but here we store the entire hash, not only the 4-bytes selector
```

### DoubleEntryPoint

Another bitmask to get only the 4 bytes of the selector

```solidity
let selectorMask := shl(224, sub(exp(2, 32), 1))
```

If you open `contracts/26_DoubleEntryPoint.sol` the signature of the function is `function handleTransaction(address user, bytes calldata msgData) external`

So `msgData` is in calldata. It was not copied to memory, so we cannot use `mload`. We need to use `calldataload` instead to load the data.

We can easily compute ourselves the offset where we’ll find the data, but there is an easier way: `.offset`

First we get the function selector by applying the `selectorMask` bitmask.

Then we need to get the 3rd parameter: remember, the function is `delegateTransfer(address to, uint256 value, address origSender)` and we only want `origSender`

```solidity
let msgSelector := and(calldataload(msgData.offset), selectorMask)
let origSender := calldataload(add(msgData.offset, 0x44))
```

### GoodSamaritan

Here we revert with a Solidity custom error. Nothing special, it works just like function selectors

```solidity
mstore(0, "NotEnoughBalance()")
mstore(0, keccak256(0, 18))
revert(0, 4)
```

### GateKeeper 3

With that last one, since we have a lot of external functions to call, let’s write some Yul functions. You might have already seen on Telephone level that I already experimented with functions in the tests (check in `test/foundry/4_Telephone.t.sol`).

We need to make a few calls to `gatekeeper` contract: `construct0r()`, `createTrick()`, `getAllowance(uint256)` and `enter()`

We can easily write a function that just hashes the function signature for us and stores the selector. But, as you know, you need the length of the function signature. So let’s first write a function to get a string’s length

```solidity
function getStrLen(_str) -> _length {
    for {
        let i := 0
    } lt(i, 0x20) {
        i := add(i, 1)
    } {
        if iszero(byte(i, _str)) {
            break
        }
        _length := add(_length, 1)
    }
}
```

Easy! We just pass a string as input, it loops over it as long as there is a char. If it finds a `0` it means we’re at the end of the string, so we return the length. Be careful: it only works as long as the string is less that 32 bytes, but it’s all good for us here since all our function signatures are less that 32 characters.

Next we can hash that string and store the result in memory

```solidity
function hashSelector(_sig) {
    mstore(0, _sig)
    mstore(0, keccak256(0, getStrLen(_sig)))
}
```

Again, pretty simple. Finally we can just make our call:

```solidity
function callExternal(_address, _sig, _param) {
    hashSelector(_sig)
    let calldataLen := 4

    if iszero(iszero(_param)) {
        mstore(4, _param)
        calldataLen := 0x24
    }

    let _success := call(gas(), _address, 0, 0, calldataLen, 0, 0)
    if iszero(_success) {
        revert(0, 0)
    }
}
```

Since `getAllowance` takes a parameter, we added an if statement to store that parameter and increase the size of the calldata that will be sent.

🔥 By the way, funny thing about that level. While solving it I discovered a small bug in Foundry for which I [opened an issue](https://github.com/foundry-rs/foundry/issues/4434), and finally decided to solve it myself and [submit a PR](https://github.com/foundry-rs/foundry/pull/4469). You can read more about it [in my tweet](https://twitter.com/0xteddav/status/1631592176319700992) and [the related article](https://dev.to/teddav/foundry-open-source-contribution-1k2d) on [dev.to](https://dev.to/teddav/)

**And… WE ARE DONE !!! 😍**

# Conclusion

That’s all! I hope you had a good time solving the Ethernaut challenges, and that you enjoyed this little walkthrough and learned a lot about assembly!

Again, if you have any issues understanding, or if I made a mistake, you can contact me on Twitter: [0xteddav](https://twitter.com/0xteddav) ❤️
