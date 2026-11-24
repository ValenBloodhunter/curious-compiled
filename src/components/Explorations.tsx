const notes = [
  [
    "Algorithms",
    "How much work can a better data structure save? Contests are where I practice making that trade-off under a clock.",
  ],
  [
    "Machine learning",
    "I’m interested in what happens after the notebook. A model has to handle noisy input, run on a budget, and give people a useful answer.",
  ],
  [
    "Physical computing",
    "Microcontrollers and control systems take code off the screen. Timing, sensors, and feedback make the problem tangible.",
  ],
];

export default function Explorations() {
  return (
    <section id="lab" aria-labelledby="lab-heading" className="shell notes">
      <h2 id="lab-heading">
        Field <em>notes.</em>
      </h2>
      <div className="note-list">
        {notes.map(([title, body]) => (
          <article key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
