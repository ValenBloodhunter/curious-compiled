import { profile } from "../data/profile";

export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="page-shell hero">
      <p className="hero-intro">Independent builder. Always a student.</p>
      <h1 id="hero-heading">Curiosity,<br />put to work.</h1>
      <p className="hero-description">
        I like hard problems and making things work.
        Exploring algorithms, intelligent systems, and the space between an idea and something useful.
      </p>
      <div className="hero-links">
        <a className="text-link" href="#work">Selected work</a>
        <a className="text-link" href={profile.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </section>
  );
}
