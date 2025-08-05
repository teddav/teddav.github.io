import Link from "next/link";

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
  mock_prover = "mock prover",
  halo2 = "halo2",
  rust = "rust",
  python = "python",
  solidity = "solidity",
  yul = "yul",
  assembly = "assembly",
  wasm = "wasm",
  zk_tls = "zk-tls",
  auditing = "auditing",
  evm = "evm",
}

export type TProject = {
  title: string;
  description: string;
  href?: string;
  tags: Tags[];
  badge?: string;
  details?: React.ReactNode;
  startDate: Date;
  endDate?: Date | "present";
};

const ExternalLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">
      {children}
    </a>
  );
};

const work: Record<string, TProject[]> = {
  "Latest projects": [
    {
      title: "zk-tenant",
      description: "Privacy-preserving housing application using 2D-Doc",
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
    {
      title: "co-match",
      description: "Secure MPC matching via TACEO's co-snarks",
      href: "https://github.com/teddav/co-match.noir",
      tags: [Tags.mpc, Tags.co_snarks, Tags.taceo],
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
      title: "Security",
      description: "Learning low-level security: from 'simple' binary exploitation to kernel exploits and more",
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
  ],

  "Zero-Knowledge": [
    {
      title: "Noir WebProof SDK proposal",
      description: "Helping bring zk proofs to the browser with a WebAssembly-friendly Noir SDK",
      href: "https://github.com/orgs/noir-lang/discussions/8595",
      tags: [Tags.mpc, Tags.zk, Tags.webassembly, Tags.noir, Tags.zk_tls],
      startDate: new Date("2025-07-01"),
      endDate: "present",
    },
    {
      title: "Noir recursive proofs",
      description: "Implementing recursive proofs in Noir",
      href: "https://github.com/teddav/noir-recursive",
      tags: [Tags.noir, Tags.zk],
      startDate: new Date("2025-04-20"),
    },
    {
      title: "mpz-play",
      description:
        "Updated mpz-play to the latest version of mpz. A comprehensive playground for learning and experimenting with the mpz framework. Great resource for understanding MPC concepts.",
      href: "https://github.com/th4s/mpz-play",
      tags: [Tags.mpc, Tags.education],
      startDate: new Date("2025-06-01"),
    },
    {
      title: "stark_by_hand with Sage",
      description: "Implementing STARKs from scratch to understand the protocol deeply",
      href: "https://github.com/teddav/stark_by_hand",
      tags: [Tags.stark, Tags.zk, Tags.education, Tags.python],
      startDate: new Date("2025-03-15"),
    },
    {
      title: "Halo2 lookup table soundness bug",
      description: "Found a soundness bug in 'lookup_any' in PSE's Halo2 proving system",
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
      title: "Summa (PSE)",
      description: "Audited Summa, a proof of solvency protocol for centralized exchanges",
      href: "https://github.com/electisec/summa-audit-report",
      tags: [Tags.halo2, Tags.security, Tags.auditing, Tags.rust, Tags.evm, Tags.zk],
      details: (
        <>
          <div>
            More details on <ExternalLink href="https://pse.dev/projects/summa">Summa</ExternalLink>
          </div>
          <div>
            I also wrote a detailed code walkthrough of the{" "}
            <Link href="/notes/summa-contracts" className="text-blue-600 hover:text-blue-700 hover:underline">
              solidity contracts
            </Link>{" "}
            and{" "}
            <Link href="/notes/summa-circuits" className="text-blue-600 hover:text-blue-700 hover:underline">
              the ZK circuits
            </Link>
          </div>
        </>
      ),
      startDate: new Date("2024-04-20"),
    },
    {
      title: "Electisec zblock2 (formerly yAcademy)",
      description: "Top fellow in ZK security fellowship",
      href: "https://electisec.com/zBlock2",
      tags: [Tags.zk, Tags.security, Tags.auditing, Tags.research, Tags.education],
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-04-30"),
    },
    {
      title: "halo2-starter",
      description: "Template to quickly start a Halo2 project",
      href: "https://github.com/teddav/halo2-starter",
      tags: [Tags.halo2, Tags.testing],
      startDate: new Date("2024-06-01"),
      details: <>All you need to start a Halo2 project, from testing to production</>,
    },
    {
      title: "Write secure Halo2 circuits",
      description: "Exploring edge cases and exploits in Halo2 circuits",
      href: "https://github.com/teddav/halo2-soundness-bugs",
      tags: [Tags.halo2, Tags.security, Tags.research, Tags.education],
      startDate: new Date("2025-02-20"),
      details: <>I wrote a detailed blog post, and multiple circuits, on how to write secure Halo2 circuits, and how to test them</>,
    },
    {
      title: "Halo2 cheating feature",
      description: "Emulating malicious provers by modifying cell values in the Mock Prover",
      href: "https://github.com/privacy-scaling-explorations/halo2/pull/352",
      tags: [Tags.halo2, Tags.mock_prover, Tags.security],
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
      description: "Implementing Tornado Cash in Halo2",
      href: "https://teddav.github.io/blog/tornado-halo2",
      tags: [Tags.halo2, Tags.security, Tags.privacy],
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

  "Other work": [
    {
      title: "Contributing to Foundry",
      description: "Contributing to Foundry, a tool for building and testing smart contracts",
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
              <Link href="/blog/foundry1" className="text-blue-600 hover:text-blue-700">
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
      description: "Smart contract security bootcamp",
      href: "https://www.secureum.xyz/",
      tags: [Tags.security, Tags.evm, Tags.solidity, Tags.zk],
      startDate: new Date("2021-10-01"),
      endDate: new Date("2021-12-30"),
      details: (
        <>
          <p>I was awarded the first place in the first cohort of Secureum Epoch 0, a smart contract security bootcamp.</p>
          See the <ExternalLink href="https://github.com/x676f64/secureum-mind_map">bootcamp content</ExternalLink>
        </>
      ),
    },
    {
      title: "Angle: EURO stablecoin",
      description: "Main decentralized EURO stablecoin",
      href: "https://www.angle.money/",
      tags: [Tags.evm, Tags.solidity],
      startDate: new Date("2021-06-30"),
      endDate: new Date("2023-01-01"),
    },
  ],
};

export default work;
