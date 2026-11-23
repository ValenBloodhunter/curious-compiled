import { ArrowUpRight } from "lucide-react";
import type { Project } from "../data/projects";

export default function ProjectRow({ project }: { project: Project }) {
  return (
    <article className={`project-row project-${project.visual}`}>
      <a className="project-link" href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name} on GitHub`}>
        <div className="project-visual" aria-hidden="true">
          <svg viewBox="0 0 220 140" fill="none">
            <path className="signal-guide" d="M12 70H208M110 12V128" />
            <path className="signal-path" d="M12 110C55 110 45 30 95 30S142 110 208 40" />
            <path className="signal-secondary" d="M12 95C60 95 55 55 105 55S155 95 208 55" />
            <circle cx="95" cy="30" r="4" /><circle cx="155" cy="78" r="3" />
            <circle cx="110" cy="70" r="48" className="signal-orbit" />
          </svg>
          <span>{project.visual === "warranty" ? "ROUTING / QUALITY" : project.visual === "veil" ? "NOISE / SIGNAL" : project.visual === "skillsetu" ? "VOICE / ACCESS" : "SPACE / CONNECTION"}</span>
        </div>
        <div className="project-title"><p className="project-category">{project.category}</p><h3>{project.name}</h3></div>
        <div className="project-copy"><p className="project-tagline">{project.tagline}</p><p className="project-description">{project.description}</p><ul className="project-stack" aria-label="Technologies">{project.stack.map(tech => <li key={tech}>{tech}</li>)}</ul></div>
        <span className="project-action"><ArrowUpRight size={23} aria-hidden="true" /><span className="sr-only">View project</span></span>
      </a>
    </article>
  );
}
