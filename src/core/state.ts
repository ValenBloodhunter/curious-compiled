export type PointerState = Readonly<{
  x: number
  y: number
  targetX: number
  targetY: number
}>

export type State = Readonly<{
  progress: number
  velocity: number
  smoothedVelocity: number
  direction: 1 | -1
  time: number
  delta: number
  mouse: PointerState
  activeSection: number
  hoveredProjectIndex: number | null
  reducedMotion: boolean
}>

export let state: State = Object.freeze({
  progress: 0,
  velocity: 0,
  smoothedVelocity: 0,
  direction: 1,
  time: 0,
  delta: 0,
  mouse: Object.freeze({ x: 0, y: 0, targetX: 0, targetY: 0 }),
  activeSection: 0,
  hoveredProjectIndex: null,
  reducedMotion: false,
})

export function publishState(next: State): State {
  Object.freeze(next.mouse)
  state = Object.freeze(next)
  return state
}
