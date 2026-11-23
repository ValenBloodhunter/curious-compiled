import { ArrowUpRight } from "lucide-react";
import type { Project } from "../data/projects";

export default function ProjectRow({ project }: { project: Project }) {
  return (
    <article className={`project-row project-${project.visual}`}>
      <a className="project-link" href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name} on GitHub`}>
        <div className="project-title"><p className="project-category">{project.category}</p><h3>{project.name}</h3></div>
        <div className="project-copy"><p className="project-tagline">{project.tagline}</p><p className="project-description">{project.description}</p><ul className="project-stack" aria-label="Technologies">{project.stack.map(tech => <li key={tech}>{tech}</li>)}</ul></div>
        <span className="project-action"><ArrowUpRight size={23} aria-hidden="true" /><span className="sr-only">View project</span></span>
      </a>
    </article>
  );
}
