import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import warrior from "../assets/ice-warrior.jpg";

const columns = 80;
const rows = 60;
const glyphs = " .:-=+*#%@";

export default function AsciiPortrait() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const time = useRef(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const image = new Image();
    let interval: number | undefined;
    let disposed = false;

    image.onload = () => {
      if (disposed) return;
      const sample = document.createElement("canvas");
      sample.width = columns;
      sample.height = rows;
      const sampling = sample.getContext("2d", { willReadFrequently: true });
      if (!sampling) return;
      sampling.drawImage(image, 0, 0, columns, rows);
      const pixels = sampling.getImageData(0, 0, columns, rows).data;

      const draw = () => {
        context.clearRect(0, 0, element.width, element.height);
        context.font = "12px monospace";
        context.textBaseline = "top";
        const scan = (time.current * 7) % (rows + 16) - 8;
        context.save();
        context.beginPath();
        context.rect(0, (scan - 3) * 14, element.width, 84);
        context.clip();
        context.globalAlpha = 0.32;
        context.drawImage(image, 0, 0, element.width, element.height);
        context.restore();
        for (let y = 0; y < rows; y++) {
          const reveal = Math.exp(-((y - scan) ** 2) / 24);
          for (let x = 0; x < columns; x++) {
            const offset = (y * columns + x) * 4;
            const r = pixels[offset], g = pixels[offset + 1], b = pixels[offset + 2];
            const luminance = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;
            const character = glyphs[Math.min(glyphs.length - 1, Math.floor(luminance * glyphs.length))];
            context.fillStyle = `rgba(${r},${g},${b},${0.55 + reveal * 0.45})`;
            context.fillText(character, x * 8, y * 14);
          }
        }
      };

      draw();
      if (paused || reducedMotion) return;
      interval = window.setInterval(() => {
        if (document.hidden) return;
        const bounds = element.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
        time.current += 0.08;
        draw();
      }, 80);
    };
    image.src = warrior;
    return () => {
      disposed = true;
      window.clearInterval(interval);
    };
  }, [paused, reducedMotion]);

  return (
    <figure className="hero-art portrait-art">
      <div className="portrait-frame">
        <img src={warrior} alt="An icy blue warrior with white hair holding a sword, rendered with colored ASCII characters." width="720" height="960" />
        <canvas ref={canvas} width={640} height={840} aria-hidden="true" />
      </div>
      <figcaption>
        <span>Somewhere between pixels & poetry.</span>
        {!reducedMotion && (
          <button type="button" onClick={() => setPaused(!paused)}>
            {paused ? "Play animation" : "Pause animation"}
          </button>
        )}
      </figcaption>
    </figure>
  );
}
