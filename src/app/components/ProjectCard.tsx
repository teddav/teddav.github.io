interface ProjectCardProps {
  title: string;
  description: string;
  href: string;
  tags: string[];
  badge?: string;
  details?: React.ReactNode;
}

const randomColor = () => {
  const colors = [
    "bg-red-100 text-red-800",
    "bg-orange-100 text-orange-800",
    "bg-purple-100 text-purple-800",
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-gray-100 text-gray-800",
    "bg-pink-100 text-pink-800",
    "bg-yellow-100 text-yellow-800",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function ProjectCard({ title, description, href, tags, badge, details }: ProjectCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
            {title}
          </a>
          {badge && <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{badge}</span>}
        </h3>
        <div className="flex gap-1 flex-wrap justify-end">
          {tags.map((tag) => (
            <span key={tag} className={`${randomColor()} px-2 py-1 rounded text-xs`}>
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
