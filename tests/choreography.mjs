import assert from 'node:assert/strict'
import { Choreography } from '../src/scene/Choreography.ts'

function capture(aspect = 16 / 9) {
  const values = {}
  const target = new Proxy({ camera: { aspect } }, {
    get(object, key) {
      return key in object ? object[key] : (...args) => { values[key] = args }
    },
  })
  const choreography = new Choreography(target, target)
  return (progress, extra = {}) => {
    choreography.update({
      progress, delta: 1 / 60, reducedMotion: false, smoothedVelocity: 0,
      hoveredProjectIndex: null, mouse: { x: 0, y: 0 }, ...extra,
    })
    return { ...values }
  }
}

const start = capture()(0)
assert.deepEqual(capture()(1), start)
assert.ok(capture(1)(0).setScaleOffset[1] === 0)
const epsilon = 0.00001
const left = capture()(1 - epsilon)
const right = capture()(epsilon)
for (const [key, values] of Object.entries(start)) {
  values.forEach((value, index) => {
    const incoming = (value - left[key][index]) / epsilon
    const outgoing = (right[key][index] - value) / epsilon
    assert.ok(Math.abs(incoming - outgoing) < 0.002, `Seam tangent mismatch for ${key}`)
  })
}

assert.deepEqual(capture()(0.36).setParticleMorph, [1, 0, 0])
assert.deepEqual(capture()(0.65).setParticleMorph, [0, 1, 0])
assert.deepEqual(capture()(0.89).setParticleMorph, [0, 0, 1])
assert.equal(capture()(0.95).setRingPulse[0], 1)
assert.deepEqual(capture()(0.89, { reducedMotion: true }), start)

const work = capture()
work(0.65)
const reacting = work(0.65, { hoveredProjectIndex: 0, smoothedVelocity: 100 })
assert.ok(reacting.setHoverIntensity[0] > 0 && reacting.setHoverIntensity[0] < 1)
assert.ok(reacting.setFovBreathing[0] > 0 && reacting.setFovBreathing[0] < 3)

const landing = capture()
landing(0.999)
const wrapped = landing(0.001)
assert.ok(Math.abs(wrapped.setCameraOrbit[2] - start.setCameraOrbit[2]) < 0.0001)
console.log('Choreography seam, morphs, recoil, and input damping passed.')
