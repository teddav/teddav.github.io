"use client";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Section({ title, children, className = "" }: SectionProps) {
  return (
    <section className={`mb-12 ${className}`}>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">{title}</h2>
      {children}
    </section>
  );
}
