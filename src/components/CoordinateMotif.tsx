import { useState, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

export default function CoordinateMotif() {
  const reduced = useReducedMotion();
  const [engaged, setEngaged] = useState(false);
  const x = useMotionValue(253);
  const y = useMotionValue(139);
  const sx = useSpring(x, { stiffness: 105, damping: 18, mass: .65 });
  const sy = useSpring(y, { stiffness: 105, damping: 18, mass: .65 });

  function move(event: PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const fx = (event.clientX - rect.left) / rect.width;
    const fy = (event.clientY - rect.top) / rect.height;
    x.set(253 + (fx - .5) * 46);
    y.set(139 + (fy - .5) * 46);
  }
  function leave() {
    x.set(253);
    y.set(139);
    setEngaged(false);
  }

  return (
    <div className="instrument-panel max-w-[480px] p-4 sm:p-5 lg:ml-auto" onPointerMove={move} onPointerEnter={(e) => { if (e.pointerType === "mouse" && !reduced) setEngaged(true); }} onPointerLeave={leave}>
      <div className="flex items-center justify-between border-b border-line/70 pb-4 font-mono text-[9px] tracking-[.16em] text-muted sm:text-[10px]">
        <span><span className="mr-2 text-accent">✳</span> MOTION STUDY / 001</span>
        <span>SYS: ACTIVE</span>
      </div>
      <svg viewBox="0 0 420 360" className="h-auto w-full" role="img" aria-label="Interactive engineering coordinate diagram with a glowing point that moves slightly toward the cursor">
        <defs>
          <linearGradient id="orbit-gradient" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#90f4e2"/><stop offset=".55" stopColor="#7dbeff"/><stop offset="1" stopColor="#b9a4ff"/></linearGradient>
          <radialGradient id="point-aura"><stop stopColor="#86f4da" stopOpacity=".3"/><stop offset="1" stopColor="#86f4da" stopOpacity="0"/></radialGradient>
        </defs>
        <g stroke="#384862" strokeWidth="1" opacity=".85">
          <path d="M20 35V20H35 M385 20H400V35 M20 325V340H35 M385 340H400V325" fill="none"/>
          <line x1="43" y1="185" x2="378" y2="185" />
          <line x1="210" y1="17" x2="210" y2="345" />
          <line x1="92" y1="67" x2="328" y2="303" strokeDasharray="4 11" opacity=".45" />
          <line x1="328" y1="67" x2="92" y2="303" strokeDasharray="4 11" opacity=".45" />
        </g>
        <circle cx="210" cy="185" r="124" stroke="url(#orbit-gradient)" strokeOpacity=".65" strokeWidth="1.2" fill="none" />
        <circle cx="210" cy="185" r="91" stroke="#4a6280" strokeOpacity=".4" strokeWidth="1" fill="none" strokeDasharray="2 9" />
        <g className="orbit-spin" style={reduced ? { animation: "none" } : undefined}>
          <circle cx="210" cy="185" r="111" stroke="#b4a9ff" strokeOpacity=".5" fill="none" strokeDasharray="4 14" />
          <circle cx="210" cy="74" r="2.5" fill="#bba7ff" />
        </g>
        <circle cx="210" cy="185" r="3" fill="#77879d" />
        <g stroke="#58687f" strokeWidth="1">
          <path d="M210 53v17 M210 300v17 M78 185h17 M325 185h17"/>
        </g>
        <motion.line x1="210" y1="185" x2={sx} y2={sy} stroke="#8af4dd" strokeOpacity=".52" strokeWidth="1" strokeDasharray="3 6" />
        <motion.circle cx={sx} cy={sy} r="30" fill="url(#point-aura)" />
        <motion.circle className="coordinate-pulse" cx={sx} cy={sy} r="13" fill="none" stroke="#8af4dd" strokeOpacity=".8" strokeWidth="1" />
        <motion.circle cx={sx} cy={sy} r="4.5" fill="#a3fce8" />
        <g fill="#95aac8" fontFamily="'IBM Plex Mono',monospace" fontSize="10" letterSpacing="1.1">
          <text x="378" y="179">X</text><text x="219" y="23">Y</text><text x="218" y="199">0</text>
          <text x="38" y="340">REF / E-001</text><text x="319" y="340">R / 124</text>
        </g>
      </svg>
      <div className="flex items-center justify-between border-t border-line/70 pt-4 font-mono text-[9px] tracking-[.13em] text-muted sm:text-[10px]">
        <span>INPUT <span className="text-accent">↗</span> EXPERIMENT</span>
        <span className="text-accent">{engaged ? "POINTER ENGAGED" : "AT REST"}</span>
      </div>
    </div>
  );
}
