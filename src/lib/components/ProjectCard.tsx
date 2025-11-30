"use client";

import { Tags, TProject } from "@/projects";
import TagsComponent from "./Tags";

const tagColor = (tag: Tags) => {
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
  }

  const tagToColorMap: Record<Tags, string> = {
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
    [Tags.halo2]: colors.purple,
    [Tags.rust]: colors.fuchsia,
    [Tags.python]: colors.pink,
    [Tags.solidity]: colors.rose,
    [Tags.yul]: colors.red,
    [Tags.assembly]: colors.orange,
    [Tags.wasm]: colors.amber,
    [Tags.zk_tls]: colors.yellow,
    [Tags.auditing]: colors.lime,
    [Tags.evm]: colors.green,
  };

  return tagToColorMap[tag] || colors.red;
};

export default function ProjectCard({ title, description, href, tags, badge, details, startDate, endDate }: TProject) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  let dateText = formatDate(startDate);
  if (endDate) {
    if (endDate === "present") {
      dateText = `since ${formatDate(startDate)}`;
    } else {
      dateText = `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-2">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">{title}</h3>
            {badge && (
              <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-200">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-2 font-medium">{dateText}</p>
          {href && (
            <p className="text-sm text-gray-500 mb-3">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-1 hover:text-blue-600 transition-colors break-words group/link"
              >
                <span className="break-normal">{href}</span>
                <svg
                  className="w-3.5 h-3.5 text-gray-400 group-hover/link:text-blue-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </p>
          )}
        </div>
        <div className="flex gap-1 flex-wrap justify-end ml-4 min-w-0">{tags && <TagsComponent tags={tags} />}</div>
      </div>
      <p className="text-gray-700 mb-4 leading-relaxed">{description}</p>
      {details && <div className="text-gray-700 mb-0 leading-relaxed">{details}</div>}
    </div>
  );
}
