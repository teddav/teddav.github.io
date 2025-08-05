"use client";

import Link from "next/link";
import Section from "@/lib/components/Section";
import ProjectCard from "@/lib/components/ProjectCard";
import workList from "@/projects";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-20">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Hey, I&apos;m David! 👋</h1>
          <div className="text-2xl text-gray-600 mb-6">
            <span className="font-semibold text-blue-600">Senior developer</span> &{" "}
            <span className="font-semibold text-purple-600">zero-knowledge explorer</span> 🧪
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            I&apos;m obsessed with <span className="font-semibold text-orange-600">security</span> and modern{" "}
            <span className="font-semibold text-green-600">cryptography</span> (ZK, MPC, FHE).
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            I love tinkering with <span className="font-semibold text-red-600">low-level internals</span> and breaking things to understand
            them better.
          </p>
        </div>
      </div>

      <div className="flex justify-center flex-wrap gap-8 text-lg mb-20">
        <a
          href="https://github.com/teddav"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-all duration-200 hover:scale-105"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span className="font-medium">@teddav</span>
        </a>
        <a
          href="https://twitter.com/0xteddav"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-all duration-200 hover:scale-105"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
          <span className="font-medium">@0xteddav</span>
        </a>
      </div>

      <div className="space-y-20">
        <Section title="Writings">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Explore my latest deep dives on cryptography, algebra, zero-knowledge proofs and MPC.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium hover:scale-105"
            >
              Read Articles
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </Section>

        <Section title="Latest Projects">
          <div className="mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              Highlights from my recent work in zero-knowledge proofs and cryptography
            </p>
          </div>
          <div className="space-y-6">
            {workList["Latest projects"].map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
