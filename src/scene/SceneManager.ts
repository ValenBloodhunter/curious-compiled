import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

export class SceneManager {
  readonly scene = new THREE.Scene()
  private readonly camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  private readonly renderer: THREE.WebGLRenderer
  private readonly composer: EffectComposer
  private readonly bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.25, 0.3, 0.8)
  private readonly output = new OutputPass()

  constructor(canvas: HTMLCanvasElement, context: WebGL2RenderingContext) {
    this.camera.position.z = 4
    this.renderer = new THREE.WebGLRenderer({ canvas, context })
    this.renderer.setClearColor(0x080f16)
    this.composer = new EffectComposer(
      this.renderer,
      new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType }),
    )
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.composer.addPass(this.bloom)
    this.composer.addPass(this.output)

    this.resize()
    window.addEventListener('resize', this.resize)
  }

  private resize = () => {
    const { innerWidth: width, innerHeight: height } = window
    const pixelRatio = Math.min(window.devicePixelRatio, 1.75)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(pixelRatio)
    this.renderer.setSize(width, height, false)
    this.composer.setPixelRatio(pixelRatio)
    this.composer.setSize(width, height)
  }

  render(delta: number) {
    this.composer.render(delta)
  }

  destroy() {
    window.removeEventListener('resize', this.resize)
    this.bloom.dispose()
    this.output.dispose()
    this.composer.dispose()
    this.renderer.dispose()
  }
}
