import * as THREE from 'three'
import type { State } from '../core/state'
import fragmentShader from './shaders/gargantua.frag.glsl?raw'
import { diskDefines } from './diskGeometry'

function makeNoiseTexture() {
  const size = 32
  const voxels = new Uint8Array(size ** 3)
  const random = THREE.MathUtils.seededRandom
  random(721)
  for (let i = 0; i < voxels.length; i++) voxels[i] = Math.floor(random() * 256)
  const texture = new THREE.Data3DTexture(voxels, size, size, size)
  texture.format = THREE.RedFormat
  texture.minFilter = texture.magFilter = THREE.LinearFilter
  texture.wrapS = texture.wrapT = texture.wrapR = THREE.RepeatWrapping
  texture.needsUpdate = true
  return texture
}

export class Gargantua {
  private readonly target = new THREE.Vector3()
  private readonly uniforms = {
    uCameraPos: { value: new THREE.Vector3() },
    uCameraTarget: { value: this.target },
    uDiskTilt: { value: 0 },
    uZoom: { value: new THREE.Vector2() },
    uTime: { value: 0 },
    uScrollVelocity: { value: 0 },
    uTurbulence: { value: 0.84 },
    uColorTemp: { value: 0 },
    uDissolve: { value: 0 },
    uRingPulse: { value: 0 },
    uDiskEmission: { value: 1 },
    uResolution: { value: new THREE.Vector2() },
    uNoise: { value: makeNoiseTexture() },
  }
  readonly mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      defines: diskDefines,
      vertexShader: `
        varying vec2 vScreen;
        void main() {
          vScreen = position.xy;
          gl_Position = vec4(position.xy, 1.0, 1.0);
        }
      `,
      fragmentShader,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    }),
  )
  private azimuth = 0
  private elevation = 0.16
  private distance = 8.6
  private scale = 1
  private hover = 0
  private warp = 1
  private fovBreathing = 0

  constructor(camera: THREE.PerspectiveCamera, drawingBufferSize: THREE.Vector2) {
    this.camera = camera
    this.uniforms.uResolution.value = drawingBufferSize
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = -1
  }

  private readonly camera: THREE.PerspectiveCamera

  /** Orbit angles are radians and distance is in critical impact radii. */
  setCameraOrbit(azimuth: number, elevation: number, distance = this.distance) {
    this.azimuth = azimuth
    this.elevation = THREE.MathUtils.clamp(elevation, -1.4, 1.4)
    this.distance = Math.max(distance, 5.5)
  }

  setDiskTilt(radians: number) {
    this.uniforms.uDiskTilt.value = radians
  }

  /** Set the zoom multiplier and the world-space point to frame. */
  setScaleOffset(scale: number, x = 0, y = 0, z = 0) {
    this.scale = THREE.MathUtils.clamp(scale, 0.25, 3)
    this.target.set(x, y, z)
  }

  setHoverIntensity(intensity: number) {
    this.hover = THREE.MathUtils.clamp(intensity, 0, 1)
  }

  setWarpFactor(factor: number) {
    this.warp = THREE.MathUtils.clamp(factor, 0, 3)
  }

  setFovBreathing(degrees: number) {
    this.fovBreathing = THREE.MathUtils.clamp(degrees, 0, 3)
  }

  setDissolve(amount: number) {
    this.uniforms.uDissolve.value = THREE.MathUtils.clamp(amount, 0, 1)
  }

  setRingPulse(amount: number) {
    this.uniforms.uRingPulse.value = THREE.MathUtils.clamp(amount, 0, 1)
  }

  setDiskEmission(amount: number) {
    this.uniforms.uDiskEmission.value = THREE.MathUtils.clamp(amount, 0, 1)
  }

  get diskTilt() {
    return this.uniforms.uDiskTilt.value
  }

  get warpVelocity() {
    return this.uniforms.uScrollVelocity.value
  }

  update(state: State) {
    const horizontal = this.distance * Math.cos(this.elevation)
    this.camera.position.set(
      horizontal * Math.sin(this.azimuth),
      this.distance * Math.sin(this.elevation),
      horizontal * Math.cos(this.azimuth),
    )
    this.camera.lookAt(this.target)
    const zoom = this.scale * THREE.MathUtils.clamp(this.camera.aspect / 1.06, 0.45, 1)
    const fov = 36 + this.fovBreathing
    if (this.camera.zoom !== zoom || this.camera.fov !== fov) {
      this.camera.zoom = zoom
      this.camera.fov = fov
      this.camera.updateProjectionMatrix()
    }

    const halfHeight = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) / zoom
    this.uniforms.uCameraPos.value.copy(this.camera.position)
    this.uniforms.uZoom.value.set(halfHeight * this.camera.aspect, halfHeight)
    this.uniforms.uTime.value = state.reducedMotion ? 0 : state.time
    this.uniforms.uScrollVelocity.value = state.reducedMotion ? 0 : state.smoothedVelocity * this.warp
    this.uniforms.uTurbulence.value = 0.84 + 0.16 * this.hover
    this.uniforms.uColorTemp.value = 0.16 * this.hover
  }

  destroy() {
    this.mesh.removeFromParent()
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
    this.uniforms.uNoise.value.dispose()
  }
}
