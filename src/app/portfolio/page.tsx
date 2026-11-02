import Section from "@/lib/components/Section";
import ProjectCard from "@/lib/components/ProjectCard";
import workList from "@/projects";
import type { Metadata } from "next";
import Audits from "./audits";

export const metadata: Metadata = {
  title: "Portfolio",
};

export default function Portfolio() {
  const sections = Object.keys(workList);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Portfolio</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
          Selected security audits, cryptography projects, and open-source contributions.
        </p>
      </header>

      <Audits />

      {sections.length > 0 &&
        sections.map((section) => (
          <Section key={section} title={section}>
            <div className="space-y-4">
              {workList[section].map((project) => (
                <ProjectCard key={project.title} {...project} />
              ))}
            </div>
          </Section>
        ))}
    </div>
  );
}
