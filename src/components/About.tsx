import landscape from "../assets/lynx-valley.webp";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="about">
      <div className="valley">
        <img
          src={landscape}
          width="1921"
          height="819"
          loading="lazy"
          alt="The Ghost Lynx stands on a snowy ridge above a valley of abandoned transmission towers."
        />
      </div>
      <div className="shell biography">
        <h2 id="about-heading">
          About
          <br />
          <em>Debashis.</em>
        </h2>
        <div className="bio-copy">
          <p>
            I’m a B.Tech student at SRM University AP. Competitive programming
            taught me to look for the simplest idea that makes a hard problem
            click.
          </p>
          <p>
            I take that habit into machine learning, software, and hardware. I
            like building something small enough to test, seeing where it
            breaks, and trying again.
          </p>
          <div className="recognition">
            <strong>1st</strong>
            <span>
              Codecraft Track
              <br />
              <small>Codevium 2026 · SRM University AP</small>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
