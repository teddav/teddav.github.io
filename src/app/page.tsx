"use client";

import Link from "next/link";
import Section from "@/lib/components/Section";
import ProjectCard from "@/lib/components/ProjectCard";
import workList from "@/projects";
import { GithubIcon, TwitterIcon } from "@/lib/components/Icons";

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
            I&apos;m obsessed with <span className="font-semibold text-orange-600">security</span> and{" "}
            <span className="font-semibold text-green-600">modern cryptography</span> (ZK, MPC, FHE).
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
          <GithubIcon className="w-7 h-7" />
          <span className="font-medium">@teddav</span>
        </a>
        <a
          href="https://twitter.com/0xteddav"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-all duration-200 hover:scale-105"
        >
          <TwitterIcon className="w-7 h-7" />
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
