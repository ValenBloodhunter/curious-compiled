import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { renderBlackHole } from "./renderBlackHole";

const stillFrame = renderBlackHole(0);

export default function AsciiBlackHole() {
  const art = useRef<HTMLPreElement>(null);
  const time = useRef(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (paused || reducedMotion) return;
    const interval = window.setInterval(() => {
      const element = art.current;
      if (!element || document.hidden) return;
      const bounds = element.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
      time.current += 0.05;
      element.textContent = renderBlackHole(time.current);
    }, 50);
    return () => window.clearInterval(interval);
  }, [paused, reducedMotion]);

  return (
    <figure className="hero-art">
      <pre ref={art} aria-hidden="true">{stillFrame}</pre>
      <figcaption>
        <span>Event horizon</span>
        {!reducedMotion && (
          <button type="button" onClick={() => setPaused(!paused)}>
            {paused ? "Play animation" : "Pause animation"}
          </button>
        )}
      </figcaption>
    </figure>
  );
}
