import type { Project } from "../data/projects";

export default function ProjectRow({ project }: { project: Project }) {
  return (
    <article className="project-row">
      <a className="project-link" href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name} on GitHub`}>
        <div>
          <h3>{project.name}</h3>
          <p className="project-category">{project.category}</p>
        </div>
        <div>
          <p className="project-tagline">{project.tagline}</p>
          <p className="project-description">{project.description}</p>
          <ul className="project-stack" aria-label="Technologies">
            {project.stack.map((tech) => <li key={tech}>{tech}</li>)}
          </ul>
          <span className="project-action">View project</span>
        </div>
      </a>
    </article>
  );
}
