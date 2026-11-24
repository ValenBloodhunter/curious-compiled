import { useState } from "react";
import { ArrowDown, Aperture, ScanEye } from "lucide-react";
import LynxScene from "./LynxScene";
import { portfolio } from "../data/portfolio";

export default function Hero() {
  const [thermal, setThermal] = useState(false);
  const { title, intro } = portfolio.hero;
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
          {title[0]}
          <br />
          <em>{title[1]}</em>
        </h1>
        <p>{intro}</p>
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
