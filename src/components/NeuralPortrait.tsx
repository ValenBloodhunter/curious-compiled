import { useEffect, useRef } from "react";
import portrait from "../assets/neural-ronin.jpg";

export default function NeuralPortrait() {
  const scene = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = scene.current;
    const field = canvas.current;
    const context = field?.getContext("2d");
    if (!element || !field || !context) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    let frame = 0;
    let last = 0;
    let elapsed = 0;
    let x = 0;
    let y = 0;
    const dots = Array.from({ length: 90 }, (_, i) => ({
      angle: i * 2.39996,
      radius: 0.28 + (i % 19) / 85,
      speed: 0.02 + (i % 7) * 0.003,
      size: i % 5 === 0 ? 1.4 : 0.7,
    }));

    function draw(now: number) {
      frame = 0;
      if (!context || !field || !element) return;
      if (visible && !document.hidden) {
        if (last && !reduced.matches) elapsed += Math.min(now - last, 50) / 1000;
        const { width, height } = element.getBoundingClientRect();
        const dpr = Math.min(devicePixelRatio, 2);
        if (field.width !== Math.round(width * dpr) || field.height !== Math.round(height * dpr)) {
          field.width = Math.round(width * dpr);
          field.height = Math.round(height * dpr);
        }
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.clearRect(0, 0, width, height);
        const points = dots.map(dot => {
          const angle = dot.angle + elapsed * dot.speed;
          return { x: width * (0.5 + Math.cos(angle) * dot.radius * 0.58) + x * 18, y: height * (0.49 + Math.sin(angle) * dot.radius) + y * 12 };
        });
        points.forEach((point, i) => {
          const next = points[(i + 13) % points.length];
          if (Math.hypot(point.x - next.x, point.y - next.y) < 72) {
            context.strokeStyle = "rgba(132,238,176,0.12)";
            context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(next.x, next.y); context.stroke();
          }
          context.fillStyle = `rgba(163,255,191,${0.25 + (Math.sin(elapsed * 0.5 + i) + 1) * 0.2})`;
          context.beginPath(); context.arc(point.x, point.y, dots[i].size, 0, Math.PI * 2); context.fill();
        });
      }
      last = visible && !document.hidden ? now : 0;
      if (!reduced.matches && visible && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function start() {
      if (!frame) frame = requestAnimationFrame(draw);
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); else last = 0; });
    observer.observe(element);
    const move = (event: PointerEvent) => {
      if (reduced.matches || event.pointerType !== "mouse") return;
      x = event.clientX / innerWidth - 0.5;
      y = event.clientY / innerHeight - 0.5;
      element.style.setProperty("--portrait-x", `${x * 9}px`);
      element.style.setProperty("--portrait-y", `${y * 6}px`);
    };
    const reset = () => { x = 0; y = 0; element.style.setProperty("--portrait-x", "0px"); element.style.setProperty("--portrait-y", "0px"); };
    const preference = () => { reset(); start(); };
    const resize = () => start();
    window.addEventListener("pointermove", move);
    window.addEventListener("resize", resize);
    document.documentElement.addEventListener("pointerleave", reset);
    document.addEventListener("visibilitychange", start);
    reduced.addEventListener("change", preference);
    start();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", resize);
      document.documentElement.removeEventListener("pointerleave", reset);
      document.removeEventListener("visibilitychange", start);
      reduced.removeEventListener("change", preference);
    };
  }, []);

  return (
    <div className="neural-scene" ref={scene}>
      <img className="neural-portrait" src={portrait} width="1086" height="1448" fetchPriority="high" alt="An imagined dark-haired ronin with emerald neural filaments tracing his face and shoulders." />
      <canvas ref={canvas} aria-hidden="true" />
      <span className="portrait-caption">NEURAL RONIN / DIGITAL CHARACTER STUDY</span>
    </div>
  );
}
