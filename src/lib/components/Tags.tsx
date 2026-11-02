"use client";

import type { Tags } from "@/projects";

export enum AuditTags {
  circom = "circom",
  halo2 = "halo2",
  rust = "rust",
  aleo = "aleo",
  go = "go",
  tee = "TEE",
  solidity = "solidity",
  solana = "solana",
  das = "data-availability sampling",
  post_quantum = "post-quantum",
  hyperliquid = "hyperliquid",
  sigma = "sigma",
  bulletproofs = "bulletproofs",
  identity = "identity",
  folding = "folding",
  pcd = "proof-carrying data"
}

export default function TagsComponent({ tags }: { tags: (Tags | AuditTags)[] }) {
  return (
    <>
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex max-w-full items-center rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-xs font-medium leading-4 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          {tag}
        </span>
      ))}
    </>
  );
}
