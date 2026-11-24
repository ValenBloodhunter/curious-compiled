import { useEffect, useRef } from "react";
import imageUrl from "../assets/ghost-lynx.webp";

const vertex = `#version 300 es
out vec2 screen;
void main() {
  vec2 corner = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  screen = vec2(corner.x, 1. - corner.y);
  gl_Position = vec4(corner * 2. - 1., 0., 1.);
}`;

const fragment = `#version 300 es
precision highp float;
uniform sampler2D portrait;
uniform vec2 crop, anchor, gaze;
uniform float time, travel, thermal;
in vec2 screen;
out vec4 color;

float region(vec2 p, vec2 center, vec2 radius) {
  vec2 d = (p - center) / radius;
  return exp(-dot(d, d));
}
vec3 heat(float v) {
  vec3 cold = mix(vec3(.018,.02,.065), vec3(.40,.06,.30), smoothstep(.01,.28,v));
  vec3 warm = mix(cold, vec3(1.,.31,.10), smoothstep(.22,.55,v));
  return mix(warm, vec3(1.,.95,.70), smoothstep(.51,.90,v));
}
void main() {
  vec2 uv = (screen - .5) * crop + .5 + (anchor - .5) * (1. - crop);
  uv = mix(vec2(.625,.42), uv, .973 - .076 * travel);
  float head = region(uv, vec2(.65,.43), vec2(.25,.47));
  float shoulder = region(uv, vec2(.85,.86), vec2(.28,.27));
  float ear = region(uv, vec2(.78,.10), vec2(.10,.18));
  float whiskers = region(uv, vec2(.50,.64), vec2(.14,.13));
  float wind = sin(17.*uv.x - 12.*uv.y + time*1.5);
  uv += gaze * (.0015 + .008*head);
  uv.y += sin(time*1.55) * (.0055*shoulder + .0028*head);
  uv.x += ear * (.004*sin(time*1.05) + .006*pow(max(0.,cos(time*.82)),18.));
  uv.y += whiskers * wind * .0024;
  uv.x += .0028 * wind * shoulder;
  // A change of lens propagates out from the optic along curved filaments.
  float distanceFromEye = length((uv - vec2(.625,.42)) * vec2(1.3,1.));
  float edge = thermal * 1.36 - .10 - distanceFromEye;
  float crest = 1. - smoothstep(0., .065, abs(edge));
  uv.x += .009 * crest * sin(21.*uv.y - time*2.);
  vec3 optical = texture(portrait, clamp(uv, .001, .999)).rgb;
  float value = dot(optical, vec3(.27,.60,.13));
  vec3 scene = mix(optical, heat(value), smoothstep(-.045,.045,edge));
  float fiber = pow(.5 + .5*sin(62.*uv.y + 16.*sin(uv.x*5. - time*.5)), 8.);
  scene += crest * fiber * vec3(.39,.21,.11);
  color = vec4(scene, 1.);
}`;

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
    let dispose: (() => void) | undefined;
    let mounted = true;

    function start() {
      if (!mounted || reduced.matches || dispose || !image.naturalWidth) return;
      const context = canvas.getContext("webgl2", {
        alpha: false,
        antialias: false,
        depth: false,
        powerPreference: "low-power",
      });
      if (!context || context.isContextLost()) return;
      const gl = context;
      const program = gl.createProgram()!;
      for (const [type, source] of [
        [gl.VERTEX_SHADER, vertex],
        [gl.FRAGMENT_SHADER, fragment],
      ] as const) {
        const shader = gl.createShader(type)!;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        gl.attachShader(program, shader);
        gl.deleteShader(shader);
      }
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        return;
      }
      gl.useProgram(program);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      const uniform = (name: string) => gl.getUniformLocation(program, name);
      const crop = uniform("crop"),
        anchor = uniform("anchor"),
        gaze = uniform("gaze");
      const time = uniform("time"),
        travel = uniform("travel"),
        tint = uniform("thermal");
      let frame = 0,
        previous = 0,
        elapsed = 0,
        visible = false,
        progress = 0;
      let x = 0,
        y = 0,
        targetX = 0,
        targetY = 0,
        mix = lens.current;
      function draw(now: number) {
        frame = requestAnimationFrame(draw);
        if (now - previous < 32) return;
        const dt = Math.min(0.06, (now - previous) / 1000);
        previous = now;
        elapsed += dt;
        const ease = 1 - Math.exp(-5 * dt);
        x += (targetX - x) * ease;
        y += (targetY - y) * ease;
        mix += (lens.current - mix) * ease * 1.6;
        gl.uniform2f(gaze, x, y);
        gl.uniform1f(time, elapsed);
        gl.uniform1f(travel, progress);
        gl.uniform1f(tint, mix);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        if (!canvas.dataset.ready) canvas.dataset.ready = "true";
      }
      function schedule() {
        cancelAnimationFrame(frame);
        if (visible && !document.hidden) frame = requestAnimationFrame(draw);
      }
      function scroll() {
        const box = stage.getBoundingClientRect();
        progress = Math.min(1, Math.max(0, -box.top / box.height));
      }
      function resize() {
        const w = canvas.clientWidth,
          h = canvas.clientHeight;
        if (!w || !h) return;
        const ratio = Math.min(devicePixelRatio, 1.3, 1920 / w);
        canvas.width = Math.round(w * ratio);
        canvas.height = Math.round(h * ratio);
        gl.viewport(0, 0, canvas.width, canvas.height);
        const aspect = w / h / (image.naturalWidth / image.naturalHeight);
        gl.uniform2f(crop, Math.min(1, aspect), Math.min(1, 1 / aspect));
        gl.uniform2f(
          anchor,
          Number(getComputedStyle(canvas).getPropertyValue("--anchor-x")),
          0.5,
        );
        scroll();
      }
      function point(event: PointerEvent) {
        if (event.pointerType === "touch") return;
        const box = stage.getBoundingClientRect();
        targetX = (2 * (event.clientX - box.left)) / box.width - 1;
        targetY = (2 * (event.clientY - box.top)) / box.height - 1;
      }
      function center() {
        targetX = 0;
        targetY = 0;
      }
      const size = new ResizeObserver(resize);
      const view = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        schedule();
      });
      size.observe(canvas);
      view.observe(canvas);
      resize();
      stage.addEventListener("pointermove", point);
      stage.addEventListener("pointerleave", center);
      document.addEventListener("visibilitychange", schedule);
      window.addEventListener("scroll", scroll, { passive: true });
      dispose = () => {
        cancelAnimationFrame(frame);
        size.disconnect();
        view.disconnect();
        stage.removeEventListener("pointermove", point);
        stage.removeEventListener("pointerleave", center);
        document.removeEventListener("visibilitychange", schedule);
        window.removeEventListener("scroll", scroll);
        gl.deleteTexture(texture);
        gl.deleteProgram(program);
        delete canvas.dataset.ready;
      };
    }
    function stop() {
      dispose?.();
      dispose = undefined;
    }
    function preference() {
      if (reduced.matches) stop();
      else start();
    }
    function lost(event: Event) {
      event.preventDefault();
      stop();
    }
    reduced.addEventListener("change", preference);
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", start);
    image.addEventListener("load", start);
    if (image.complete) start();
    return () => {
      mounted = false;
      stop();
      reduced.removeEventListener("change", preference);
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", start);
      image.removeEventListener("load", start);
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
