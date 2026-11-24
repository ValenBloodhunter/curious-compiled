import { ArrowUpRight, Plus } from "lucide-react";
import type { Project } from "../data/projects";
import ProjectDiagram from "./ProjectDiagram";

export default function ProjectRow({
  project,
  first,
}: {
  project: Project;
  first: boolean;
}) {
  return (
    <details name="work-index" className="project-row" open={first}>
      <summary>
        <h3>{project.name}</h3>
        <span className="project-category">
          {project.category.toLowerCase()}
        </span>
        <Plus aria-hidden="true" />
      </summary>
      <div className="project-content">
        <ProjectDiagram kind={project.visual} />
        <div className="project-copy">
          <p className="project-tagline">{project.tagline}</p>
          <p>{project.description}</p>
          <ul className="project-stack" aria-label="Technologies">
            {project.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <a
            className="text-link project-link"
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.name} on GitHub`}
          >
            View repository <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </details>
  );
}
