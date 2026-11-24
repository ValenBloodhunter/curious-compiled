import type { Project } from "../data/projects";

type Kind = Project["visual"];
const caption: Record<Kind, string> = {
  warranty: "Query routing",
  veil: "Signal classification",
  skillsetu: "Voice input",
  campusflow: "Campus routing",
};

function traces(kind: Kind) {
  if (kind === "campusflow") {
    return Array.from({ length: 17 }, (_, i) => {
      const x = i * 36 - 60;
      return `M${x},240 l64,-55 0,-36 49,-46 0,-33 107,-92`;
    });
  }
  return Array.from({ length: 38 }, (_, i) => {
    const phase = i / 37;
    const points = Array.from({ length: 91 }, (_, j) => {
      const t = j / 90;
      const x = t * 560;
      let y: number;
      if (kind === "warranty") {
        const spread = 9 + 147 * Math.pow(Math.abs(Math.cos(t * Math.PI)), 1.8);
        y = 112 + 39 * Math.sin(2 * Math.PI * t) + (phase - 0.5) * spread;
      } else if (kind === "veil") {
        const noise =
          Math.sin(t * 77 + phase * 28) * Math.cos(t * 29 - phase * 14);
        y =
          115 +
          (phase - 0.5) * 155 +
          noise * 29 * (1 - t) +
          (t - 0.5) * (i < 19 ? -55 : 55);
      } else {
        const wave = Math.sin(t * 18 - phase * 5) * Math.sin(Math.PI * t) ** 2;
        y = 114 + (phase - 0.5) * 24 + 87 * wave;
      }
      return `${j === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return points.join(" ");
  });
}

const drawings = Object.fromEntries(
  (Object.keys(caption) as Kind[]).map((kind) => [kind, traces(kind)]),
);

export default function ProjectDiagram({ kind }: { kind: Kind }) {
  const drawing: string[] = drawings[kind];
  return (
    <figure className={`project-diagram diagram-${kind}`}>
      <svg
        viewBox="0 0 560 230"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id={`dots-${kind}`}
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r=".85" fill="currentColor" opacity=".24" />
          </pattern>
        </defs>
        <rect width="560" height="230" fill={`url(#dots-${kind})`} />
        <g fill="none" stroke="currentColor" strokeWidth=".8">
          {drawing.map((path, i) => (
            <path key={i} d={path} opacity={0.32 + (i % 6) * 0.1} />
          ))}
        </g>
        <path
          className="trace"
          d={drawing[Math.floor(drawing.length * 0.43)]}
          fill="none"
          stroke="var(--trace)"
          strokeWidth="2.5"
          pathLength="100"
        />
      </svg>
      <figcaption>{caption[kind]}</figcaption>
    </figure>
  );
}
