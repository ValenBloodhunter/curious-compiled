import Lenis from 'lenis'
import type { State } from './state'

export function createScroll(container: HTMLElement) {
  const sections = Array.from(container.children).slice(0, 4)
  let sectionStarts: number[] = []
  const lenis = new Lenis({
    infinite: true,
    lerp: 0.075,
    smoothWheel: true,
    syncTouch: true,
    autoRaf: false,
    autoResize: false,
  })

  function measure() {
    lenis.resize()
    sectionStarts = sections.map((section) => (section as HTMLElement).offsetTop)
  }

  measure()
  const observer = new ResizeObserver(measure)
  observer.observe(container)

  return {
    update(now: number, delta: number, previous: State) {
      lenis.raf(now)
      const scroll = lenis.limit > 0 ? lenis.scroll : 0
      const velocity = lenis.velocity

      return {
        progress: lenis.limit > 0 ? scroll / lenis.limit : 0,
        velocity,
        smoothedVelocity:
          previous.smoothedVelocity + (velocity - previous.smoothedVelocity) * (1 - Math.exp(-12 * delta)),
        direction: lenis.direction === 0 ? previous.direction : lenis.direction,
        activeSection: Math.max(0, sectionStarts.findLastIndex((start) => scroll >= start)),
      }
    },
    destroy() {
      observer.disconnect()
      lenis.destroy()
    },
  }
}
