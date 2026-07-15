import Link from "next/link";
import { GithubIcon, TwitterIcon } from "@/lib/components/Icons";
import { getContentList, ContentType } from "@/lib/content";

// Keep in sync with the audits list in src/app/portfolio/audits.tsx
const AUDIT_COUNT = 8;

const focus = [
  { label: "zero-knowledge proofs", gradient: "from-rose-500 to-pink-500" },
  { label: "multi-party computation", gradient: "from-blue-500 to-purple-500" },
  { label: "fully homomorphic encryption", gradient: "from-green-500 to-emerald-500" },
];

export default function HomePage() {
  const articleCount = getContentList(ContentType.article).length;

  const stats = [
    { value: `${articleCount}`, label: "Articles", href: "/blog" },
    { value: `${AUDIT_COUNT}`, label: "Audits", href: "/portfolio" },
    { value: "10+", label: "Years building", href: "/portfolio" },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-300/40 blur-3xl animate-blob dark:bg-blue-600/20" />
        <div className="absolute top-8 right-0 h-80 w-80 rounded-full bg-purple-300/40 blur-3xl animate-blob animation-delay-2000 dark:bg-purple-600/20" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl animate-blob animation-delay-4000 dark:bg-emerald-600/10" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
        <div className="text-center">
          {/* Role pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-gray-600 backdrop-blur mb-8 dark:border-gray-700 dark:bg-white/5 dark:text-gray-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Security Researcher &amp; ZK Engineer
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Hey, I&apos;m David <span className="inline-block animate-wave">👋</span>
            <span className="block mt-4 bg-gradient-to-r from-blue-600 via-purple-600 to-rose-500 bg-clip-text text-transparent pb-2">
              Breaking &amp; building
              <br className="hidden sm:block" /> cryptographic protocols
            </span>
          </h1>

          {/* Intro */}
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mt-8">
            Currently at{" "}
            <a
              href="https://www.zksecurity.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
            >
              zkSecurity
            </a>
            , auditing and breaking cryptographic protocols. I love diving deep into programmable cryptography.
          </p>

          {/* Focus areas */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-base sm:text-lg font-semibold">
            {focus.map((f, i) => (
              <span key={f.label} className="inline-flex items-center gap-3">
                <span className={`bg-gradient-to-r ${f.gradient} bg-clip-text text-transparent`}>{f.label}</span>
                {i < focus.length - 1 && <span className="text-gray-300 dark:text-gray-600">•</span>}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-7 py-3.5 font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:scale-105"
            >
              Read the blog
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white/70 px-7 py-3.5 font-medium text-gray-700 backdrop-blur transition-all duration-200 hover:border-gray-400 hover:scale-105 dark:border-gray-700 dark:bg-white/5 dark:text-gray-200 dark:hover:border-gray-500"
            >
              View portfolio
            </Link>
          </div>

          {/* Socials */}
          <div className="mt-8 flex items-center justify-center gap-6 text-base">
            <a
              href="https://github.com/teddav"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-105"
            >
              <GithubIcon className="w-6 h-6" />
              <span className="font-medium">@teddav</span>
            </a>
            <a
              href="https://twitter.com/0xteddav"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-105"
            >
              <TwitterIcon className="w-6 h-6" />
              <span className="font-medium">@0xteddav</span>
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-xl border border-gray-200 bg-white/60 px-4 py-6 text-center backdrop-blur transition-all duration-200 hover:border-blue-300 hover:scale-105 dark:border-gray-700 dark:bg-white/5 dark:hover:border-blue-500"
            >
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
