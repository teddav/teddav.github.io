"use client";

import { ExternalLink } from "@/lib/components/ExternalLink";
import TagsComponent, { AuditTags } from "@/lib/components/Tags";
import Link from "next/link";
import { ReactNode } from "react";

type TAudit = {
  project: string;
  projectUrl?: string;
  date: string;
  type: string;
  summary: string;
  scope: string[];
  reportUrl?: string;
  tags?: AuditTags[];
  details?: ReactNode;
};

const audits: TAudit[] = [
  {
    project: "Zcash Tachyon",
    projectUrl: "https://github.com/tachyon-zcash/ragu/",
    date: "January 2026",
    type: "Proof-carrying data (PCD) framework",
    summary:
      "Review of Ragu's recursive proving toolkit for Zcash's Tachyon shielded protocol, built on the Pasta curve cycle.",
    scope: [],
    reportUrl: "#",
    tags: [AuditTags.rust, AuditTags.bulletproofs, AuditTags.folding, AuditTags.pcd],
    details: (
      <>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Part of Project Tachyon, Zcash&apos;s scaling initiative.</p>
        <div className="flex flex-wrap gap-x-4">
          <ExternalLink href="https://seanbowe.com/blog/ragu-for-orchard-part1/">Ragu blog post</ExternalLink>
          <ExternalLink href="https://seanbowe.com/blog/tachyon-scaling-zcash-oblivious-synchronization">Tachyon overview</ExternalLink>
          <ExternalLink href="https://eprint.iacr.org/2025/2031">ePrint paper</ExternalLink>
          <ExternalLink href="https://tachyon.z.cash/ragu/">Ragu book</ExternalLink>
        </div>
      </>
    ),
  },
  {
    project: "Silhouette",
    projectUrl: "https://silhouette.exchange/",
    date: "December 2025",
    type: "Private trading protocol",
    summary: "Private trading on HyperEVM (Hyperliquid), using TEEs backed by AWS Nitro Enclaves.",
    // "Review of Silhouette, a private trading protocol built on HyperEVM (Hyperliquid) using TEEs (AWS Nitro Enclave). Found a critical vulnerability in the AES-GCM implementation.",
    scope: [],
    reportUrl: "#",
    tags: [AuditTags.rust, AuditTags.tee, AuditTags.hyperliquid],
  },
  {
    project: "Self",
    projectUrl: "https://self.xyz/",
    date: "December 2025",
    type: "Digital identity protocol",
    summary:
      "Passport-based identity proofs with selective disclosure of personal information.",
    scope: ["Circom circuits JWT verification from GCP TEE attestations", "TEE server implementation"],
    reportUrl: "#",
    tags: [AuditTags.circom, AuditTags.tee, AuditTags.rust, AuditTags.identity],
  },
  {
    project: "Hyperlane",
    projectUrl: "https://www.hyperlane.xyz/",
    date: "November 2025",
    type: "Cross-chain messaging protocol",
    summary:
      "Aleo messaging and token implementations for Hyperlane's cross-chain protocol.",
    details: (
      <ExternalLink href="https://github.com/hyperlane-xyz/hyperlane-aleo/tree/8a57aacba2a9fdae038f21db68611665398e6f07">
        GitHub repository
      </ExternalLink>
    ),
    scope: [
      "Aleo implementation of the protocol",
      "Hyperlane native token implementation (Leo)",
      "Hyperlane collateral token implementation (Leo)",
      "Hyperlane synthetic token implementation (Leo)",
    ],
    reportUrl: "https://reports.zksecurity.xyz/reports/hyperlane-aleo-1/",
    tags: [AuditTags.aleo],
  },
  {
    project: "(confidential)",
    date: "November 2025",
    type: "Post-quantum proof system",
    summary:
      "LaBRADOR implementation: a post-quantum proof system based on lattice assumptions.",
    details: <ExternalLink href="https://eprint.iacr.org/2022/1341">LaBRADOR paper</ExternalLink>,
    scope: [],
    reportUrl: "#",
    tags: [AuditTags.rust, AuditTags.post_quantum],
  },
  {
    project: "Celestia",
    projectUrl: "https://celestia.org/",
    date: "October 2025",
    type: "Data availability sampling protocol",
    summary:
      "ZODA data availability encoding implementation for Celestia's Fibre Blockspace upgrade.",
    details: (
      <>
        <ExternalLink href="https://eprint.iacr.org/2025/034">ZODA paper</ExternalLink>
        <br />
        <ExternalLink href="https://blog.celestia.org/introducing-fibre-1tb-s-of-blockspace/">Fibre Blockspace announcement</ExternalLink>
      </>
    ),
    scope: [],
    reportUrl: "https://reports.zksecurity.xyz/reports/celestia-1/",
    tags: [AuditTags.go, AuditTags.das],
  },
  {
    project: "Anza/Solana Token 2022 Confidential Transfers",
    projectUrl: "https://solana.com/docs/tokens/extensions/confidential-transfer",
    date: "September 2025",

    type: "Private token",
    summary: 'Confidential Transfers extension for Solana’s Token Extensions Program (Token 2022).',

    scope: ["ZK El Gamal proof program and SDK", "Token 2022 confidential transfers extension"],
    reportUrl: "https://reports.zksecurity.xyz/reports/anza-solana-token2022/",
    tags: [AuditTags.solana, AuditTags.rust, AuditTags.sigma, AuditTags.bulletproofs],
  },
  {
    project: "Summa (PSE)",
    projectUrl: "https://pse.dev/projects/summa",
    date: "April 2024",

    type: "Proof of solvency",
    summary: "Proof of solvency protocol for centralized exchanges.",

    scope: [],
    reportUrl: "https://github.com/electisec/summa-audit-report",

    tags: [AuditTags.halo2, AuditTags.rust, AuditTags.solidity],
    details: (
      <>
        <p className="mb-2">I also wrote a detailed code walkthrough of:</p>
        <ul className="space-y-1.5 ml-4">
          <li className="flex items-start">
            <span className="text-gray-400 dark:text-gray-400 mr-2">•</span>
            <Link href="/notes/summa-contracts" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 hover:underline">
              solidity contracts
            </Link>
          </li>
          <li className="flex items-start">
            <span className="text-gray-400 dark:text-gray-400 mr-2">•</span>
            <Link href="/notes/summa-circuits" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 hover:underline">
              ZK circuits
            </Link>
          </li>
        </ul>
      </>
    ),
  },
];

function Audit({ audit }: { audit: TAudit }) {
  const scopeItems = audit.scope.filter(Boolean);

  const anchorId = audit.project
    .concat("-", audit.date)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return (
    <article id={anchorId} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-lg p-5 sm:p-6 flex flex-col group scroll-mt-24">
      <header className="mb-4">
        <div className="flex items-start gap-3">
          <h3 className="min-w-0 flex-1 text-xl font-semibold leading-snug text-gray-900 dark:text-gray-100 break-words">
            {audit.projectUrl ? (
              <ExternalLink href={audit.projectUrl} className="text-blue-700 dark:text-blue-300 hover:underline underline-offset-4">
                {audit.project}
              </ExternalLink>
            ) : audit.project}
          </h3>
          <a
            href={`#${anchorId}`}
            className="mt-1 shrink-0 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            aria-label="Link to this audit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </a>
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          <span className="whitespace-nowrap">{audit.date}</span>
          <span aria-hidden="true"> · </span>
          {audit.type}
        </p>
      </header>

      <div className="text-gray-700 dark:text-gray-200 mb-4 leading-relaxed flex-1">
        <p>{audit.summary}</p>
        {audit.details && <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{audit.details}</div>}

        {scopeItems.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Scope</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {scopeItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
        {audit.reportUrl && audit.reportUrl !== "#" ? (
          <ExternalLink
            href={audit.reportUrl}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 hover:underline transition-colors"
          >
            View report
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </ExternalLink>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">Report coming soon</span>
        )}

        {audit.tags && audit.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            <TagsComponent tags={audit.tags} />
          </div>
        )}
      </div>
    </article>
  );
}

export default function Audits() {
  return (
    <section className="mb-12 rounded-xl border border-blue-100 bg-blue-50/60 p-4 sm:p-6 dark:border-blue-900/50 dark:bg-blue-950/20">
      <header>
        <h2 className="text-2xl font-semibold text-blue-950 dark:text-blue-100">Security audits</h2>
        <p className="mt-2 text-sm text-blue-900 dark:text-blue-200 leading-relaxed">Cryptography, ZK proofs, and protocol implementations.</p>
      </header>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {audits.map((audit) => (
          <Audit key={audit.project} audit={audit} />
        ))}
      </div>
    </section>
  );
}
