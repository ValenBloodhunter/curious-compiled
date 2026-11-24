import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import type { State } from '../core/state'
import { ParticleField } from './ParticleField'

export class SceneManager {
  readonly scene = new THREE.Scene()
  readonly camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
  private readonly particles = new ParticleField()
  private readonly renderer: THREE.WebGLRenderer
  private readonly composer: EffectComposer
  private maxRenderRatio = 1
  private quality = 1
  private frameTime = 1 / 60
  private nextQualityCheck = 1
  private nextQualityIncrease = 5
  private readonly bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.45, 0.28, 0.78)
  private readonly finish = new ShaderPass(new THREE.ShaderMaterial({
    uniforms: { tDiffuse: { value: null }, time: { value: 0 }, aberration: { value: 0 } },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float time;
      uniform float aberration;
      varying vec2 vUv;

      void main() {
        vec3 color = texture2D(tDiffuse, vUv).rgb;
        if (aberration > 0.0) {
          vec2 offset = (vUv - 0.5) * aberration;
          color.r = texture2D(tDiffuse, vUv + offset).r;
          color.b = texture2D(tDiffuse, vUv - offset).b;
        }
        float grain = fract(52.9829189 * fract(dot(gl_FragCoord.xy + floor(time * 24.0),
          vec2(0.06711056, 0.00583715)))) - 0.5;
        gl_FragColor = vec4(color * (1.0 + 0.03 * grain), 1.0);
      }
    `,
  }))
  private readonly output = new OutputPass()

  constructor(canvas: HTMLCanvasElement, context: WebGL2RenderingContext) {
    this.renderer = new THREE.WebGLRenderer({ canvas, context })
    this.renderer.setClearColor(0x030305)
    this.scene.add(this.particles.points)
    this.composer = new EffectComposer(
      this.renderer,
      new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType }),
    )
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.composer.addPass(this.bloom)
    this.composer.addPass(this.finish)
    this.composer.addPass(this.output)

    this.resize()
    window.addEventListener('resize', this.resize)
  }

  private resize = () => {
    const { innerWidth: width, innerHeight: height } = window
    const pixelRatio = Math.min(window.devicePixelRatio, 1.75)
    this.maxRenderRatio = Math.min(pixelRatio, Math.sqrt(1_400_000 / (width * height)))
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(pixelRatio)
    this.renderer.setSize(width, height, false)
    this.composer.setPixelRatio(this.maxRenderRatio * this.quality)
    this.composer.setSize(width, height)
  }

  render(state: State, diskTilt: number, warpVelocity: number) {
    if (!state.reducedMotion) {
      this.frameTime += (state.delta - this.frameTime) * 0.06
      if (state.time >= this.nextQualityCheck) {
        this.nextQualityCheck = state.time + 1
        let adjustment = 0
        if (this.frameTime > 0.0175) {
          adjustment = -0.12
          this.nextQualityIncrease = state.time + 8
        } else if (this.frameTime < 0.0169 && state.time >= this.nextQualityIncrease) {
          adjustment = 0.04
          this.nextQualityIncrease = state.time + 3
        }
        const quality = THREE.MathUtils.clamp(this.quality + adjustment, 0.42, 1)
        if (quality !== this.quality) {
          this.quality = quality
          this.composer.setPixelRatio(this.maxRenderRatio * quality)
        }
      }
    }
    this.particles.update(state, diskTilt, warpVelocity, this.maxRenderRatio * this.quality)
    this.finish.uniforms.time.value = state.reducedMotion ? 0 : state.time
    this.finish.uniforms.aberration.value = state.reducedMotion ? 0 : Math.abs(state.smoothedVelocity) * 0.000045
    this.composer.render(state.delta)
  }

  destroy() {
    window.removeEventListener('resize', this.resize)
    this.particles.destroy()
    this.bloom.dispose()
    this.finish.dispose()
    this.output.dispose()
    this.composer.dispose()
    this.renderer.dispose()
  }
}
