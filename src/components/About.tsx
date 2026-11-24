import landscape from "../assets/lynx-valley.webp";
import { portfolio } from "../data/portfolio";

export default function About() {
  const { bio, recognition } = portfolio.about;
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
          {bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="recognition">
            <strong>{recognition.place}</strong>
            <span>
              {recognition.track}
              <br />
              <small>{recognition.event}</small>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
