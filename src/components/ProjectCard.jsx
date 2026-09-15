import { AsciiPanel } from './AsciiPanel.jsx'

export function ProjectCard({ project }) {
  return (
    <article className="project-card reveal">
      <div className="project-card__index">
        <span>{project.number}</span>
        <span>{project.year}</span>
      </div>

      <div className="project-card__body">
        <p className="kicker">{project.type}</p>
        <h3>{project.title}</h3>
        <p className="project-card__summary">{project.summary}</p>
        <ul className="tag-list" aria-label={`${project.title} technologies`}>
          {project.stack.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <div className="project-card__status">
          <span>{project.metric}</span>
          <span>CASE STUDY PENDING ↗</span>
        </div>
      </div>

      <AsciiPanel lines={project.art} label={`Abstract system diagram for ${project.title}`} />
    </article>
  )
}
