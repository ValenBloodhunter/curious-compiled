import SectionHeading from "./SectionHeading";

const explorations = [
  { title: "Algorithms", description: "Getting better at problem solving, one contest at a time. Exploring algorithms, data structures, and the mathematics behind efficient solutions." },
  { title: "Intelligent systems", description: "Exploring what useful machine learning actually looks like. From understanding models to building systems that make intelligent decisions." },
  { title: "Hardware & systems", description: "Experimenting with the connection between code and the physical world. Curious about microcontrollers, control systems, and robotics." },
];

export default function Explorations() {
  return (
    <section id="lab" aria-label="Current explorations" className="page-shell section">
      <SectionHeading title="Currently exploring" />
      <div className="exploration-list">
        {explorations.map((item) => (
          <div className="exploration" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
