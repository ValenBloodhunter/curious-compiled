import * as THREE from 'three'
import type { State } from '../core/state'

const diskCount = 12_288
const dustCount = 1_024

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
    const random = THREE.MathUtils.seededRandom
    random(463)
    const seeds = new Float32Array((diskCount + dustCount) * 3)
    for (let index = 0; index < seeds.length; index++) seeds[index] = random()
    const disk = new Float32Array(seeds.length)
    const wave = new Float32Array(seeds.length)
    const ring = new Float32Array(seeds.length)
    for (let i = 0; i < diskCount * 3; i += 3) {
      const lane = seeds[i]
      const angle = seeds[i + 1] * Math.PI * 2
      const scatter = seeds[i + 2] - 0.5
      const radius = 1.26 + 3.39 * lane ** 1.6
      disk.set([radius * Math.cos(angle), scatter * 0.035, -radius * Math.sin(angle)], i)

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
    this.points = new THREE.Points(geometry, new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
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
        vec3 curl(vec3 p) {
          vec3 c = cos(p);
          return sin(p) * (c.yzx - c.zxy);
        }

        void main() {
          bool dust = gl_VertexID >= ${diskCount};
          float radius = 1.26;
          vec3 p;
          vec3 tangent = vec3(1, 0, 0);
          float morph = uMorphWave + uMorphRing;
          if (dust) {
            p = (position - 0.5) * vec3(85, 56, 32);
            p.xy += pointer * 0.22;
            p.z -= 22.0;
          } else {
            radius = length(aPosDisk.xz);
            vec3 disk = orbit(aPosDisk, time * 0.43 / (radius * sqrt(radius)));
            p = disk;
            tangent = vec3(disk.z, 0.0, -disk.x);
            if (morph > 0.0) {
              vec3 wave = aPosWave;
              float phase = wave.x * 0.8 + wave.z * 0.65 + time * 0.62;
              wave.y += 0.23 * sin(phase);
              vec3 ring = orbit(aPosRing, time * (0.19 + 0.045 * position.x));
              vec3 weights = vec3(1.0 - morph, uMorphWave, uMorphRing);
              p = disk * weights.x + wave * weights.y + ring * weights.z;
              tangent = tangent * weights.x + vec3(1.0, 0.76 * cos(phase), 0) * weights.y
                + vec3(ring.z, 0.0, -ring.x) * weights.z;
              vec3 eddy = p * 1.6 + vec3(time * 0.28, position.z, 0);
              float transition = 1.0 - dot(weights, weights);
              p += (curl(eddy) + 0.31 * curl(eddy * 2.17)) * transition * 0.39;
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
          float heat = exp(-0.8 * (radius - 1.26));
          float beam = clamp(0.5 + 0.5 * dot(tangent, cameraPosition / cameraRadius), 0.0, 1.0);
          vColor = dust ? vec3(0.34, 0.28, 0.22)
            : mix(vec3(0.52, 0.085, 0.013), vec3(1.0, 0.73, 0.48), beam * heat);
          float emission = mix(0.13 * heat * beam, 0.22 + 0.17 * beam, morph);
          vAlpha = dust ? 0.11 * position.z : emission * position.z * (1.0 - uCollapse);
          gl_PointSize = pixelScale * vStretch * (dust ? 1.6 : 1.3 + 1.45 * position.z + 0.7 * morph);
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
          float fade = max(0.0, 1.0 - dot(axis, axis));
          gl_FragColor = vec4(vColor, vAlpha * fade * fade);
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
