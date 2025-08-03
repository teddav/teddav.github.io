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

export const projects = [
  {
    title: "zk-tenant",
    description: "Privacy-preserving housing application using 2D-Doc",
    href: "https://github.com/teddav/zk-tenant",
    tags: [Tags.privacy, Tags.zk, Tags.noir],
  },
  {
    title: "co-match",
    description: "Secure MPC matching via TACEO's co-snarks",
    href: "https://github.com/teddav/co-match.noir",
    tags: [Tags.mpc, Tags.co_snarks, Tags.taceo],
  },
  {
    title: "stark_by_hand",
    description: "Implementing STARKs from scratch to understand the protocol deeply",
    href: "https://github.com/teddav/stark_by_hand",
    tags: [Tags.stark, Tags.zk, Tags.education, Tags.python],
  },
  {
    title: "Noir WebProof SDK proposal",
    description: "Helping bring zk proofs to the browser with a WebAssembly-friendly Noir SDK",
    details: (
      <b>
        Test <a href="https://github.com/orgs/noir-lang/discussions/8595">link</a>
      </b>
    ),
    href: "https://github.com/orgs/noir-lang/discussions/8595",
    tags: [Tags.webassembly, Tags.noir, Tags.zk_tls],
    badge: "Grant",
  },
];

export const zkAuditing = [
  {
    title: "halo2 soundness bug",
    description: "Found a soundness bug in PSE's Halo2 proving system",
    href: "https://github.com/privacy-scaling-explorations/halo2/issues/335",
    tags: [Tags.halo2, Tags.security, Tags.auditing],
    details: (
      <b>
        <a href="https://github.com/teddav/poc-underconstrained-halo2/tree/main">PoC for the bug</a>
      </b>
    ),
  },
  {
    title: "Summa (PSE)",
    description: "Audited Summa, a proof of solvency protocol for centralized exchanges",
    href: "https://github.com/electisec/summa-audit-report",
    tags: [Tags.halo2, Tags.security, Tags.auditing, Tags.rust, Tags.evm, Tags.zk],
    details: (
      <b>
        <a href="https://pse.dev/projects/summa">Summa</a>
        I also wrote a detailed code walkthrough of the solidity contracts, and the ZK circuits:
        <br />
        <a href="https://teddav.github.io/blog/summa-code-walkthrough">here</a>
      </b>
    ),
  },
  {
    title: "Electisec zblock2",
    description: "zBlock2 top fellow",
    href: "https://electisec.com/zBlock2",
    tags: [Tags.zk, Tags.security, Tags.auditing, Tags.research],
  },
];

export const otherWork = [
  {
    title: "halo2-starter",
    description: "Battle-tested testing patterns for Halo2 development",
    href: "https://github.com/teddav/halo2-starter",
    tags: [Tags.halo2, Tags.testing],
  },
  {
    title: "halo2-soundness-bugs",
    description: "Exploring edge cases and exploits in Halo2 implementations",
    href: "https://github.com/teddav/halo2-soundness-bugs",
    tags: [Tags.halo2, Tags.security, Tags.research],
  },
  {
    title: "Halo2 cheating feature",
    description: "Emulating malicious provers by modifying cell values in the Mock Prover",
    href: "https://github.com/privacy-scaling-explorations/halo2/pull/352",
    tags: [Tags.halo2, Tags.mock_prover, Tags.security],
  },
  {
    title: "Contributing to Foundry",
    description: "Contributing to Foundry, a tool for building and testing smart contracts",
    href: "https://github.com/foundry-rs/foundry",
    tags: [Tags.evm, Tags.rust, Tags.testing],
    details: (
      <>
        broadcastRawTransaction cheatcode: <a href="https://github.com/foundry-rs/foundry/pull/4931">PR</a>
        <br />
        getMemory cheatcode: <a href="https://github.com/foundry-rs/foundry/pull/4664">PR</a>
        <br />
        chisel improvement: <a href="https://github.com/foundry-rs/foundry/pull/5584">PR</a>
        <br />
        <b>
          see more details in my blog post <a href="https://teddav.github.io/blog/foundry1">here</a>
        </b>
      </>
    ),
  },
  {
    title: "halo2 tornado cash",
    description: "Implementing tornado cash in Halo2",
    href: "https://teddav.github.io/blog/tornado-halo2",
    tags: [Tags.halo2, Tags.security, Tags.privacy],
  },
];
