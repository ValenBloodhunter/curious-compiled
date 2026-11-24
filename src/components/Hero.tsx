import { useState } from "react";
import { ArrowDown, Aperture, ScanEye } from "lucide-react";
import LynxScene from "./LynxScene";

export default function Hero() {
  const [thermal, setThermal] = useState(false);
  return (
    <section
      className="stage"
      aria-labelledby="intro-title"
      data-thermal={thermal}
    >
      <LynxScene thermal={thermal} />
      <div className="stage-shade" aria-hidden="true" />
      <div className="hero-copy">
        <h1 id="intro-title">
          Curious,
          <br />
          <em>Compiled.</em>
        </h1>
        <p>
          I'm Debashis Das. I build software and explore how machines learn.
        </p>
        <a className="explore-button" href="#work">
          <ArrowDown size={17} /> Explore my work
        </a>
      </div>
      <div className="scene-console">
        <div className="scene-name">
          <ScanEye size={19} aria-hidden="true" />
          <span>
            Ghost Lynx<small className="gesture-hint">Drag the portrait</small>
          </span>
        </div>
        <div className="lens-control" role="group" aria-label="Lynx vision">
          <Aperture size={15} aria-hidden="true" />
          <button
            type="button"
            aria-pressed={!thermal}
            onClick={() => setThermal(false)}
          >
            Optical
          </button>
          <button
            type="button"
            aria-pressed={thermal}
            onClick={() => setThermal(true)}
          >
            Thermal
          </button>
        </div>
      </div>
    </section>
  );
}
