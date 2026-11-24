import { useEffect, useRef } from "react";
import imageUrl from "../assets/ghost-lynx.webp";
import {
  createLynxRenderer,
  type LynxMotion,
  type Point,
} from "./lynxRenderer";

function follow(current: Point, target: Point, amount: number) {
  current.x += (target.x - current.x) * amount;
  current.y += (target.y - current.y) * amount;
}

export default function LynxScene({ thermal }: { thermal: boolean }) {
  const surface = useRef<HTMLCanvasElement>(null);
  const poster = useRef<HTMLImageElement>(null);
  const lens = useRef(0);
  useEffect(() => {
    lens.current = thermal ? 1 : 0;
  }, [thermal]);

  useEffect(() => {
    const canvas = surface.current!;
    const image = poster.current!;
    const stage = canvas.closest("section")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const position = { x: 0.5, y: 0.5 };
    const pose: LynxMotion = {
      seconds: 0,
      travel: 0,
      thermal: lens.current,
      tapAge: 1,
      look: { x: 0, y: 0 },
      front: { ...position },
      mid: { ...position },
      end: { ...position },
      touch: { ...position },
    };
    const lookTarget = { ...pose.look };
    let renderer: ReturnType<typeof createLynxRenderer>;
    let width = 0,
      height = 0,
      left = 0,
      top = 0;
    let desiredProgress = 0;
    let frame = 0,
      previous: number | undefined;
    let visible = false,
      tracking = false;

    function draw(now: number) {
      // Resume with zero delta so returning to the tab doesn't advance the scene in one jump.
      const dt =
        previous === undefined ? 0 : Math.min((now - previous) / 1000, 0.1);
      previous = now;
      pose.seconds += dt;
      pose.tapAge = Math.min(1, pose.tapAge + dt);
      const ease = (rate: number) => -Math.expm1(-rate * dt);
      follow(pose.look, lookTarget, ease(7));
      follow(pose.front, position, ease(28));
      follow(pose.mid, pose.front, ease(9));
      follow(pose.end, pose.mid, ease(4.5));
      pose.travel += (desiredProgress - pose.travel) * ease(10);
      pose.thermal += (lens.current - pose.thermal) * ease(8);
      if (renderer) {
        renderer.draw(pose);
        if (!canvas.dataset.ready) canvas.dataset.ready = "true";
      } else {
        const x = 1.35 * pose.look.x + 0.34 * Math.sin(pose.seconds * 0.79);
        const y = 0.85 * pose.look.y + 0.42 * Math.sin(pose.seconds * 1.48);
        image.style.transform = `translate3d(${x}%, ${y}%, 0) scale(${1.04 + 0.12 * pose.travel})`;
      }
      frame = requestAnimationFrame(draw);
    }
    function schedule() {
      cancelAnimationFrame(frame);
      previous = undefined;
      if (
        visible &&
        !document.hidden &&
        !reduced.matches &&
        image.naturalWidth
      ) {
        frame = requestAnimationFrame(draw);
      }
    }
    function layout() {
      const stageBox = stage.getBoundingClientRect();
      const box = image.parentElement!.getBoundingClientRect();
      left = box.left;
      top = box.top;
      desiredProgress = Math.min(
        1,
        Math.max(0, -stageBox.top / stageBox.height),
      );
      if (width !== box.width || height !== box.height) {
        width = box.width;
        height = box.height;
        if (width && height) renderer?.resize(width, height);
      }
    }
    function releaseRenderer() {
      renderer?.dispose();
      renderer = undefined;
      delete canvas.dataset.ready;
    }
    function start() {
      if (reduced.matches) {
        releaseRenderer();
        center();
        pose.tapAge = 1;
        image.style.removeProperty("transform");
      } else if (image.naturalWidth && !renderer) {
        renderer = createLynxRenderer(canvas, image);
        if (renderer && width && height) {
          renderer.resize(width, height);
          image.style.removeProperty("transform");
        }
      }
      schedule();
    }
    function point(event: PointerEvent) {
      if (!event.isPrimary || reduced.matches || !width || !height) return;
      const px = (event.clientX - left) / width,
        py = (event.clientY - top) / height;
      if (
        px < 0 ||
        py < 0 ||
        px > 1 ||
        py > 1 ||
        (event.target instanceof Element && event.target.closest("button, a"))
      ) {
        center();
        return;
      }
      position.x = px;
      position.y = py;
      if (!tracking) {
        Object.assign(pose.front, position);
        Object.assign(pose.mid, position);
        Object.assign(pose.end, position);
      }
      tracking = true;
      lookTarget.x = 2 * px - 1;
      lookTarget.y = 2 * py - 1;
      if (event.type === "pointerdown") {
        Object.assign(pose.touch, position);
        pose.tapAge = 0;
      }
    }
    function center() {
      tracking = false;
      lookTarget.x = 0;
      lookTarget.y = 0;
    }
    function lift(event: PointerEvent) {
      if (event.isPrimary && event.pointerType !== "mouse") center();
    }
    function lost(event: Event) {
      event.preventDefault();
      releaseRenderer();
    }
    const resize = new ResizeObserver(layout);
    const view = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) center();
      schedule();
    });
    resize.observe(stage);
    view.observe(canvas.parentElement!);
    layout();
    start();
    stage.addEventListener("pointerdown", point);
    stage.addEventListener("pointermove", point);
    stage.addEventListener("pointerleave", center);
    stage.addEventListener("pointercancel", center);
    stage.addEventListener("pointerup", lift);
    window.addEventListener("scroll", layout, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener("change", start);
    image.addEventListener("load", start);
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", start);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      view.disconnect();
      stage.removeEventListener("pointerdown", point);
      stage.removeEventListener("pointermove", point);
      stage.removeEventListener("pointerleave", center);
      stage.removeEventListener("pointercancel", center);
      stage.removeEventListener("pointerup", lift);
      window.removeEventListener("scroll", layout);
      document.removeEventListener("visibilitychange", schedule);
      reduced.removeEventListener("change", start);
      image.removeEventListener("load", start);
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", start);
      image.style.removeProperty("transform");
      releaseRenderer();
    };
  }, []);

  return (
    <div className="scene">
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <filter id="thermal-map" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values=".27 .60 .13 0 0  .27 .60 .13 0 0  .27 .60 .13 0 0  0 0 0 1 0"
            />
            <feComponentTransfer>
              <feFuncR type="table" tableValues=".018 .28 .61 1 1 1" />
              <feFuncG type="table" tableValues=".02 .045 .13 .36 .76 .95" />
              <feFuncB type="table" tableValues=".065 .23 .24 .10 .39 .70" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
      <img
        ref={poster}
        className="scene-poster"
        src={imageUrl}
        width="1672"
        height="941"
        fetchPriority="high"
        alt="Ghost Lynx, a silver cybernetic wildcat with ceramic cheek plates and an amber eye."
      />
      <canvas ref={surface} aria-hidden="true" />
    </div>
  );
}
