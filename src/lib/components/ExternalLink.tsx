"use client";

export const ExternalLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className ? className : "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 hover:underline"}
    >
      {children}
    </a>
  );
};
