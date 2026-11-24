import type { State } from '../core/state'
import type { Gargantua } from './Gargantua'
import type { SceneManager } from './SceneManager'

const hero = {
  azimuth: -5, elevation: 5, distance: 8.6, tilt: 14, zoom: 1,
  x: -0.55, y: 0, bloom: 0.45, warp: 0.8, dissolve: 0,
  wave: 0, ring: 0, collapse: 0,
}
const about = {
  azimuth: 3, elevation: 0, distance: 8.6, tilt: 4, zoom: 0.91,
  x: 0.52, y: 0.43, bloom: 0.37, warp: 1.0, dissolve: 0.65,
  wave: 1, ring: 0, collapse: 0,
}
const work = {
  azimuth: 10, elevation: 32, distance: 10.0, tilt: 7, zoom: 0.91,
  x: -1.25, y: 0.08, bloom: 0.40, warp: 1.2, dissolve: 0.84,
  wave: 0, ring: 1, collapse: 0,
}
const contact = {
  azimuth: 0, elevation: 1, distance: 5.5, tilt: 0, zoom: 3,
  x: 0, y: 0, bloom: 0.10, warp: 0.18, dissolve: 0,
  wave: 0, ring: 0, collapse: 1,
}

const keyframes = [
  [0, hero],
  [0.18, { ...hero, azimuth: -1 }],
  [0.35, about],
  [0.42, about],
  [0.63, work],
  [0.76, work],
  [0.887, contact],
  [0.90, contact],
  [1, hero],
] as const

const channels = Object.keys(hero) as (keyof typeof hero)[]
const radians = Math.PI / 180

function ease(t: number) {
  return t * t * t * (10 + t * (-15 + 6 * t))
}

export class Choreography {
  private readonly pose = { ...hero }
  private started = false
  private hover = 0
  private pointerX = 0
  private pointerY = 0
  private fov = 0
  private pulse = 0
  private framing = 0
  private readonly gargantua: Gargantua
  private readonly scene: SceneManager

  constructor(gargantua: Gargantua, scene: SceneManager) {
    this.gargantua = gargantua
    this.scene = scene
  }

  update(state: State) {
    const progress = state.reducedMotion || state.progress === 1 ? 0 : state.progress
    const next = keyframes.findIndex(([at]) => at > progress)
    const [start, from] = keyframes[next - 1]
    const [end, to] = keyframes[next]
    const t = ease((progress - start) / (end - start))
    const blend = !this.started || state.reducedMotion ? 1 : 1 - Math.exp(-8 * state.delta)
    this.started = true

    // The shared hero pose and zero-slope easing make both sides of the seam periodic.
    for (const channel of channels) {
      const target = from[channel] + (to[channel] - from[channel]) * t
      this.pose[channel] += (target - this.pose[channel]) * blend
    }

    const recoil = progress > 0.90 ? (progress - 0.90) / 0.10 : 0
    const pulse = Math.sin(Math.PI * recoil) ** 4
    const hover = progress >= 0.42 && progress <= 0.76 && state.hoveredProjectIndex !== null ? 1 : 0
    const speed = state.reducedMotion ? 0 : Math.abs(state.smoothedVelocity)
    const drift = state.reducedMotion ? 0 : 4 / Math.max(1, Math.hypot(state.mouse.x, state.mouse.y))
    const framing = Math.max(0, Math.min(1, (this.scene.camera.aspect - 1.2) / 0.35))
    this.hover += (hover - this.hover) * blend
    this.pointerX += (state.mouse.x * drift - this.pointerX) * blend
    this.pointerY += (state.mouse.y * drift - this.pointerY) * blend
    this.fov += (3 * (1 - Math.exp(-speed / 16)) - this.fov) * blend
    this.pulse += (pulse - this.pulse) * blend
    this.framing += (framing - this.framing) * blend

    const pose = this.pose
    this.gargantua.setCameraOrbit(
      (pose.azimuth + this.pointerX) * radians,
      (pose.elevation + this.pointerY) * radians,
      pose.distance,
    )
    this.gargantua.setDiskTilt(pose.tilt * radians)
    this.gargantua.setScaleOffset(pose.zoom, pose.x * this.framing, pose.y)
    this.gargantua.setFovBreathing(this.fov)
    this.gargantua.setHoverIntensity(this.hover)
    this.gargantua.setWarpFactor(pose.warp)
    this.gargantua.setDissolve(pose.dissolve)
    this.gargantua.setDiskEmission(1 - 0.96 * pose.collapse)
    this.gargantua.setRingPulse(this.pulse)
    this.scene.setBloomStrength(pose.bloom + 0.085 * this.pulse)
    this.scene.setParticleMorph(pose.wave, pose.ring, pose.collapse)
  }
}
