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
  readonly drawingBufferSize = new THREE.Vector2()
  private readonly particles = new ParticleField()
  private readonly renderer: THREE.WebGLRenderer
  private readonly composer: EffectComposer
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
        vec4 scene = texture2D(tDiffuse, vUv);
        vec3 color = scene.rgb;
        if (aberration > 0.0) {
          vec2 offset = (vUv - 0.5) * aberration;
          color.r = texture2D(tDiffuse, vUv + offset).r;
          color.b = texture2D(tDiffuse, vUv - offset).b;
        }
        float grain = fract(52.9829189 * fract(dot(gl_FragCoord.xy + floor(time * 24.0),
          vec2(0.06711056, 0.00583715)))) - 0.5;
        const vec3 obsidian = vec3(0.00091, 0.00091, 0.00152);
        vec3 mapped = 1.0 - exp(-1.25 * max(vec3(0.0), color - obsidian));
        gl_FragColor = vec4(obsidian + mapped * clamp(scene.a, 0.0, 1.0) * (1.0 + 0.03 * grain), 1.0);
      }
    `,
  }))
  private readonly output = new OutputPass()

  constructor(canvas: HTMLCanvasElement, context: WebGL2RenderingContext) {
    this.renderer = new THREE.WebGLRenderer({ canvas, context })
    this.renderer.setClearColor(0x030305)
    this.bloom.blendMaterial.blending = THREE.CustomBlending
    this.bloom.blendMaterial.blendSrc = THREE.OneFactor
    this.bloom.blendMaterial.blendDst = THREE.OneFactor
    this.bloom.blendMaterial.blendSrcAlpha = THREE.ZeroFactor
    this.bloom.blendMaterial.blendDstAlpha = THREE.OneFactor
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
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(width, height, false)
    this.renderer.getDrawingBufferSize(this.drawingBufferSize)
    // The composer receives integer device pixels, so it must not apply DPR again.
    this.composer.setPixelRatio(1)
    this.composer.setSize(this.drawingBufferSize.x, this.drawingBufferSize.y)
  }

  setBloomStrength(strength: number) {
    this.bloom.strength = strength
  }

  setParticleMorph(wave: number, ring: number, collapse: number) {
    this.particles.setMorph(wave, ring, collapse)
  }

  render(state: State, diskTilt: number, warpVelocity: number) {
    this.particles.update(state, diskTilt, warpVelocity, this.renderer.getPixelRatio())
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
