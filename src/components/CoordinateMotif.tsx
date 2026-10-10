
import type { PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

export default function CoordinateMotif() {
  const reduceMotion = useReducedMotion();

  // Default position is deliberately off-center.
  const pointX = useMotionValue(240);
  const pointY = useMotionValue(127);

  const springConfig = {
    stiffness: 110,
    damping: 18,
    mass: 0.6,
  };

  const smoothX = useSpring(pointX, springConfig);
  const smoothY = useSpring(pointY, springConfig);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;

    const rect = event.currentTarget.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    // Small, controlled movement. Not a cursor follower.
    pointX.set(240 + (x - 0.5) * 35);
    pointY.set(127 + (y - 0.5) * 35);
  }

  function resetPoint() {
    pointX.set(240);
    pointY.set(127);
  }

  return (
    <div
      className="relative w-full max-w-[420px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPoint}
    >
      <div className="mb-4 flex items-center justify-between font-mono text-[10px] tracking-[0.15em] text-muted">
        <span>FIG. 001</span>
        <span>COORDINATE STUDY</span>
      </div>

      <svg
        viewBox="0 0 420 320"
        className="h-auto w-full"
        role="img"
        aria-label="A coordinate diagram with a point that gently responds to mouse movement"
      >
        {/* Outer framing details */}
        <path
          d="M 20 35 V 15 H 40"
          stroke="var(--line)"
          strokeWidth="1"
          fill="none"
        />

        <path
          d="M 380 15 H 400 V 35"
          stroke="var(--line)"
          strokeWidth="1"
          fill="none"
        />

        <path
          d="M 20 285 V 305 H 40"
          stroke="var(--line)"
          strokeWidth="1"
          fill="none"
        />

        <path
          d="M 380 305 H 400 V 285"
          stroke="var(--line)"
          strokeWidth="1"
          fill="none"
        />

        {/* Horizontal and vertical axes */}
        <line
          x1="55"
          y1="155"
          x2="365"
          y2="155"
          stroke="var(--line)"
          strokeWidth="1"
        />

        <line
          x1="210"
          y1="25"
          x2="210"
          y2="285"
          stroke="var(--line)"
          strokeWidth="1"
        />

        {/* Circular coordinate boundaries */}
        <circle
          cx="210"
          cy="155"
          r="104"
          stroke="var(--muted)"
          strokeOpacity="0.55"
          strokeWidth="1"
          fill="none"
        />

        <circle
          cx="210"
          cy="155"
          r="68"
          stroke="var(--line)"
          strokeWidth="1"
          strokeDasharray="3 8"
          fill="none"
        />

        {/* Center origin */}
        <circle
          cx="210"
          cy="155"
          r="3"
          fill="var(--muted)"
        />

        {/* Measurement marks */}
        {[106, 158, 262, 314].map((x) => (
          <line
            key={x}
            x1={x}
            y1="150"
            x2={x}
            y2="160"
            stroke="var(--muted)"
            strokeOpacity="0.6"
          />
        ))}

        {/* Interactive point */}
        <motion.circle
          cx={smoothX}
          cy={smoothY}
          r="13"
          fill="var(--accent)"
          fillOpacity="0.12"
        />

        <motion.circle
          cx={smoothX}
          cy={smoothY}
          r="4.5"
          fill="var(--accent)"
        />

        {/* Technical labels */}
        <g
          fill="var(--muted)"
          fontFamily="'IBM Plex Mono', monospace"
          fontSize="10"
        >
          <text x="370" y="159">X</text>
          <text x="214" y="22">Y</text>
          <text x="217" y="170">0</text>
          <text x="30" y="298">REF / 001</text>
          <text x="318" y="298">SYS / ACTIVE</text>
        </g>
      </svg>

      <div className="mt-1 flex items-center justify-between border-t border-line pt-4 font-mono text-[10px] tracking-widest text-muted">
        <span>INPUT → OUTPUT</span>
        <span className="text-accent">●</span>
      </div>
    </div>
  );
}
