---
title: "Playing with Yul (Assembly)"
subtitle: "Mastering low-level EVM programming"
tags: [evm, solidity, yul, assembly]
authors: teddav
date: 2022-07-08
---

Assembly has been really hyped lately and all the cool kids seem to have started learning it. So I decided to do the same and learn what Yul is and how I can write my contracts with it. I started learning a few weeks ago and today I’m going to show you the basics so you can start enjoying it.

This tutorial is a bit advanced and doesn’t start from the beginning. If you want a real intro, you can check out the amazing series by [@noxx3xxon](https://twitter.com/noxx3xxon) [**EVM Deep Dives: The Path to Shadowy Super Coder**](https://noxx.substack.com/) where everything is really well explained. Or [this great tutorial](https://jeancvllr.medium.com/solidity-tutorial-all-about-assembly-5acdfefde05c) by [@JeanCavallera](https://twitter.com/JeanCavallera).

## What is Assembly/Yul

I’m not going to go into too much details, but basically assembly (or assembler) is a low-level language, really close to what your computer can understand. It’s a sequence of instructions for your computer to execute (here: the EVM).

Yul is just the name of the (almost) assembly for the EVM. I say “almost” because it’s a bit easier to write than pure assembly and it has the concept of variables, functions, for-loops, if statements, … whereas pure assembly doesn’t. So Yul makes our lives a bit easier 😊

You can use Yul when you need to have more control over what your code is doing. You can do anything in Yul since you control exactly what the EVM is going to execute, while Solidity is more restrictive. And most of the time Yul is used for gas optimizations.

Writing an entire contract in assembly (Yul) wouldn’t make sense usually, but that’s what we are going to do here so that you can understand better how it works and how the EVM works.

## The base contract

As I already said, I’ll try to explain as much as possible, but I will not go over the very basics. So if you want to understand this tutorial, you’ll need a good understanding of Solidity and the EVM.

Let’s begin! We’ll rewrite this (really unsafe and stupid 😄) “lottery” contract to assembly. No access control, and the functions are a bit dumb, but it will be easier to write/understand when written in assembly 😊

```solidity
contract AngleExplainsBase {
    uint private secretNumber;
    mapping(address =>  uint) public guesses;

    bytes32 public secretWord;

    // obviously this doesn't make sense
    // but it will be fun to write it in assembly :D
    function getSecretNumber() external view returns(uint) {
        return secretNumber;
    }

    // this should only be set by an admin
    // no access control because we want to keep it simple in assembly
    function setSecretNumber(uint number) external {
        secretNumber = number;
    }

    // a user can add a guess
    function addGuess(uint _guess) external {
        guesses[msg.sender] = _guess;
    }

    // yes i know... it doesn't make sense because you can change guesses for any user
    // it's just to teach you how to parse arrays in assembly
    function addMultipleGuesses(address[] memory _users, uint[] memory _guesses) external {
        for (uint i = 0; i < _users.length; i++) {
            guesses[_users[i]] = _guesses[i];
        }
    }

    // this is useless since the `secretWord` is not used anywhere
    // but this will teach us how to hash a string in assembly. Really cool! :)
    function hashSecretWord(string memory _str) external {
        secretWord = keccak256(abi.encodePacked(_str));
    }
}
```

We have a `secretNumber` that is private and we have a getter for that secret number `getSecretNumber`. Yes, it doesn't make, but if you're reading this, you should know that nothing is private on the blockchain anyway, so it doesn't really matter if we add a getter. It will just be fun to write it to assembly. Then, obviously, we have a setter `setSecretNumber`.

The user can add 1 or multiple guess(es) `addGuess` / `addMultipleGuesses`.

Then we have an extra function `hashSecretWord`. Let's imagine, we could use it if we decide to switch from a secret number to a secret string. Here it will help us understand more about how strings are handled in memory and we'll learn how to hash something in assembly (so cool!).

## Get/Set our secret number

Throughout the code you’ll see a lot `0x20` or multiples of it (0x40, 0x60, 0x80, 0xa0, ...). This is the hexadecimal representation of `32` because the EVM uses 32 bytes memory slots (words). So values are always encoded in 32 bytes. (yes, you should know how to count in hexadecimal).

Let’s start with `getSecretNumber`. We will need SLOAD, MLOAD, MSTORE and RETURN opcodes for this function. Use the great [https://www.evm.codes](https://www.evm.codes/) to learn more about EVM opcodes.

SLOAD just retrieves a value from storage. So we use SLOAD to get the value of our secret number. Then, in an ideal world, we should be done and just be able to return that number. But the EVM is a bit more complex than that and only returns values that are stored in memory. Solidity makes it easier for us and allows us to just return a value, and we don’t care what happens under the hood, but remember that Yul is more lower level, so we need to do the hard work.

First we’ll store that value to memory with MSTORE, and then we can return it.

### Free memory pointer

We’ll use the “free memory pointer”, which is stored at 0x40 in memory.

`mload(0x40)` gives us the address in memory where we are allowed to write (in order not to overwrite anything). The memory before that address is already used, so if we overwrite it we might mess up our entire transaction (or even contract 😮 if something in that memory was meant to be written to storage for example).

We store our number there (MSTORE). And then we return it by specifying the address in memory, and the size that should be returned

```solidity
function getSecretNumber() external view returns(uint) {
        assembly {
            // We get the value for secretNumber which is at slot 0
            // in Yul, you also have access to the slot number of a variable through `.slot`
						// https://docs.soliditylang.org/en/latest/assembly.html#access-to-external-variables-functions-and-libraries
            // so we could also just write `sload(secretNumber.slot)`
            // SLOAD https://www.evm.codes/#54
            let _secretNumber := sload(0)

            // then we get the "free memory pointer"
            // that means we get the address in the memory where we can write to
            // we use the MLOAD opcode for that: https://www.evm.codes/#51
            // We get the value stored at 0x40 (64)
            // 0x40 is just a constant decided in the EVM where the address of the free memory is stored
            // see here: https://docs.soliditylang.org/en/latest/assembly.html#memory-management
            let ptr := mload(0x40)

            // we write our number at that address
            // to do that, we use the MSTORE opcode: https://www.evm.codes/#52
            // It takes 2 parameters: the address in memory where to store our value, and the value to store
            mstore(ptr, _secretNumber)

            // then we RETURN the value: https://www.evm.codes/#f3
            // we specify the address where the value is stored: `ptr`
            // and the size of the parameter returned: 32 bytes (remember values are always stored on 32 bytes)
            return(ptr, 0x20)
        }
    }
```

I just wanted to complicate things a bit for you by using the free memory pointer. But we could write our function in a shorter way:

```solidity
// instead of using the free memory pointer, we could also store the value at `0`
// because the first 2 slots in memory are used as "scratch space"
// https://docs.soliditylang.org/en/latest/internals/layout_in_memory.html#layout-in-memory
// this means they are used to store temporary values, such as return values
// we would have had:
assembly {
	let _secretNumber := sload(0)
	mstore(0, _secretNumber)
	return(0, 0x20)
}
```

Why? You have to know that the EVM reserves the first 4 slots in memory for special purposes. Here are the slots. I added a 5th one which represents the first writable slot.

| offset     | value                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------- |
| 0x00 (0)   | scratch space, can be used for storing anything                                          |
| 0x20 (32)  | scratch space, can be used for storing anything                                          |
| 0x40 (64)  | free memory pointer. Initial value is **0x80** (where starts the memory we can write to) |
| 0x60 (96)  | zero slot, should never be touched                                                       |
| 0x80 (128) | that’s where the memory starts                                                           |

As you can see, we can use the first 2 slots to write anything. But we have to keep in mind that they can be also be overwritten at anytime.

Next we’ll write `setSecretNumber` which is a bit easier. We just need to retrieve the slot number where the value is stored, and use SSTORE to store our new value.

Here we’ll just use the special `.slot` helper that Yul offers us. It makes it easier, so we don't have to manually calculate the slot number 😄

```solidity
function setSecretNumber(uint _number) external {
        assembly {
            // We get the slot number for `secretNumber`
            let slot := secretNumber.slot

            // We use SSTORE to store the new value
            // https://www.evm.codes/#51
            sstore(slot, _number)
        }
    }
```

## Add guesses

We now need to allow a user to add a guess. But `guesses` is a mapping, so it complicates things. We first need to compute the value of the storage slot where the `guess` is going to be stored, and then we can store it with SSTORE

### How mappings work

To write a value to a mapping: we concatenate the key and the slot number of the mapping, and hash that (for more details: https://solidity-fr.readthedocs.io/fr/latest/internals/layout_in_storage.html#mappings-and-dynamic-arrays). Here our mapping `guesses` is at storage slot 1.

So in Solidity we would get the storage slot by doing `keccak256(abi.encode(msg.sender, 1))`

To hash something in Yul, we have to store it to memory first. It’s not possible otherwise, keccak256() only looks in memory.

Here are the steps to get our slot number

- get the msg.sender address
- get the slot number of the mapping
- store both of them in memory (in order and next to each other)
- compute the hash

```solidity
function addGuess(uint _guess) external {
        assembly {
            // first we compute the slot where we will store the value
            // https://solidity-fr.readthedocs.io/fr/latest/internals/layout_in_storage.html#mappings-and-dynamic-arrays
            // we have: keccak256(abi.encode(_user, 1)) where 1 is the slot number for `guesses`
            let ptr := mload(0x40)

            // we store the address of msg.sender at `ptr` address
						// CALLER opcode: https://www.evm.codes/#33
            mstore(ptr, caller())

            // then right after that, we store the slot number for `guesses`
            mstore(add(ptr, 0x20), guesses.slot)

            // the 2 previous MSTORE are equivalent to abi.encode(msg.sender, 1)

            // then we just compute the hash of the msg.Sender and guesses.slot
            // they are currently stored at `ptr` and use 2 slots (2x 32bytes -> 0x40)
            let slot := keccak256(ptr, 0x40)

            // we now only need to store the value at that slot
            sstore(slot, _guess)
        }
    }
```

To get the address of the msg.sender in assembly we use the CALLER opcode.

We use the free memory pointer to know where to write our values. Then we store the msg.sender (caller()).

`add(ptr, 0x20)` gives us the memory address 32 bytes after, which means "the next memory slot". That's where we'll store our second value.

### Operations in Assembly

In Assembly we can't do simple operations (+ - \* /), they just don’t exist ☹️

We need to use specific opcodes for that. Here we use ADD to add 32 bytes to the address of `ptr`

This is equivalent to: ptr = ptr + 32

Then we hash all of that. The second argument of `keccak256` is the size of the data to be hashed. Here it's 2 memory slots, so 2\*32=64 (0x40 in hexadecimal)

## Hash some strings

We are going to take a quick break from our main functions and focus and the most useless function (but most fun) of our Solidity contract: `hashSecretWord`. We'll even go as far as writing it 2 times with 2 different techniques to get the `_str` parameter’s value. We’ll use the CALLDATA opcodes, to help you understand how `calldata` works and how to manipulate the calldata (you're welcome!).

### Non-value types

First, a little lesson about non-value types: one of the complicated parts I noticed when first learning Yul was when dealing with non-value types (array, mapping, bytes or string). But they are actually not that hard to understand, you just have to understand how the EVM deals with them and stores them in memory.

It goes like this: those values are usually stored in 2 parts: first their length, and then the actual value. Imagine you pass the string “angle” as a parameter. It will be stored like “5angle” so the EVM knows it’s supposed to read the next 5 characters.

It will actually look a bit different, since the EVM works in 32 bytes memory slots, it will look more like: `0000000000000000000000000000000000000000000000000000000000000005616e676c65000000000000000000000000000000000000000000000000000000`

notice the `5` and then the word `angle` written in hexadecimal (`616e676c65`)

Ok, back to our code.

```solidity
// computes the keccak256 hash of a string and stores it in a state variable
function hashSecretWord1(string memory _str) external view returns(bytes32) {
    assembly {
        // in assembly `_str` is just a pointer to the string
        // it represents the address in memory where the data for our string starts
        // at `_str` we have the length of the string
        // at `_str` + 32 -> we have the string itself

        // here we get the size of the string
        let strSize := mload(_str)

        // here we add 32 to that address, so that we have the address of the string itself
        let strAddr := add(_str, 32)

        // we then pass the address of the string, and its size. This will hash our string
        let hash := keccak256(strAddr, strSize)

        // we store the hash value at slot 0 in memory
        // just like we explained before, this is used as temporary storage (scratch space)
        // no need to get the free memory pointer, it is faster (and cheaper) to use `0`
        mstore(0, hash)

        // we return what is stored at slot 0 (our hash) and the length of the hash (32)
        return (0, 32)
    }
}
```

Here `_str` is a pointer to the slot in memory where the length of the string is stored, and then (at the next slot) the string itself starts. So we just need to retrieve that size, then we can just hash the string directly since it's already in memory and we know its address. Easy!

To make it even easier, let me show you what the memory looks like at the start of our function. Let’s say we passed the string “stablecoin”

| offset     | value      |
| ---------- | ---------- |
| 0x00 (0)   | …          |
| 0x20 (32)  | …          |
| 0x40 (64)  | 0xc0       |
| 0x60 (96)  | …          |
| 0x80 (128) | 10         |
| 0xa0 (160) | stablecoin |
| 0xc0 (192) |            |

The length of our string is written at 0x80, and our word is written at 0xa0. The free memory pointer points to the next available memory space: 0xc0.

And `_str` is equal to 0x80 (where our string is stored).

But you may ask: How was it stored in memory in the first place? There was no MSTORE to write to memory, so why isn’t the memory empty?

The EVM (magically) placed it there because we asked it to do so. When? Here: `string memory _str`.

By specifying `memory` in the parameter, we asked the EVM to prepare our memory and place our parameter there. That's why using `calldata` is cheaper, there is no writing to memory 😉

### Second string hashing technique

```solidity
// this is the same as `hashSecretWord1` but using a different technique
// here we use specific opcodes to manipulate calldata instead of using the parameters of the function
// instead of returning the hash, we'll assign it to storage variable `secretWord`
function hashSecretWord2(string calldata) external {
    assembly {
        // the calldata represents the entire data passed to a contract when calling a function
        // the first 4 bytes always represent the signature of the function, and the rest are the parameters
        // here we can skip the signature because we are already in the function, so the signature obviously represent the current function
        // we can use CALLDATALOAD to load 32 bytes from the calldata.
        // we use calldataload(4) to skip the signature bytes. This will therefore load the 1st parameter
        // when using non-value types (array, mapping, bytes, string) the first parameter is going to be the offset where the parameter starts
        // at that offset, we'll find the length of the parameter, and then the value

        // this is the offset in `calldata` where our string starts
        // here we use calldataload(4) -> loads the offset where the string starts
        // -> we add 4 to that offset to take into account the signature bytes
        // https://www.evm.codes/#35
        let strOffset := add(4, calldataload(4))

        // we use calldataload() again with the offset we just computed, this gives us the length of the string (the value stored at the offset)
        let strSize := calldataload(strOffset)

        // we load the free memory pointer
        let ptr := mload(0x40)

        // we copy the value of our string into that free memory
        // CALLDATACOPY https://www.evm.codes/#37
        // the string starts at the next memory slot, so we add 0x20 to it
        calldatacopy(ptr, add(strOffset, 0x20), strSize)

        // then we compute the hash of that string
        // remember, the string is now stored at `ptr`
        let hash := keccak256(ptr, strSize)

        // and we store it to storage
        sstore(secretWord.slot, hash)
    }
}
```

We don’t even need a name for our parameter since we’re not going to use it explicitly. And notice that this time we don’t need it in “memory", so we specify “calldata” so that it won’t be copied.

The CALLDATALOAD opcode loads 32 bytes from the calldata starting at the offset specified. We use it here to load values 1 by 1.

### More non-value types

I need to add something to the previous explanation about non-value types. The calldata is just a bit more complicated than what I previously told you. Focus! This is not easy.

Let’s give an example of what the memory would look like for a function with 3 parameters:

`function myToken(string memory name, uint randomValue, address[] memory _addresses)`

we pass the following (pseudo random) parameters 🙂

“angle”, 7, ["0x31429d1856aD1377A8A0079410B297e1a9e214c2", "0x1a7e4e63778B4f12a199C062f3eFdD288afCBce8"]

What the calldata looks like `050eed260000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000005616e676c65000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000031429d1856ad1377a8a0079410b297e1a9e214c20000000000000000000000001a7e4e63778b4f12a199c062f3efdd288afcbce8`

Let’s split that in 32 bytes words to have a better view.

First we have the function signature: 050eed26, and then the parameters:

| offset (from 1st param) | offset (calldata) | value                                                            |
| ----------------------- | ----------------- | ---------------------------------------------------------------- |
| 0x00 (0)                | 0x04 (4)          | 0000000000000000000000000000000000000000000000000000000000000060 |
| 0x20 (32)               | 0x24 (36)         | 0000000000000000000000000000000000000000000000000000000000000007 |
| 0x40 (64)               | 0x44 (68)         | 00000000000000000000000000000000000000000000000000000000000000a0 |
| 0x60 (96)               | 0x64 (100)        | 0000000000000000000000000000000000000000000000000000000000000005 |
| 0x80 (128)              | 0x84 (132)        | 616e676c65000000000000000000000000000000000000000000000000000000 |
| 0xa0 (160)              | 0xa4 (164)        | 0000000000000000000000000000000000000000000000000000000000000002 |
| 0xc0 (192)              | 0xc4 (196)        | 00000000000000000000000031429d1856ad1377a8a0079410b297e1a9e214c2 |
| 0xe0 (224)              | 0xe4 (228)        | 0000000000000000000000001a7e4e63778b4f12a199c062f3efdd288afcbce8 |

I used https://abi.hashex.org/ to easily encode the calldata.

We have our 3 function parameters, in order, but encoded in a special way.

I started the numbering at 0, but we’ll have to remember to add 4 to the offset to account for function signature.

For value types, the value is the value of the parameter. See at 0x20, we have `7` which is the value we passed for `randomValue`. But for non-value types, we actually get the offset where the data starts. See at 0x00 we have 0x60. If we check at 0x60, we have 5: the length of the string, and right after, at 0x80 we have the string "angle".

The last parameter starts at 0x40, again this is the offset. So let’s check at 0xa0, we have 2 (the length of our array), and then the 2 values at 0xc0 and 0xe0.

Nice! We finally know how the EVM understands all the “weird” types we can pass to it!

Back to our calldata then.

Let’s just explain this line better `let strOffset := add(4, calldataload(4))`

We use CALLDATALOAD to get the first parameter (at offset 4, remember the function signature…).

This returns the offset where the length of the string is stored. For example, if we take the previous example, we would get 0x60 (the value stored at 0x04 in calldata). If we add 4 to it, we get 0x64, which is the address where we get our string in the calldata.

Then we use CALLDATACOPY to copy the string to memory. We hash it and store it. And we’re done 😎

Yes this was a quick explanation for a complicated code, but with everything I explained to you until now, you should be able to understand it. If not, hit me up on Twitter @0xteddav and i’ll help you.

### addMultipleGuesses: use all our Yul knowledge

Lastly, let’s reuse everything we just learned to loop through 2 arrays in assembly and store values to a mapping in storage! wow 🤯

```solidity
function addMultipleGuesses(address[] memory _users, uint[] memory _guesses) external {
        assembly {
            // remember: `_users` is the address in memory where the parameter starts
            // This is where the size of the array is stored. And then 32 bytes after, we have the values of the array
            // so here we load what's at address `_users` -> which is the size of the array `_users`
            let usersSize := mload(_users)

            // same for `_guesses`
            let guessesSize := mload(_guesses)

            // we check that both arrays are the same size
            // check EQ, ISZERO and REVERT opcodes on https://www.evm.codes/
            if iszero(eq(usersSize, guessesSize)) { revert(0, 0) }

            // we use a for-loop to loop through the items
            for { let i := 0 } lt(i, usersSize) { i := add(i, 1) } {
                // to get the ith value from the array we multiply i by 32 (0x20) and add it to `_users`
                // we always have to add 1 to i first, because remember that `_users` is the size of the array, the values start 32 bytes after
                // we could also do it this way (maybe it makes more sense):
                // let userAddress := mload(add(add(_users, 0x20), mul(0x20, i)))
                let userAddress := mload(add(_users, mul(0x20, add(i, 1))))
                let userBalance := mload(add(_guesses, mul(0x20, add(i, 1))))

                // we use the 0 memory slot as temporary storage to compute our hash
                // we store the address there
                mstore(0, userAddress)
                // then the slot number for `guesses`
                mstore(0x20, guesses.slot)
                // we compute the storage slot number
                let slot := keccak256(0, 0x40)
                // and store our value to it
                sstore(slot, userBalance)
            }
        }
    }
```

I hope the comments are clear enough. I’ll just add a few explanations.

To check that both arrays are the same size, we use ISZERO and EQ opcodes. eq() takes 2 numbers as parameters and returns 1 if they are equal, 0 if not equal. Then we simply use iszero() to check the returned value from eq(). If they are not equal, we revert.

iszero(eq(a, b)) is equivalent to `a != b` in Solidity

Finally the for-loop: the line to get the value from the parameter is a bit complicated. Let’s explain this one:

`let userAddress := mload(add(_users, mul(0x20, add(i, 1))))`

So remember that our users’ addresses (`_users`) are written to memory by the EVM.

The variable `_users` is the address in memory where the length of the array is stored. So to get to the first value of the array we have to add 32 to it.

Since we are in a for-loop, every iteration we need to add 32.

So to get the current value we have 32*i + 32 → 32 * (i + 1) → which in assembly is `mul(0x20, add(i, 1))`

To make it easier (and more gas efficient), we could have started the loop at i=1 to avoid all the `add(i, 1)`.

## You made it!

So that’s it, we are done! We wrote an entire contract in assembly, and even did a bit of extra work (just for fun!).

You can find the entire code used in that thread in this [Github Gist](https://gist.github.com/teddav/e5c77d36d76567631ba5898a64a79079). So that if you’re too lazy to re-write it, you can just copy it.

If you have any question, hit me up on [Twitter @0xteddav](https://twitter.com/0xteddav) or on our Discord.

Let me know what you want me to write about next. Should I go deeper? Or write on another subject?
