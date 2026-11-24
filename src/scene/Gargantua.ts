import * as THREE from 'three'
import type { State } from '../core/state'
import fragmentShader from './shaders/gargantua.frag.glsl?raw'

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
  }
  readonly mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      uniforms: this.uniforms,
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

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera
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

  get diskTilt() {
    return this.uniforms.uDiskTilt.value
  }

  get warpVelocity() {
    return this.uniforms.uScrollVelocity.value
  }

  update(state: State) {
    const pointer = state.reducedMotion ? 0 : 1
    const azimuth = this.azimuth + 0.045 * state.mouse.x * pointer
    const elevation = this.elevation + 0.027 * state.mouse.y * pointer
    const horizontal = this.distance * Math.cos(elevation)
    this.camera.position.set(
      horizontal * Math.sin(azimuth),
      this.distance * Math.sin(elevation),
      horizontal * Math.cos(azimuth),
    )
    this.camera.lookAt(this.target)
    const zoom = this.scale * THREE.MathUtils.clamp(this.camera.aspect / 1.06, 0.45, 1)
    if (this.camera.zoom !== zoom) {
      this.camera.zoom = zoom
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
  }
}
