import * as THREE from 'three'
import {
  matCarbon,
  matChrome,
  matGold,
  matScreen,
  matSkin,
  matWhite,
} from './prostheticMaterials'

function box(w, h, d, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

function cyl(rt, rb, h, material, segments = 16) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(rt, rb, h, segments),
    material,
  )
  mesh.castShadow = true
  return mesh
}

/**
 * Brazo transradial con prótesis estilizada (paneles blancos + carbono + AX-7).
 * @returns {THREE.Group}
 */
export function createProstheticArm() {
  const root = new THREE.Group()
  root.name = 'prosthetic-arm'

  const upperArm = cyl(0.14, 0.16, 0.55, matSkin())
  upperArm.position.y = 0.95
  root.add(upperArm)

  const socket = cyl(0.17, 0.19, 0.12, matGold())
  socket.position.y = 0.58
  root.add(socket)

  const forearmShell = box(0.28, 0.62, 0.22, matWhite())
  forearmShell.position.set(0, 0.18, 0)
  root.add(forearmShell)

  const carbonPanel = box(0.12, 0.5, 0.24, matCarbon())
  carbonPanel.position.set(0.1, 0.18, 0)
  root.add(carbonPanel)

  const elbow = cyl(0.11, 0.11, 0.08, matChrome(), 24)
  elbow.rotation.z = Math.PI / 2
  elbow.position.set(0, 0.52, 0)
  root.add(elbow)

  const wristRing = cyl(0.1, 0.1, 0.06, matChrome(), 24)
  wristRing.position.y = -0.1
  root.add(wristRing)

  const palm = box(0.22, 0.08, 0.28, matWhite())
  palm.position.set(0, -0.22, 0.04)
  root.add(palm)

  const screen = box(0.1, 0.06, 0.02, matScreen())
  screen.position.set(0.08, 0.05, 0.12)
  root.add(screen)

  const fingerOffsets = [-0.08, -0.02, 0.04, 0.1]
  fingerOffsets.forEach((x, i) => {
    const finger = box(0.035, 0.14, 0.035, i === 3 ? matGold() : matWhite())
    finger.position.set(x, -0.34, 0.1)
    root.add(finger)
  })

  const thumb = box(0.04, 0.1, 0.04, matCarbon())
  thumb.position.set(-0.12, -0.2, 0.08)
  thumb.rotation.z = 0.45
  root.add(thumb)

  root.rotation.x = -0.15
  root.rotation.z = 0.2
  return root
}
