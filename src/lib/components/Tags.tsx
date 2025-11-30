"use client";

import { Tags } from "@/projects";
import { AuditTags } from "@/app/portfolio/audits";

const tagColor = (tag: Tags | AuditTags) => {
  // https://tailwindcss.com/docs/colors
  enum colors {
    red = "bg-red-100 text-red-800",
    orange = "bg-orange-100 text-orange-800",
    amber = "bg-amber-100 text-amber-800",
    yellow = "bg-yellow-100 text-yellow-800",
    lime = "bg-lime-100 text-lime-800",
    green = "bg-green-100 text-green-800",
    emerald = "bg-emerald-100 text-emerald-800",
    teal = "bg-teal-100 text-teal-800",
    cyan = "bg-cyan-100 text-cyan-800",
    sky = "bg-sky-100 text-sky-800",
    blue = "bg-blue-100 text-blue-800",
    indigo = "bg-indigo-100 text-indigo-800",
    violet = "bg-violet-100 text-violet-800",
    purple = "bg-purple-100 text-purple-800",
    fuchsia = "bg-fuchsia-100 text-fuchsia-800",
    pink = "bg-pink-100 text-pink-800",
    rose = "bg-rose-100 text-rose-800",
    black = "bg-stone-100 text-stone-800",
  }

  const tagToColorMap: Record<Tags | AuditTags, string> = {
    [Tags.privacy]: colors.red,
    [Tags.zk]: colors.orange,
    [Tags.mpc]: colors.amber,
    [Tags.stark]: colors.yellow,
    [Tags.education]: colors.lime,
    [Tags.webassembly]: colors.green,
    [Tags.noir]: colors.emerald,
    [Tags.taceo]: colors.teal,
    [Tags.co_snarks]: colors.cyan,
    [Tags.security]: colors.sky,
    [Tags.testing]: colors.blue,
    [Tags.research]: colors.indigo,
    [Tags.mock_prover]: colors.violet,
    [Tags.halo2]: colors.yellow,
    [Tags.rust]: colors.orange,
    [Tags.python]: colors.pink,
    [Tags.solidity]: colors.purple,
    [Tags.yul]: colors.red,
    [Tags.assembly]: colors.orange,
    [Tags.wasm]: colors.amber,
    [Tags.zk_tls]: colors.yellow,
    [Tags.auditing]: colors.lime,
    [Tags.evm]: colors.green,

    [AuditTags.circom]: colors.blue,
    [AuditTags.aleo]: colors.black,
    [AuditTags.tee]: colors.amber,
    [AuditTags.solana]: colors.green,
    [AuditTags.go]: colors.cyan,
    [AuditTags.das]: colors.violet,
  };

  return tagToColorMap[tag] || colors.red;
};

export default function TagsComponent({ tags }: { tags: (Tags | AuditTags)[] }) {
  return (
    <>
      {tags?.map((tag) => (
        <span
          key={tag}
          className={`${tagColor(
            tag
          )} px-2.5 py-1.5 rounded text-xs font-medium border border-opacity-50 hover:scale-105 transition-transform flex-shrink-0`}
        >
          {tag}
        </span>
      ))}
    </>
  );
}
