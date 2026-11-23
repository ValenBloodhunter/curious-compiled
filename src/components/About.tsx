import SectionHeading from "./SectionHeading";

export default function About() {
  return (
    <section id="about" aria-label="About me" className="page-shell section about-section">
      <SectionHeading title="About Debashis." />
      <div className="about-grid">
        <p className="about-statement">Behind the systems,<br />a very human<br /><em>kind of curious.</em></p>
        <div className="about-copy">
          <p>I'm Debashis, a B.Tech student at SRM University AP. I like difficult problems, elegant algorithms, and the moment an idea starts working.</p>
          <p>Competitive programming is how I sharpen my thinking. Machine learning, software, and hardware are where I put it to use. I learn by making things, breaking them, and coming back with better questions.</p>
          <div className="recognition"><span className="recognition-mark" aria-hidden="true">1st</span><p><strong>Codecraft Track</strong>Codevium 2026 / SRM University AP</p></div>
        </div>
      </div>
      <div className="discipline-strip"><span>Algorithms</span><span>Intelligent systems</span><span>Software experiments</span><span>Always learning</span></div>
    </section>
  );
}
