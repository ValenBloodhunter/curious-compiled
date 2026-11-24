import { createElement, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './styles/foundation.css'
import { createInput } from './core/input'
import { createScroll } from './core/scroll'
import { publishState, state } from './core/state'
import { Choreography } from './scene/Choreography'
import { Gargantua } from './scene/Gargantua'
import { SceneManager } from './scene/SceneManager'
import { MotionUI } from './ui/MotionUI'

function start(canvas: HTMLCanvasElement, container: HTMLElement) {
  const context = canvas.getContext('webgl2')
  const scene = context?.getExtension('EXT_color_buffer_float')
    ? new SceneManager(canvas, context)
    : undefined
  const gargantua = scene && new Gargantua(scene.camera)
  if (gargantua) scene?.scene.add(gargantua.mesh)

  const scroll = createScroll(container)
  const input = createInput()
  const choreography = scene && gargantua && new Choreography(gargantua, scene)
  const motionUI = new MotionUI()
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  let startTime: number | undefined
  let previousTime: number | undefined
  let frameId = requestAnimationFrame(frame)

  function frame(now: number) {
    startTime ??= now
    const delta = Math.min((now - (previousTime ?? now)) / 1000, 0.05)
    previousTime = now
    const reducedMotion = motionPreference.matches
    const next = publishState({
      ...scroll.update(now, delta, state),
      time: (now - startTime) / 1000,
      delta,
      mouse: input.update(state.mouse, delta, reducedMotion),
      hoveredProjectIndex: state.hoveredProjectIndex,
      reducedMotion,
    })

    choreography?.update(next)
    gargantua?.update(next)
    motionUI.update(next)
    if (gargantua) scene?.render(next, gargantua.diskTilt, gargantua.warpVelocity)
    frameId = requestAnimationFrame(frame)
  }

  return () => {
    cancelAnimationFrame(frameId)
    scroll.destroy()
    input.destroy()
    gargantua?.destroy()
    scene?.destroy()
  }
}

function FoundationRuntime() {
  useEffect(() => {
    const canvas = document.getElementById('webgl')
    const container = document.getElementById('scroll-container')
    if (canvas instanceof HTMLCanvasElement && container) return start(canvas, container)
  }, [])

  return null
}

const root = createRoot(document.getElementById('runtime')!)
root.render(createElement(FoundationRuntime))
import.meta.hot?.dispose(() => root.unmount())
