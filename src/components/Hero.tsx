import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
} from "lucide-react";
import blackSun from "../assets/black-sun.jpg";
import ronin from "../assets/neural-ronin.jpg";
import Prism from "./Prism";

const scenes = [
  {
    name: "Black Sun",
    image: blackSun,
    alt: "A solitary ronin beneath a red eclipse in a cavern of black glass.",
  },
  {
    name: "Neural Ronin",
    image: ronin,
    alt: "A graphite face threaded with luminous emerald filaments.",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const held = useRef(false);
  const scene = scenes[index];
  const clear = () => window.clearTimeout(timer.current);
  useEffect(() => {
    const reset = () => {
      window.clearTimeout(timer.current);
      setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") reset();
    };
    window.addEventListener("blur", reset);
    window.addEventListener("keydown", escape);
    return () => {
      window.clearTimeout(timer.current);
      window.removeEventListener("blur", reset);
      window.removeEventListener("keydown", escape);
    };
  }, []);
  function next(direction: number) {
    clear();
    setOpen(false);
    setIndex((i) => (i + direction + scenes.length) % scenes.length);
  }
  return (
    <section className="stage" data-open={open} aria-labelledby="intro-title">
      <img
        key={scene.name}
        className="world"
        src={scene.image}
        alt={open ? scene.alt : ""}
      />
      <button
        type="button"
        className="artifact"
        aria-label={`Explore ${scene.name}`}
        aria-pressed={open}
        onPointerDown={(e) => {
          if (!e.isPrimary || e.button !== 0) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          held.current = false;
          clear();
          timer.current = window.setTimeout(() => {
            held.current = true;
            setOpen(true);
          }, 300);
        }}
        onPointerUp={() => {
          clear();
          if (held.current) setOpen(false);
        }}
        onPointerCancel={() => {
          clear();
          held.current = false;
          setOpen(false);
        }}
        onClick={() => {
          if (!held.current) setOpen((v) => !v);
          held.current = false;
        }}
      >
        <img className="prism-fallback" src={scene.image} alt="" />
        <Prism image={scene.image} hidden={open} />
        <span className="hold-label">
          <Fingerprint size={16} /> {open ? "Close scene" : "Hold to explore"}
        </span>
      </button>
      <div className="hero-signature">
        <h1 id="intro-title">
          Curious,
          <br />
          <i>Compiled.</i>
        </h1>
        <p>Debashis Das’s personal portfolio</p>
      </div>
      <div className="scene-picker">
        <span aria-live="polite">{scene.name}</span>
        <div>
          <button onClick={() => next(-1)} aria-label="Previous scene">
            <ChevronLeft />
          </button>
          <small>0{index + 1} / 02</small>
          <button onClick={() => next(1)} aria-label="Next scene">
            <ChevronRight />
          </button>
        </div>
      </div>
      <a className="work-jump" href="#work">
        <ArrowDown size={16} /> Selected work
      </a>
    </section>
  );
}
