import SectionHeading from "./SectionHeading";

const explorations = [
  { title: "Thinking in algorithms", tag: "COMPUTATION", description: "Contests, data structures, and the mathematics of doing more with less." },
  { title: "From models to systems", tag: "INTELLIGENCE", description: "Finding out where machine learning becomes useful outside the notebook." },
  { title: "Code meets the physical", tag: "HARDWARE", description: "Microcontrollers, control systems, and the feedback loop between software and the world." },
];

export default function Explorations() {
  return (
    <section id="lab" aria-label="Current explorations" className="page-shell section">
      <SectionHeading title="Experiments." />
      <div className="exploration-list">{explorations.map(item => (
        <article className="exploration" key={item.title}><span className="exploration-tag">{item.tag}</span><h3>{item.title}</h3><p>{item.description}</p></article>
      ))}</div>
    </section>
  );
}
