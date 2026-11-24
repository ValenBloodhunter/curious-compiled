// Deform a grid, so the cost of moving the portrait is independent of pixel density.
const columns = 64,
  rows = 40;
const vertex = `#version 300 es
uniform vec2 crop, anchor, gaze, tip, middle, tail;
uniform vec3 tap;
uniform float time, travel, aspect;
out vec2 uv;
const ivec2 corners[6] = ivec2[6](ivec2(0,0), ivec2(1,0), ivec2(0,1), ivec2(0,1), ivec2(1,0), ivec2(1,1));

float region(vec2 p, vec2 center, vec2 radius) {
  vec2 d = (p - center) / radius;
  return exp(-dot(d, d));
}
// A stroke pulls nearby fur along its direction. The trailing end relaxes last.
vec2 wake(vec2 p, vec2 front, vec2 back) {
  vec2 metric = vec2(aspect, 1.);
  vec2 stroke = (front - back) * metric;
  vec2 d = (p - back) * metric;
  float along = clamp(dot(d,stroke) / max(dot(stroke,stroke), .00001), 0., 1.);
  vec2 offset = d - along * stroke;
  float weight = exp(-dot(offset,offset) / .012);
  return stroke / (1. + 6.*length(stroke)) * weight / metric;
}
void main() {
  int cell = gl_VertexID / 6;
  vec2 screen = vec2(ivec2(cell % ${columns}, cell / ${columns}) + corners[gl_VertexID % 6]) / vec2(${columns}., ${rows}.);
  gl_Position = vec4(screen * vec2(2.,-2.) + vec2(-1.,1.), 0., 1.);
  uv = (screen - anchor) * crop + anchor;
  vec2 eye = vec2(.625,.42);
  uv = mix(eye, uv, .957 - .13 * travel);
  float head = region(uv, vec2(.65,.43), vec2(.25,.42));
  float shoulder = region(uv, vec2(.85,.86), vec2(.28,.27));
  float ears = region(uv, vec2(.71,.10), vec2(.20,.16));
  float whiskers = region(uv, vec2(.50,.64), vec2(.14,.13));
  float breath = sin(time * 1.48);
  float turn = (.016*sin(time*.79) + .036*gaze.x) * head;
  vec2 neck = uv - vec2(.80,.83);
  uv += vec2(-neck.y*.56, neck.x*1.78) * turn;
  uv -= gaze * (.004 + .013*head);
  uv.y += breath * (.011*shoulder + .0035*head);
  uv.x += ears * (.006*sin(time*1.05) + .010*pow(max(0.,cos(time*.82)),18.));
  uv.y += whiskers * .0045 * sin(17.*uv.x - 12.*uv.y + time*1.5);
  uv -= crop * (.37*wake(screen, tip, middle) + .23*wake(screen, middle, tail));
  if (tap.z < .9) {
    vec2 radial = (screen - tap.xy) * vec2(aspect, 1.);
    float radius = length(radial);
    float band = (radius - .43*tap.z) / .063;
    uv -= crop * radial / max(radius,.03) / vec2(aspect,1.)
      * .014 * band * exp(-band*band) * (1. - smoothstep(0.,.9,tap.z));
  }
}`;

const fragment = `#version 300 es
precision highp float;
uniform sampler2D portrait;
uniform float thermal, time;
in vec2 uv;
out vec4 color;
vec3 heat(float v) {
  vec3 cold = mix(vec3(.018,.02,.065), vec3(.40,.06,.30), smoothstep(.01,.28,v));
  vec3 warm = mix(cold, vec3(1.,.31,.10), smoothstep(.22,.55,v));
  return mix(warm, vec3(1.,.95,.70), smoothstep(.51,.90,v));
}
void main() {
  vec2 sampleAt = uv;
  float edge = -1., crest = 0.;
  if (thermal > .001 && thermal < .999) {
    edge = thermal * 1.36 - .10 - length((uv - vec2(.625,.42)) * vec2(1.3,1.));
    crest = 1. - smoothstep(0.,.065,abs(edge));
    sampleAt.x += .009 * crest * sin(21.*uv.y - time*2.);
  }
  vec3 scene = texture(portrait, sampleAt).rgb;
  if (thermal > .001) {
    float value = dot(scene, vec3(.27,.60,.13));
    scene = mix(scene, heat(value), thermal >= .999 ? 1. : smoothstep(-.045,.045,edge));
    if (crest > 0.) scene += crest * pow(.5+.5*sin(62.*uv.y+16.*sin(uv.x*5.-time*.5)),8.) * vec3(.39,.21,.11);
  }
  color = vec4(scene, 1.);
}`;

export type Point = { x: number; y: number };
export type LynxMotion = {
  seconds: number;
  travel: number;
  thermal: number;
  tapAge: number;
  look: Point;
  front: Point;
  mid: Point;
  end: Point;
  touch: Point;
};

export function createLynxRenderer(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
) {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: "low-power",
  });
  if (!gl || gl.isContextLost()) return;
  const program = gl.createProgram();
  if (!program) return;
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vertex],
    [gl.FRAGMENT_SHADER, fragment],
  ] as const) {
    const shader = gl.createShader(type);
    if (!shader) {
      gl.deleteProgram(program);
      return;
    }
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
  if (!texture) {
    gl.deleteProgram(program);
    return;
  }
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const crop = uniform("crop"),
    anchor = uniform("anchor"),
    aspect = uniform("aspect");
  const time = uniform("time"),
    travel = uniform("travel"),
    tint = uniform("thermal");
  const gaze = uniform("gaze"),
    tip = uniform("tip"),
    middle = uniform("middle"),
    tail = uniform("tail"),
    tap = uniform("tap");
  return {
    resize(w: number, h: number) {
      const ratio = Math.min(
        devicePixelRatio,
        1.35,
        Math.sqrt(1500000 / (w * h)),
      );
      canvas.width = Math.round(w * ratio);
      canvas.height = Math.round(h * ratio);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const cover = w / h / (image.naturalWidth / image.naturalHeight);
      gl.uniform2f(crop, Math.min(1, cover), Math.min(1, 1 / cover));
      gl.uniform2f(
        anchor,
        Number(getComputedStyle(canvas).getPropertyValue("--anchor-x")),
        0.5,
      );
      gl.uniform1f(aspect, w / h);
    },
    draw(pose: LynxMotion) {
      gl.uniform1f(time, pose.seconds);
      gl.uniform1f(travel, pose.travel);
      gl.uniform1f(tint, pose.thermal);
      gl.uniform2f(gaze, pose.look.x, pose.look.y);
      gl.uniform2f(tip, pose.front.x, pose.front.y);
      gl.uniform2f(middle, pose.mid.x, pose.mid.y);
      gl.uniform2f(tail, pose.end.x, pose.end.y);
      gl.uniform3f(tap, pose.touch.x, pose.touch.y, pose.tapAge);
      gl.drawArrays(gl.TRIANGLES, 0, columns * rows * 6);
    },
    dispose() {
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
    },
  };
}
