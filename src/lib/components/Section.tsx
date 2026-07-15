"use client";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Section({ title, children, className = "" }: SectionProps) {
  return (
    <section className={`mb-16 ${className}`}>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">{title}</h2>
      {children}
    </section>
  );
}
