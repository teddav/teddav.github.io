"use client";

import { Tags, TProject } from "@/projects";

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

  const dateText = endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : formatDate(startDate);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-blue-600 hover:text-blue-700 mb-1">
            {title}
            {badge && <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{badge}</span>}
          </h3>
          <p className="text-xs text-gray-500 mb-1">{dateText}</p>
          {href && (
            <p className="text-sm text-gray-500 mb-2">
              <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">
                {href}
              </a>
            </p>
          )}
        </div>
        <div className="flex gap-1 flex-wrap justify-end">
          {tags.map((tag) => (
            <span key={tag} className={`${tagColor(tag)} px-2 py-1 rounded text-xs`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <p className="text-gray-700 mb-3">{description}</p>
      {details && <p className="text-gray-700 mb-3">{details}</p>}
    </div>
  );
}
