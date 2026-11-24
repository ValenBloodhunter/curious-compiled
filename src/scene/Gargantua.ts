import * as THREE from 'three'
import type { State } from '../core/state'

export class Gargantua {
  readonly mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 24, 16),
    new THREE.MeshBasicMaterial({ color: 0x83b5ea, wireframe: true }),
  )

  constructor() {
    this.mesh.rotation.x = 0.25
  }

  update(state: State) {
    this.mesh.rotation.y = state.reducedMotion ? 0 : state.progress * Math.PI * 2
  }

  destroy() {
    this.mesh.removeFromParent()
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
  }
}
