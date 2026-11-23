import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import portrait from "../assets/neural-ronin.jpg";

const vertex = `
attribute vec3 a_position;
attribute vec3 a_color;
attribute float a_seed;
uniform vec2 u_resolution;
uniform vec3 u_portrait;
uniform vec2 u_pointer;
uniform float u_time;
uniform float u_progress;
uniform float u_dpr;
varying vec3 v_color;
varying float v_alpha;
void main() {
  float unfold = smoothstep(0.10, 0.76, u_progress);
  float exit = smoothstep(0.86, 1.0, u_progress);
  float angle = atan(a_position.y, a_position.x);
  float radius = length(a_position.xy);
  // shortcut: brightness approximates depth; use a depth map for larger head turns.
  float depth = (a_position.z - 0.15) * 0.06;
  vec3 face = vec3(a_position.xy, depth);
  face.x += sin(a_position.y * 11.0 + u_time * 0.7) * 0.002;
  face.y += sin(u_time * 0.6) * 0.005;
  float turn = sin(u_time * 0.25) * 0.035 + u_pointer.x * 0.12 + unfold * 0.8;
  face.xz = mat2(cos(turn), -sin(turn), sin(turn), cos(turn)) * face.xz;
  float spiral = angle + unfold * 2.8 + u_time * 0.13;
  float branch = pow(abs(sin(angle * 7.0 + a_seed * 1.3 + u_time * 0.1)), 6.0);
  float spread = 0.12 + radius * 0.48 + branch * 0.25 + a_seed * 0.07;
  vec3 bloom = vec3(cos(spiral) * spread, sin(spiral) * spread * 0.78, sin(angle * 3.0 + u_time * 0.25) * 0.15);
  vec3 p = mix(face, bloom, unfold);
  p.xy *= 1.0 + exit * 2.6;
  p.z += u_pointer.y * a_position.y * 0.1;
  float perspective = 1.0 / (1.0 - p.z * 0.7);
  vec2 screen = p.xy * perspective * u_portrait.z;
  screen += vec2(u_portrait.x, u_portrait.y);
  gl_Position = vec4(screen / u_resolution * 2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = clamp(u_portrait.z / 400.0 * u_dpr * mix(1.8, 0.8, unfold), 1.0, 8.0);
  v_color = mix(a_color, vec3(0.54, 0.95, 0.62) * (0.35 + a_position.z * 1.2), unfold * 0.8);
  v_alpha = (1.0 - exit) * smoothstep(-0.5, -0.37, a_position.y);
}`;

const fragment = `
precision mediump float;
varying vec3 v_color;
varying float v_alpha;
void main() {
  float dot = 1.0 - smoothstep(0.32, 0.5, length(gl_PointCoord - 0.5));
  gl_FragColor = vec4(v_color, dot * v_alpha);
}`;

export default function NeuralPortrait() {
  const scene = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const element = scene.current;
    const field = canvas.current;
    const source = image.current;
    const story = element?.closest<HTMLElement>(".hero-scroll");
    const stage = element?.closest<HTMLElement>(".hero");
    if (!element || !field || !source || !story || !stage) return;
    const gl = field.getContext("webgl", { alpha: true, antialias: false, preserveDrawingBuffer: true });
    if (!gl) { story.dataset.visual = "static"; return; }
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let visible = true;
    let frame = 0;
    let last = 0;
    let time = 0;
    let pointerX = 0;
    let pointerY = 0;
    let count = 0;
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    const shaders: WebGLShader[] = [];
    const uniforms: Record<string, WebGLUniformLocation | null> = {};

    function compile(type: number, code: string) {
      const shader = gl!.createShader(type);
      if (!shader) throw new Error("Shader allocation failed");
      shaders.push(shader);
      gl!.shaderSource(shader, code); gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) throw new Error("Shader compilation failed");
      return shader;
    }

    function draw(now: number) {
      frame = 0;
      if (!gl || !field || !element || !source || !story || !stage || !program || disposed) return;
      if (document.hidden || !visible) { last = 0; return; }
      if (last && !reduced.matches) time += Math.min(now - last, 50) / 1000;
      last = now;
      const progress = reduced.matches ? 0 : Math.max(0, Math.min(1, -story.getBoundingClientRect().top / Math.max(1, story.offsetHeight - innerHeight)));
      const intro = 1 - Math.min(1, progress / 0.28);
      const chapter = Math.min(1, Math.max(0, (progress - 0.35) / 0.18));
      stage.style.setProperty("--intro-opacity", String(intro));
      stage.style.setProperty("--chapter-opacity", String(chapter));
      stage.style.setProperty("--title-shift", `${progress * 160}px`);
      stage.style.setProperty("--story-progress", String(progress));
      const bounds = element.getBoundingClientRect();
      const portraitBounds = source.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio, 1.75);
      const width = Math.round(bounds.width * dpr), height = Math.round(bounds.height * dpr);
      if (field.width !== width || field.height !== height) { field.width = width; field.height = height; }
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(uniforms.u_resolution, bounds.width, bounds.height);
      gl.uniform3f(uniforms.u_portrait, portraitBounds.left - bounds.left + portraitBounds.width / 2, bounds.height - (portraitBounds.top - bounds.top + portraitBounds.height / 2), portraitBounds.height);
      gl.uniform2f(uniforms.u_pointer, pointerX, pointerY);
      gl.uniform1f(uniforms.u_time, time);
      gl.uniform1f(uniforms.u_progress, progress);
      gl.uniform1f(uniforms.u_dpr, dpr);
      gl.drawArrays(gl.POINTS, 0, count);
      if (!reduced.matches) frame = requestAnimationFrame(draw);
    }
    function start() { if (!frame && program && !disposed && !gl?.isContextLost()) frame = requestAnimationFrame(draw); }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); else last = 0; });
    observer.observe(element);
    const move = (event: PointerEvent) => {
      if (reduced.matches || !visible || event.pointerType !== "mouse") return;
      pointerX = event.clientX / innerWidth - 0.5;
      pointerY = event.clientY / innerHeight - 0.5;
    };
    const reset = () => { pointerX = 0; pointerY = 0; start(); };
    const lost = (event: Event) => { event.preventDefault(); element.removeAttribute("data-ready"); story.dataset.visual = "static"; cancelAnimationFrame(frame); frame = 0; };
    field.addEventListener("webglcontextlost", lost);
    window.addEventListener("pointermove", move);
    window.addEventListener("resize", start);
    window.addEventListener("scroll", start, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    document.addEventListener("visibilitychange", start);
    reduced.addEventListener("change", reset);

    source.decode().then(() => {
      if (disposed) return;
      const sample = document.createElement("canvas");
      sample.width = 300; sample.height = 400;
      const sampling = sample.getContext("2d", { willReadFrequently: true });
      if (!sampling) throw new Error("Image sampling unavailable");
      sampling.drawImage(source, 0, 0, sample.width, sample.height);
      const pixels = sampling.getImageData(0, 0, sample.width, sample.height).data;
      const points: number[] = [];
      for (let y = 0; y < sample.height; y++) {
        for (let x = 0; x < sample.width; x++) {
          const offset = (y * sample.width + x) * 4;
          const r = pixels[offset] / 255, g = pixels[offset + 1] / 255, b = pixels[offset + 2] / 255;
          const luminance = r * 0.2126 + g * 0.7152 + b * 0.0722;
          if (luminance < 0.025) continue;
          points.push((x / sample.width - 0.5) * 0.75, 0.5 - y / sample.height, luminance, r, g, b, ((x * 73 + y * 31) % 997) / 997);
        }
      }
      count = points.length / 7;
      program = gl.createProgram();
      if (!program) throw new Error("Program allocation failed");
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Program linking failed");
      gl.useProgram(program);
      buffer = gl.createBuffer();
      if (!buffer) throw new Error("Buffer allocation failed");
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
      for (const [name, size, offset] of [["a_position", 3, 0], ["a_color", 3, 12], ["a_seed", 1, 24]] as const) {
        const location = gl.getAttribLocation(program, name);
        gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, size, gl.FLOAT, false, 28, offset);
      }
      for (const name of ["u_resolution", "u_portrait", "u_pointer", "u_time", "u_progress", "u_dpr"]) uniforms[name] = gl.getUniformLocation(program, name);
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      delete story.dataset.visual;
      element.dataset.ready = "true";
      start();
    }).catch(() => { if (!disposed) { element.removeAttribute("data-ready"); story.dataset.visual = "static"; } });

    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect();
      field.removeEventListener("webglcontextlost", lost);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", start);
      window.removeEventListener("scroll", start);
      document.documentElement.removeEventListener("pointerleave", reset);
      document.removeEventListener("visibilitychange", start);
      reduced.removeEventListener("change", reset);
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      shaders.forEach(shader => gl.deleteShader(shader));
      element.removeAttribute("data-ready");
    };
  }, [prefersReducedMotion]);

  return (
    <div className="neural-scene" ref={scene}>
      <img ref={image} className="neural-portrait" src={portrait} width="1086" height="1448" fetchPriority="high" alt="An imagined dark-haired ronin, transforming from a portrait into an emerald neural bloom as you scroll." />
      <canvas ref={canvas} aria-hidden="true" />
      <span className="portrait-caption">NEURAL RONIN / SCROLL TO TRANSFORM</span>
    </div>
  );
}
