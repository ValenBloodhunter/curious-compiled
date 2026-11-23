import SectionHeading from "./SectionHeading";

export default function About() {
  return (
    <section id="about" aria-label="About me" className="page-shell section">
      <SectionHeading title="A little about me" />
      <div className="about-grid">
        <div className="about-copy">
          <p>I'm a B.Tech student at SRM University AP who enjoys the space between a hard problem and a working solution.</p>
          <p>Competitive programming sharpens how I think. Machine learning and software projects let me turn that thinking into something people can use.</p>
          <p>I'm interested in systems that are elegant under the hood and effortless on the surface. I learn by building, testing, breaking things, and doing them better the next time.</p>
        </div>
        <div>
          <div className="interests">
            <h3>Drawn to</h3>
            <ul>
              <li>Algorithms & problem solving</li>
              <li>Machine learning & AI</li>
              <li>Software & experiments</li>
            </ul>
          </div>
          <div className="recognition">
            <h3>A recent highlight</h3>
            <p><strong>1st place, Codecraft Track</strong>Codevium 2026<br />SRM University AP</p>
          </div>
        </div>
      </div>
    </section>
  );
}
