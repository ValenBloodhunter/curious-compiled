import { useEffect, useRef } from "react";
import warrior from "../assets/ice-warrior.jpg";

const columns = 80;
const rows = 60;
const glyphs = " .:-=+*#%@";

export default function AsciiPortrait() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const image = new Image();
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

      context.clearRect(0, 0, element.width, element.height);
      context.font = "12px monospace";
      context.textBaseline = "top";
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          const offset = (y * columns + x) * 4;
          const r = pixels[offset], g = pixels[offset + 1], b = pixels[offset + 2];
          const luminance = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;
          const character = glyphs[Math.min(glyphs.length - 1, Math.floor(luminance * glyphs.length))];
          context.fillStyle = `rgb(${r},${g},${b})`;
          context.fillText(character, x * 8, y * 14);
        }
      }
    };
    image.src = warrior;
    return () => {
      disposed = true;
    };
  }, []);

  return (
    <figure className="hero-art portrait-art">
      <div className="portrait-frame">
        <img src={warrior} alt="An icy blue warrior with white hair holding a sword, rendered with colored ASCII characters." width="720" height="960" />
        <canvas ref={canvas} width={640} height={840} aria-hidden="true" />
      </div>
      <figcaption>
        <span>Somewhere between pixels & poetry.</span>
      </figcaption>
    </figure>
  );
}
