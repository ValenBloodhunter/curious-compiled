import { useEffect, useRef } from "react";

// Staggered rings give the stone an asymmetric cut and a silhouette that changes as it turns.
const rings = [
  [-1.12, 0.03, 0.27],
  [-0.68, 0.39, 0.14],
  [-0.18, 0.76, -0.04],
  [0.35, 0.72, -0.12],
  [0.78, 0.47, -0.11],
  [0.97, 0.12, -0.14],
];
const sides = 9;
const vertices = rings.flatMap(([y, radius, offset], row) =>
  Array.from({ length: sides }, (_, i) => {
    const angle = (i * 2 * Math.PI) / sides + row * 0.28;
    const r = radius * (1 + 0.12 * Math.sin(i * 4 + row));
    return [
      offset + Math.cos(angle) * r,
      y + 0.07 * radius * Math.sin(i * 3),
      Math.sin(angle) * r,
    ];
  }),
);
const faces = rings.slice(1).flatMap((_, row) =>
  Array.from({ length: sides }, (_, i) => {
    const a = row * sides + i,
      b = row * sides + ((i + 1) % sides);
    return [
      [a, b, a + sides],
      [b, b + sides, a + sides],
    ];
  }).flat(),
);

export default function Prism({
  image,
  hidden,
}: {
  image: string;
  hidden: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || hidden) return;
    const texture = new Image();
    const reflectionMap = document.createElement("canvas");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let request = 0,
      last = 0,
      angle = 0.35,
      tilt = 0,
      target = 0;
    let visible = false;
    const draw = (now: number) => {
      request = 0;
      if (!visible || document.hidden) {
        last = 0;
        return;
      }
      if (!reduced.matches && last && now - last < 32) {
        request = requestAnimationFrame(draw);
        return;
      }
      if (!reduced.matches && last) angle += Math.min(80, now - last) * 0.00019;
      last = now;
      tilt += (target - tilt) * 0.12;
      const size = canvas.width,
        scale = size * 0.44;
      const points = vertices.map(([x, y, z]) => {
        const t = angle + (reduced.matches ? 0 : tilt);
        const xx = x * Math.cos(t) - z * Math.sin(t),
          zz = x * Math.sin(t) + z * Math.cos(t);
        return [
          size / 2 + (xx - y * 0.1) * scale,
          size / 2 + (y + zz * 0.1) * scale,
          zz,
        ];
      });
      ctx.clearRect(0, 0, size, size);
      const sorted = faces
        .map((face, i) => ({
          face,
          i,
          z: face.reduce((sum, n) => sum + points[n][2], 0),
        }))
        .sort((a, b) => a.z - b.z);
      for (const { face, i } of sorted) {
        const [a, b, c] = face.map((n) => points[n]);
        const nx =
          (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]);
        const nz =
          ((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) /
          scale;
        const reflection = Math.pow(
          Math.abs(Math.sin(Math.atan2(nx, nz) + 0.5)),
          12,
        );
        const metal = 13 + Math.round(reflection * 150 + (i % 5) * 3);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.lineTo(c[0], c[1]);
        ctx.closePath();
        const light = ctx.createLinearGradient(a[0], a[1], c[0], c[1]);
        light.addColorStop(0, `rgb(${metal + 12},${metal + 10},${metal + 10})`);
        light.addColorStop(0.5, `rgb(${metal},${metal},${metal + 3})`);
        light.addColorStop(
          1,
          `rgb(${metal * 0.3},${metal * 0.3},${metal * 0.36})`,
        );
        ctx.fillStyle = light;
        ctx.fill();
        ctx.clip();
        if (reflectionMap.width && i % 4 !== 1) {
          ctx.globalAlpha = 0.3 + reflection * 0.4;
          ctx.globalCompositeOperation = "screen";
          const shift = Math.sin(angle + i) * size * 0.28;
          ctx.drawImage(
            reflectionMap,
            -size * 0.22 + shift,
            -size * 0.05 + (i % 4) * size * 0.06,
            size * 1.4,
            size,
          );
        }
        ctx.restore();
      }
      canvas.dataset.drawn = "true";
      if (!reduced.matches) request = requestAnimationFrame(draw);
    };
    const start = () => {
      if (!request && visible && !document.hidden)
        request = requestAnimationFrame(draw);
    };
    const resize = new ResizeObserver(() => {
      canvas.width = canvas.height = Math.round(
        canvas.clientWidth * Math.min(2, devicePixelRatio),
      );
      start();
    });
    resize.observe(canvas);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      last = 0;
      start();
    });
    observer.observe(canvas);
    const move = (e: PointerEvent) => {
      target = (e.clientX / innerWidth - 0.5) * 0.8;
    };
    window.addEventListener("pointermove", move);
    document.addEventListener("visibilitychange", start);
    reduced.addEventListener("change", start);
    reflectionMap.width = 0;
    texture.onload = () => {
      reflectionMap.width = 400;
      reflectionMap.height = Math.round(
        (400 * texture.naturalHeight) / texture.naturalWidth,
      );
      reflectionMap
        .getContext("2d")
        ?.drawImage(texture, 0, 0, reflectionMap.width, reflectionMap.height);
      start();
    };
    texture.src = image;
    return () => {
      cancelAnimationFrame(request);
      resize.disconnect();
      observer.disconnect();
      texture.onload = null;
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", start);
      reduced.removeEventListener("change", start);
    };
  }, [image, hidden]);
  return <canvas className="prism" ref={ref} aria-hidden="true" />;
}
