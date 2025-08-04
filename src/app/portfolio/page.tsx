import Section from "@/lib/components/Section";
import ProjectCard from "@/lib/components/ProjectCard";
import workList from "@/projects";

export default function Portfolio() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Section title="Zero-Knowledge">
        <div className="grid gap-6 md:grid-cols-2">
          {workList.zk.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </Section>

      <Section title="Open Source">
        <div className="space-y-6">
          {workList.open_source.map((audit) => (
            <ProjectCard key={audit.title} {...audit} />
          ))}
        </div>
      </Section>

      <Section title="Other Work">
        <div className="space-y-6">
          {workList.other.map((work) => (
            <ProjectCard key={work.title} {...work} />
          ))}
        </div>
      </Section>
    </div>
  );
}
