import * as THREE from 'three'
import type { State } from '../core/state'
import { diskDefines } from './diskGeometry'

const desktopDiskCount = 36_864
const desktopDustCount = 1_024

export class ParticleField {
  readonly points: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>
  private readonly uniforms = {
    time: { value: 0 },
    warp: { value: 0 },
    tilt: { value: 0 },
    pixelScale: { value: 1 },
    pointer: { value: new THREE.Vector2() },
    uMorphWave: { value: 0 },
    uMorphRing: { value: 0 },
    uCollapse: { value: 0 },
  }

  constructor() {
    const density = window.matchMedia('(pointer: coarse)').matches ? 0.5 : 1
    const diskCount = desktopDiskCount * density
    const total = diskCount + desktopDustCount * density
    const random = THREE.MathUtils.seededRandom
    random(463)
    const seeds = new Float32Array(total * 3)
    for (let index = 0; index < seeds.length; index++) seeds[index] = random()
    const spark = Float32Array.from({ length: total }, () => random())
    const radii = new Float32Array(total)
    const disk = new Float32Array(seeds.length)
    const wave = new Float32Array(seeds.length)
    const ring = new Float32Array(seeds.length)
    for (let i = 0; i < diskCount * 3; i += 3) {
      const lane = seeds[i]
      const angle = seeds[i + 1] * Math.PI * 2
      const scatter = seeds[i + 2] - 0.5
      const radialFraction = lane ** 1.45
      const radius = THREE.MathUtils.lerp(Number(diskDefines.DISK_INNER), Number(diskDefines.DISK_OUTER), radialFraction)
      disk.set([radius * Math.cos(angle), 0, -radius * Math.sin(angle)], i)
      radii[i / 3] = radialFraction

      const x = (seeds[i + 1] - 0.5) * 14
      const z = (lane - 0.5) * 4.8
      wave.set([x, 0.75 * Math.sin(x * 0.8 + z * 0.65) + z * 0.16 + scatter * 0.12, z], i)

      const orbit = 2.19 + (lane - 0.5) * 0.54 + 0.10 * Math.cos(3 * angle)
      ring.set([orbit * Math.cos(angle), scatter * 0.21 + 0.16 * Math.sin(angle * 2),
        -orbit * Math.sin(angle)], i)
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(seeds, 3))
    geometry.setAttribute('aPosDisk', new THREE.BufferAttribute(disk, 3))
    geometry.setAttribute('aPosWave', new THREE.BufferAttribute(wave, 3))
    geometry.setAttribute('aPosRing', new THREE.BufferAttribute(ring, 3))
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(spark, 1))
    geometry.setAttribute('aRadius', new THREE.BufferAttribute(radii, 1))
    this.points = new THREE.Points(geometry, new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      defines: diskDefines,
      transparent: true,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.ZeroFactor,
      blendDstAlpha: THREE.OneFactor,
      depthTest: false,
      depthWrite: false,
      vertexShader: `
        uniform float time;
        uniform float warp;
        uniform float tilt;
        uniform float pixelScale;
        uniform vec2 pointer;
        uniform float uMorphWave;
        uniform float uMorphRing;
        uniform float uCollapse;
        attribute vec3 aPosDisk;
        attribute vec3 aPosWave;
        attribute vec3 aPosRing;
        attribute float aSeed;
        attribute float aRadius;
        varying vec2 vTangent;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vStretch;

        vec3 orbit(vec3 p, float angle) {
          float c = cos(angle);
          float s = sin(angle);
          return vec3(c * p.x + s * p.z, p.y, c * p.z - s * p.x);
        }

        vec3 incline(vec3 p) {
          float c = cos(tilt);
          float s = sin(tilt);
          return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
        }

        // Analytic curl of a periodic vector potential, sampled at two scales.
        vec3 curlNoise(vec3 p) {
          vec3 c = cos(p);
          return sin(p) * (c.yzx - c.zxy);
        }

        void main() {
          bool dust = gl_VertexID >= ${diskCount};
          float radius = DISK_INNER;
          vec3 p;
          vec3 tangent = vec3(1, 0, 0);
          float morph = 0.0;
          float tear = 0.0;
          if (dust) {
            p = (position - 0.5) * vec3(85, 56, 32);
            p.xy += pointer * 0.22;
            p.z -= 22.0;
          } else {
            radius = length(aPosDisk.xz);
            vec3 disk = orbit(aPosDisk, time * DISK_ROTATION / (radius * sqrt(radius)));
            p = disk;
            tangent = vec3(disk.z, 0.0, -disk.x);
            float progress = uMorphWave + uMorphRing;
            if (progress > 0.0) {
              float delay = (0.45 * (1.0 - aRadius) + 0.15 * aSeed) * (0.55 / 0.60);
              float localT = smoothstep(delay, delay + 0.45, progress);
              float ringT = smoothstep(delay, delay + 0.45, uMorphRing);
              morph = localT;
              vec3 wave = aPosWave;
              float phase = wave.x * 0.8 + wave.z * 0.65 + time * 0.62;
              wave.y += 0.23 * sin(phase);
              vec3 ring = orbit(aPosRing, time * (0.19 + 0.045 * position.x));
              vec3 weights = vec3(1.0 - localT, localT - ringT, ringT);
              p = disk * weights.x + wave * weights.y + ring * weights.z;
              tangent = tangent * weights.x + vec3(1.0, 0.76 * cos(phase), 0) * weights.y
                + vec3(ring.z, 0.0, -ring.x) * weights.z;
              float peelArc = sin(localT * 3.14159265);
              float ringArc = sin(ringT * 3.14159265);
              tear = max(peelArc, ringArc);
              float twist = peelArc * (0.80 + aSeed * 1.25) - ringArc * (0.23 + aRadius * 0.45);
              p = orbit(p, twist);
              tangent = orbit(tangent, twist);
              p.y += tear * (0.35 + 1.1 * aSeed) * sin(aSeed * 6.283185 + 5.0 * localT);
              vec3 eddy = p * 0.6 + vec3(aSeed * 2.0, time * 0.2, aRadius * 2.0);
              p += (curlNoise(eddy) + 0.28 * curlNoise(eddy * 2.13)) * tear * 0.62;
            }
            p = incline(p * mix(1.0, 0.15, uCollapse));
            tangent = normalize(incline(tangent) + vec3(0.0001, 0, 0));
          }

          vec3 ray = normalize(p - cameraPosition);
          float impact = length(cross(cameraPosition, ray));
          float cameraRadius = length(cameraPosition);
          vec4 view = viewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * view;
          if (dot(p, cameraPosition) < 0.0 && impact < (dust ? 5.4 : mix(1.12, 0.5, morph))) {
            gl_Position = vec4(2, 2, 2, 1);
          }

          // Differentiate the perspective projection so the sprite follows its orbit.
          vec3 viewVelocity = mat3(viewMatrix) * tangent;
          vec2 screenVelocity = viewVelocity.xy - view.xy * viewVelocity.z / view.z;
          vTangent = normalize(screenVelocity + vec2(0.0001, 0));
          vStretch = dust ? 1.0 : 1.0 + min(abs(warp) * 0.021, 1.2);
          float heat = exp(-0.8 * (radius - DISK_INNER));
          float beam = clamp(0.5 + 0.5 * dot(tangent, cameraPosition / cameraRadius), 0.0, 1.0);
          vec3 settled = mix(vec3(0.342, 0.147, 0.056), vec3(0.807, 0.328, 0.072), aSeed);
          vec3 gold = vec3(1.0, 0.905, 0.715);
          vec3 diskColor = mix(settled, gold, beam * heat);
          vColor = dust ? vec3(0.34, 0.28, 0.22) : mix(mix(diskColor, settled, morph), gold, tear);
          float emission = mix(0.065 * heat * beam, 0.33 + 0.11 * beam, morph) + 0.44 * tear;
          vAlpha = dust ? 0.11 * aSeed : emission * aSeed * (1.0 - uCollapse);
          float attenuation = clamp(sqrt(cameraRadius / max(-view.z, 0.25)), 0.55, 1.8);
          gl_PointSize = pixelScale * attenuation * vStretch * (dust ? 1.6 : 1.5 + 1.35 * aSeed + 0.45 * tear);
        }
      `,
      fragmentShader: `
        varying vec2 vTangent;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vStretch;

        void main() {
          vec2 point = (gl_PointCoord - 0.5) * 2.0;
          point.y = -point.y;
          vec2 axis = vec2(dot(point, vTangent), dot(point, vec2(-vTangent.y, vTangent.x)) * vStretch);
          float d = length(axis);
          float core = exp(-d * d * 8.0);
          vec3 heat = mix(vColor, vec3(1.0, 0.905, 0.715), 0.20 * core);
          gl_FragColor = vec4(heat, vAlpha * core * (1.0 - smoothstep(0.8, 1.0, d)));
        }
      `,
    }))
    this.points.frustumCulled = false
  }

  setMorph(wave: number, ring: number, collapse: number) {
    this.uniforms.uMorphWave.value = wave
    this.uniforms.uMorphRing.value = ring
    this.uniforms.uCollapse.value = collapse
  }

  update(state: State, tilt: number, warp: number, pixelScale: number) {
    this.uniforms.time.value = state.reducedMotion ? 0 : state.time
    this.uniforms.warp.value = warp
    this.uniforms.tilt.value = tilt
    this.uniforms.pixelScale.value = pixelScale
    this.uniforms.pointer.value.set(state.mouse.x, state.mouse.y).multiplyScalar(state.reducedMotion ? 0 : 1)
  }

  destroy() {
    this.points.removeFromParent()
    this.points.geometry.dispose()
    this.points.material.dispose()
  }
}
