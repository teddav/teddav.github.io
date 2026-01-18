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
  // {
  //   project: "Zcash",
  //   projectUrl: "https://z.cash/",
  //   date: "January 2026",
  //   type: "Privacy-preserving cryptocurrency",
  //   summary:
  //     "Review of Ragu, a new PCD (proof-carrying data) toolkit for Zcash's Orchard shielded protocol. Ragu enables recursive proofs with the Pasta curve cycle, using a simpler R1CS-like arithmetization designed for non-uniform circuits.",
  //   scope: [],
  //   reportUrl: "#",
  //   tags: [AuditTags.rust, AuditTags.bulletproofs],
  //   details: (
  //     <>
  //       <p className="text-sm text-gray-600 mb-2">Part of Project Tachyon, Zcash&apos;s scaling initiative.</p>
  //       <div className="flex flex-wrap gap-x-4">
  //         <ExternalLink href="https://seanbowe.com/blog/ragu-for-orchard-part1/">Ragu blog post</ExternalLink>
  //         <ExternalLink href="https://seanbowe.com/blog/tachyon-scaling-zcash-oblivious-synchronization">Tachyon overview</ExternalLink>
  //         <ExternalLink href="https://eprint.iacr.org/2025/2031">ePrint paper</ExternalLink>
  //       </div>
  //     </>
  //   ),
  // },
  {
    project: "Silhouette",
    projectUrl: "https://silhouette.exchange/",
    date: "December 2025",
    type: "Private trading protocol",
    summary: "Review of Silhouette, a private trading protocol built on HyperEVM (Hyperliquid) using TEEs (AWS Nitro Enclave).",
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
      "Review of Self, a privacy-preserving identity protocol that allows users to prove their identity through their passport while selectively disclosing only chosen fields.",
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
      "Review of Hyperlane's Aleo implementation, the main interoperability bridge on Aleo. Hyperlane is a universal cross-chain messaging protocol deployed across many chains.",
    details: (
      <ExternalLink href="https://github.com/hyperlane-xyz/hyperlane-aleo/tree/8a57aacba2a9fdae038f21db68611665398e6f07">
        Github repo
      </ExternalLink>
    ),
    scope: [
      "Aleo implementation of the protocol",
      "Hyperlane native token implementation (Leo)",
      "Hyperlane collateral token implementation (Leo)",
      "Hyperlane synthetic token implementation (Leo)",
    ],
    reportUrl: "#",
    tags: [AuditTags.aleo],
  },
  {
    project: "(confidential)",
    date: "November 2025",
    type: "Post-quantum proof system",
    summary:
      "Review of a LaBRADOR implementation, a cutting-edge post-quantum proof system based on lattice assumptions, offering an alternative to pairing-based SNARKs.",
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
      "Review of Celestia's ZODA implementation, a new data availability encoding protocol that is significantly more efficient than KZG-based approaches, powering Celestia's Fibre Blockspace upgrade.",
    details: (
      <>
        <ExternalLink href="https://eprint.iacr.org/2025/034">ZODA paper</ExternalLink>
        <br />
        <ExternalLink href="https://blog.celestia.org/introducing-fibre-1tb-s-of-blockspace/">Fibre Blockspace announcement</ExternalLink>
      </>
    ),
    scope: [],
    reportUrl: "#",
    tags: [AuditTags.go, AuditTags.das],
  },
  {
    project: "Anza/Solana Token 2022 Confidential Transfers",
    projectUrl: "https://solana.com/docs/tokens/extensions/confidential-transfer",
    date: "September 2025",

    type: "Private token",
    summary: 'Review of the implementation of the Confidential Transfers extension for the "Token Extensions Program" (Token 2022)',

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
            <span className="text-gray-400 mr-2">•</span>
            <Link href="/notes/summa-contracts" className="text-blue-600 hover:text-blue-700 hover:underline">
              solidity contracts
            </Link>
          </li>
          <li className="flex items-start">
            <span className="text-gray-400 mr-2">•</span>
            <Link href="/notes/summa-circuits" className="text-blue-600 hover:text-blue-700 hover:underline">
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
    <article id={anchorId} className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col group">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            <ExternalLink href={audit.projectUrl ?? "#"}>{audit.project}</ExternalLink>
            <a
              href={`#${anchorId}`}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 ml-1.5 align-middle inline"
              aria-label="Copy link to this audit"
            >
              <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </a>
          </h3>

          <p className="text-sm text-gray-600 mb-2">{audit.type}</p>
        </div>
        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{audit.date}</span>
      </div>

      <div className="text-gray-700 mb-4 leading-relaxed flex-1">
        <p>{audit.summary}</p>
        {audit.details && <div className="mt-4 leading-relaxed">{audit.details}</div>}

        {scopeItems.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Scope</p>
            <ul className="space-y-1.5">
              {scopeItems.map((item) => (
                <li key={item} className="text-sm text-gray-600 flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100">
        {audit.reportUrl && audit.reportUrl !== "#" ? (
          <ExternalLink
            href={audit.reportUrl}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
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
          <span className="text-sm text-gray-400">Report coming soon</span>
        )}

        {audit.tags && audit.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 ml-auto">
            <TagsComponent tags={audit.tags} />
          </div>
        )}
      </div>
    </article>
  );
}

export default function Audits() {
  return (
    <section className="mb-10 rounded-2xl border border-blue-100 bg-blue-50/80 px-6 py-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Auditing</p>
          <h2 className="text-2xl font-semibold text-blue-950">Recent cryptography &amp; ZK audits</h2>
          <p className="text-blue-900">Deep reviews of protocols I&apos;ve been helping secure lately.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {audits.map((audit) => (
          <Audit key={audit.project} audit={audit} />
        ))}
      </div>
    </section>
  );
}
