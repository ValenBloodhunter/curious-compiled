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
  }

  constructor() {
    const random = THREE.MathUtils.seededRandom
    random(463)
    const seeds = new Float32Array((diskCount + dustCount) * 3)
    for (let index = 0; index < seeds.length; index++) seeds[index] = random()
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(seeds, 3))
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
        varying vec2 vTangent;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vStretch;

        void main() {
          bool dust = gl_VertexID >= ${diskCount};
          float radius = mix(1.26, 4.65, pow(position.x, 1.6));
          float phase = position.y * 6.283185 + time * 0.43 / (radius * sqrt(radius));
          vec3 diskAxis = vec3(0.0, sin(tilt), -cos(tilt));
          vec3 radial = vec3(cos(phase), 0, 0) + diskAxis * sin(phase);
          vec3 tangent = vec3(-sin(phase), 0, 0) + diskAxis * cos(phase);
          vec3 p = radius * radial + vec3(0, cos(tilt), sin(tilt)) * (position.z - 0.5) * 0.035;
          if (dust) {
            p = (position - 0.5) * vec3(85, 56, 32);
            p.xy += pointer * 0.22;
            p.z -= 22.0;
          }

          vec3 ray = normalize(p - cameraPosition);
          float impact = length(cross(cameraPosition, ray));
          float cameraRadius = length(cameraPosition);
          vec4 view = viewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * view;
          if (dot(p, cameraPosition) < 0.0 && impact < (dust ? 5.4 : 1.12)) {
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
          vAlpha = dust ? 0.11 * position.z : 0.13 * heat * beam * position.z;
          gl_PointSize = pixelScale * vStretch * (dust ? 1.6 : 1.3 + 1.45 * position.z);
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
