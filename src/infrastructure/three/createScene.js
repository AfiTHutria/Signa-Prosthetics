import * as THREE from 'three'

export function createBasicScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0f172a)

  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
  camera.position.z = 3

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshStandardMaterial({ color: 0x38bdf8 })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(2, 2, 5)
  scene.add(light)

  return { scene, camera, cube }
}
