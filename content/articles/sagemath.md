---
title: Easy Sagemath setup
subtitle: Using Sagemath's docker image
tags: [math, algebra]
authors: teddav
date: 2025-02-24
---

I recently started using SageMath and it’s a game changer! 🔥 Prototyping simple or more complex mathematical thoughts has never been this smooth!

I work daily on both an **ARM MacBook** and an **x64 Ubuntu machine**, setting it up properly on both was a bit of a hassle at first. After some trial and error, I found the simplest solution: **running SageMath in Docker**.

The official Docker image, `sagemath/sagemath`, works flawlessly. If you're on an **ARM Mac**, be sure to add the `--platform linux/amd64` flag when pulling the image:

```bash
docker pull --platform linux/amd64 sagemath/sagemath
```

Once downloaded, you can either launch the **Sage REPL** or run a script directly:

```bash
# on ARM Mac
docker run -it --rm --platform linux/amd64 sagemath/sagemath
docker run --rm --platform linux/amd64 -v $(pwd):/app -w /app sagemath/sagemath 'sage myscript.sage'

# not on mac
docker run -it --rm sagemath/sagemath
docker run --rm -v $(pwd):/app -w /app sagemath/sagemath 'sage myscript.sage'
```

## On Linux

Recently, I noticed a small change on **Linux** that required me to run the script as **root**. You might not need this, but if you run into permission issues, try using `sudo`:

```bash
docker run --rm -v $(pwd):/app -w /app sagemath/sagemath 'sudo sage myscript.sage'
```

## Update: use online mode

I just found out about **SageMathCell**, and honestly, why didn’t anyone tell me about it sooner?

You can try out SageMath directly in your browser, no setup needed: https://sagecell.sagemath.org/

Big thanks to [@oba](https://x.com/obatirou) for the tip!

That’s it from me! You now have a fully functional SageMath setup with zero headaches.

I hope this saves you some setup time and helps you get started faster.

If you're a beginner and still running into issues, feel free to reach out on Twitter [@0xteddav](https://x.com/0xteddav), I’d be happy to help! ❤️
