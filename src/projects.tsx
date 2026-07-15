import Link from "next/link";
import { ExternalLink } from "@/lib/components/ExternalLink";

export enum Tags {
  privacy = "privacy",
  zk = "zero-knowledge",
  mpc = "mpc",
  stark = "stark",
  education = "education",
  webassembly = "webassembly",
  noir = "noir",
  taceo = "taceo",
  co_snarks = "co-snarks",
  security = "security",
  testing = "testing",
  research = "research",
  halo2 = "halo2",
  rust = "rust",
  python = "python",
  solidity = "solidity",
  assembly = "assembly",
  zk_tls = "zk-tls",
  auditing = "auditing",
  evm = "evm",
}

export type TProject = {
  title: string;
  description: string;
  href?: string;
  tags?: Tags[];
  badge?: string;
  details?: React.ReactNode;
  startDate: Date;
  endDate?: Date | "present";
};

const work: Record<string, TProject[]> = {
  "Latest projects": [
    {
      title: "co-match",
      description: "A private dating app where matches are computed under MPC, so no one (not even the server) sees your preferences",
      href: "https://github.com/teddav/co-match.noir",
      tags: [Tags.mpc, Tags.co_snarks, Tags.taceo, Tags.privacy],
      startDate: new Date("2025-05-05"),
      details: (
        <>
          I built a Private dating app 🌶️ using TACEO&apos;s co-noir (experimental) tech.
          <br />
          It was a fun project to see what&apos;s possible with{" "}
          <ExternalLink href="https://core.taceo.io/articles/private-shared-state/">private shared state</ExternalLink>
          <br />
          App is probably down, but just in case if you want to take a look:{" "}
          <ExternalLink href="https://co-match.vercel.app/">co-match.vercel.app</ExternalLink>
        </>
      ),
    },
    {
      title: "zk-tenant",
      description: "Prove your ID is valid and your income covers the rent, without handing your documents to a landlord",
      href: "https://github.com/teddav/zk-tenant",
      tags: [Tags.privacy, Tags.zk, Tags.noir],
      startDate: new Date("2025-03-20"),
      details: (
        <>
          Built a PoC for French people to avoid sharing their ID documents with their landlords.
          <br />
          Takes in an ID and a salary slip, and outputs a ZK proof that the ID is valid, and the salary is enough to cover the rent.
          <br />
          See the detailed post{" "}
          <ExternalLink href="https://blog.hyli.org/privacy-preserving-housing-applications-with-david/">on Hyli&apos;s blog</ExternalLink>
          <br />
          You can play with the Noir circuits on <ExternalLink href="https://github.com/teddav/tdd.nr">tdd.nr</ExternalLink> repo.
          <br />
          If you&apos;re lucky, maybe the app <ExternalLink href="https://zk-tenant.vercel.app/">is still live...</ExternalLink>
        </>
      ),
    },
  ],

  "Zero-Knowledge": [
    {
      title: "Noir WebProof SDK proposal",
      description: "WebAssembly-friendly Noir SDK, to make in-browser zkTLS web proofs practical",
      href: "https://github.com/orgs/noir-lang/discussions/8595",
      tags: [Tags.zk, Tags.webassembly, Tags.noir, Tags.zk_tls],
      startDate: new Date("2025-07-01"),
      endDate: "present",
    },
    {
      title: "Noir recursive proofs",
      description: "Recursive proving in Noir",
      href: "https://github.com/teddav/noir-recursive",
      tags: [Tags.noir, Tags.zk],
      startDate: new Date("2025-04-20"),
    },
    {
      title: "mpz-play",
      description: "A hands-on playground for learning the mpz MPC framework, ported to the latest version of mpz",
      href: "https://github.com/th4s/mpz-play",
      tags: [Tags.mpc, Tags.education],
      startDate: new Date("2025-06-01"),
    },
    {
      title: "stark_by_hand with Sage",
      description: "Building a STARK step by step in SageMath, to really understand how the protocol works",
      href: "https://github.com/teddav/stark_by_hand",
      tags: [Tags.stark, Tags.zk, Tags.education, Tags.python],
      startDate: new Date("2025-03-15"),
    },
    {
      title: "Halo2 lookup table soundness bug",
      description: "A soundness bug in PSE's Halo2 lookup_any: a malicious prover could satisfy a lookup that should fail",
      href: "https://github.com/privacy-scaling-explorations/halo2/issues/335",
      tags: [Tags.halo2, Tags.security, Tags.auditing],
      details: (
        <>
          You&apos;ll find the PoC for the bug{" "}
          <ExternalLink href="https://github.com/teddav/poc-underconstrained-halo2/tree/main">on this repo</ExternalLink>
        </>
      ),
      startDate: new Date("2024-05-17"),
    },
    {
      title: "Electisec zblock2 (formerly yAcademy)",
      description: "Finished as a top fellow in Electisec's ZK security fellowship, auditing real ZK circuits",
      href: "https://electisec.com/zBlock2",
      tags: [Tags.zk, Tags.security, Tags.auditing, Tags.research, Tags.education],
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-04-30"),
    },
    {
      title: "halo2-starter",
      description: "A ready-to-go Halo2 project template, with testing wired up from day one",
      href: "https://github.com/teddav/halo2-starter",
      tags: [Tags.halo2, Tags.testing],
      startDate: new Date("2024-06-01"),
      details: <>All you need to start a Halo2 project, from testing to production</>,
    },
    {
      title: "Write secure Halo2 circuits",
      description: "How Halo2 circuits go wrong: common soundness bugs, with circuits and tests that catch them",
      href: "https://github.com/teddav/halo2-soundness-bugs",
      tags: [Tags.halo2, Tags.security, Tags.research, Tags.education],
      startDate: new Date("2025-02-20"),
      details: <>I wrote a detailed blog post, and multiple circuits, on how to write secure Halo2 circuits, and how to test them</>,
    },
    {
      title: "Halo2 cheating feature",
      description: "A Mock Prover feature that emulates a malicious prover by tampering with cell values",
      href: "https://github.com/privacy-scaling-explorations/halo2/pull/352",
      tags: [Tags.halo2, Tags.security],
      startDate: new Date("2024-06-10"),
      details: (
        <>
          A nice feature I wanted while developing circuits.
          <br />
          This was my first PR in Halo2, it was fun to dive into the codebase
        </>
      ),
    },
    {
      title: "Tornado Cash with Halo2",
      description: "A from-scratch reimplementation of Tornado Cash in Halo2, with a detailed write-up of the circuits",
      href: "https://teddav.github.io/blog/tornado-halo2",
      tags: [Tags.halo2, Tags.zk, Tags.security, Tags.privacy],
      startDate: new Date("2024-02-01"),
      details: (
        <>
          Fun project to get more familiar with both Tornado Cash and Halo2.
          <br />
          On top of the circuits, I wrote a detailed blog post to explain everything
          <br />A part 2 is supposed to come someday... mostly to implement the Poseidon hash function (from scratch?), but I haven&apos;t
          had the time to finish
        </>
      ),
    },
  ],

  "Other...": [
    {
      title: "Security",
      description: "Low-level security, self-taught: from binary exploitation to kernel exploits",
      badge: "☠️",
      tags: [Tags.security, Tags.education, Tags.assembly],
      details: (
        <>
          I&apos;m passionate about security, especially low-level (like reverse engineering, assembly, and binary exploitation) but I also
          enjoy web and network hacking.
          <br />
          Entirely self-taught, mostly through <ExternalLink href="https://app.hackthebox.com/profile/225326">
            HackTheBox
          </ExternalLink> and <ExternalLink href="https://www.root-me.org/teddav">Root-Me</ExternalLink>
          <br />
          From &quot;simple&quot; binary exploitation to kernel exploits and more.
        </>
      ),
      startDate: new Date("2024-01-01"),
      endDate: "present",
    },
    {
      title: "Contributing to Foundry",
      description: "Contributed several cheatcodes and a Chisel improvement to Foundry",
      href: "https://github.com/foundry-rs/foundry",
      tags: [Tags.evm, Tags.rust, Tags.testing],
      details: (
        <>
          <div className="space-y-2">
            I merged multiple PRs, based on my needs developing smart contracts:
            <ul className="list-disc flex-col items-center gap-2 ml-4">
              <li>
                <ExternalLink href="https://github.com/foundry-rs/foundry/pull/4931">broadcastRawTransaction cheatcode</ExternalLink>
              </li>
              <li>
                <ExternalLink href="https://github.com/foundry-rs/foundry/pull/4664">getMemory cheatcode</ExternalLink>
              </li>
              <li>
                <ExternalLink href="https://github.com/foundry-rs/foundry/pull/5584">chisel improvement</ExternalLink>
              </li>
            </ul>
            <div>
              See more details in my blog post{" "}
              <Link href="/blog/foundry1" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500">
                here
              </Link>
            </div>
          </div>
        </>
      ),
      startDate: new Date("2023-03-01"),
      endDate: new Date("2024-06-01"),
    },
    {
      title: "Secureum Epoch 0",
      description: "Placed 1st in the first cohort of Secureum's smart-contract security bootcamp",
      href: "https://www.secureum.xyz/",
      tags: [Tags.security, Tags.evm, Tags.solidity, Tags.education],
      startDate: new Date("2021-10-01"),
      endDate: new Date("2021-12-30"),
      details: (
        <>
          <p>The very first cohort of what became one of the best-known smart-contract security bootcamps.</p>
          See the <ExternalLink href="https://github.com/x676f64/secureum-mind_map">bootcamp content</ExternalLink>
        </>
      ),
    },
    {
      title: "Angle: EURO stablecoin",
      description: "Core contributor to Angle, the leading decentralized euro stablecoin",
      href: "https://www.angle.money/",
      tags: [Tags.evm, Tags.solidity],
      startDate: new Date("2021-06-30"),
      endDate: new Date("2023-01-01"),
      details: <>Helped build and ship the protocol, which reached €200M TVL while I was there.</>,
    },
    {
      title: "10 years of building",
      badge: "🛠️",
      description: "A full-stack decade: from mobile apps to cloud infrastructure to cryptography",
      startDate: new Date("2015-07-01"),
      endDate: "present",
      // href: "https://www.malt.fr/profile/dav",
      details: (
        <>
          Over the past decade, I&apos;ve worked across the stack.
          <br />
          From crafting iOS mobile apps, to building backend-heavy web applications with Node.js, to running infrastructure as a DevOps
          engineer on AWS and GCP.
          <br />
          This foundation now fuels my work in cryptography and security.
        </>
      ),
    },
  ],
};

export default work;
