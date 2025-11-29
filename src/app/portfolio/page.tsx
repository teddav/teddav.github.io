import Section from "@/lib/components/Section";
import ProjectCard from "@/lib/components/ProjectCard";
import workList from "@/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
};

export default function Portfolio() {
  const sections = Object.keys(workList);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <p className="mb-6">
        Not really a &quot;portfolio&quot; or a CV, more of a list of things I&apos;ve been working on lately...
        <br />
        Enjoy 😊
      </p>

      {sections.length > 0 &&
        sections.map((section) => (
          <Section key={section} title={section}>
            <div className="space-y-6">
              {workList[section].map((project) => (
                <ProjectCard key={project.title} {...project} />
              ))}
            </div>
          </Section>
        ))}
    </div>
  );
}
