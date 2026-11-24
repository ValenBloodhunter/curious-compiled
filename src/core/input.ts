import type { PointerState } from './state'

export function createInput() {
  const listeners = new AbortController()
  const { signal } = listeners
  let targetX = 0
  let targetY = 0

  function reset() {
    targetX = 0
    targetY = 0
  }

  window.addEventListener('pointermove', (event) => {
    if (!event.isPrimary) return

    targetX = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth) * 2 - 1))
    targetY = Math.max(-1, Math.min(1, 1 - (event.clientY / window.innerHeight) * 2))
  }, { passive: true, signal })
  window.addEventListener('pointerup', (event) => {
    if (event.isPrimary && event.pointerType !== 'mouse') reset()
  }, { signal })
  window.addEventListener('pointercancel', reset, { signal })
  window.addEventListener('blur', reset, { signal })
  document.documentElement.addEventListener('pointerleave', reset, { signal })

  return {
    update(previous: PointerState, delta: number, reducedMotion: boolean): PointerState {
      const blend = reducedMotion ? 1 : 1 - Math.exp(-10 * delta)
      return {
        x: previous.x + (targetX - previous.x) * blend,
        y: previous.y + (targetY - previous.y) * blend,
        targetX,
        targetY,
      }
    },
    destroy() {
      listeners.abort()
    },
  }
}
