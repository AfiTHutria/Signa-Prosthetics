import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {
  fitMeshToView,
  loadMeshFromFile,
  loadMeshFromUrl,
} from '@/infrastructure/three/loadMeshFromSource'
import styles from './MeshModelViewer.module.css'

/**
 * Visor STL/PLY — mismo flujo visual que el landing: leer → mesh → encuadrar cámara.
 */
export function MeshModelViewer({ source, fileName = '' }) {
  const mountRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const mount = mountRef.current
    if (!mount || !source) {
      setStatus('idle')
      return undefined
    }

    let alive = true
    let animationFrame = 0
    let renderer
    let controls
    let material
    const showError = (msg) => {
      if (!alive) return
      setStatus('error')
      setErrorMessage(msg)
    }

    const showReady = () => {
      if (!alive) return
      setStatus('ready')
      setErrorMessage('')
    }

    setStatus('loading')
    setErrorMessage('')

    const setupScene = () => {
      const scene = new THREE.Scene()
      scene.background = new THREE.Color('#eef5ee')

      let width = mount.clientWidth
      let height = mount.clientHeight
      if (width < 4 || height < 4) {
        width = 560
        height = 420
      }

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.0001, 100000)
      camera.position.set(0, 0, 200)

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      mount.appendChild(renderer.domElement)

      scene.add(new THREE.AmbientLight(0xffffff, 2))
      const dir = new THREE.DirectionalLight(0xffffff, 3)
      dir.position.set(100, 100, 100)
      scene.add(dir)
      const back = new THREE.DirectionalLight(0xb8e0ff, 2)
      back.position.set(-100, 50, -100)
      scene.add(back)

      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.enablePan = true
      controls.enableZoom = true
      controls.minDistance = 0.01
      controls.maxDistance = 50000

      material = new THREE.MeshPhysicalMaterial({
        color: 0xf5f5f5,
        metalness: 0.1,
        roughness: 0.35,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide,
      })

      return { scene, camera }
    }

    const { scene, camera } = setupScene()

    const loadPromise =
      source instanceof File
        ? loadMeshFromFile(source)
        : loadMeshFromUrl(String(source), fileName)

    loadPromise
      .then((geometry) => {
        if (!alive) {
          geometry.dispose()
          return
        }

        const mesh = new THREE.Mesh(geometry, material)
        mesh.castShadow = true
        mesh.receiveShadow = true
        scene.add(mesh)

        fitMeshToView(mesh, camera, controls)
        showReady()
      })
      .catch((err) => {
        showError(err?.message || 'Error al cargar el modelo')
      })

    const animate = () => {
      animationFrame = requestAnimationFrame(animate)
      controls?.update()
      if (renderer && scene && camera) {
        renderer.render(scene, camera)
      }
    }
    animate()

    const onResize = () => {
      if (!mount || !renderer || !camera) return
      const w = mount.clientWidth || 560
      const h = mount.clientHeight || 420
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', onResize)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null
    ro?.observe(mount)
    requestAnimationFrame(onResize)

    return () => {
      alive = false
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', onResize)
      ro?.disconnect()
      controls?.dispose()
      material?.dispose()
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
      })
      renderer?.dispose()
      if (renderer?.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [source, fileName])

  return (
    <div className={styles.wrap}>
      <div ref={mountRef} className={styles.canvas} />

      {status === 'loading' && (
        <div className={styles.overlay}>
          <span className={styles.message}>Leyendo y preparando modelo…</span>
        </div>
      )}

      {status === 'error' && (
        <div className={styles.overlay}>
          <span className={styles.error}>{errorMessage}</span>
        </div>
      )}

      {status === 'ready' && (
        <p className={styles.hint}>Arrastra para rotar · rueda para acercar</p>
      )}
    </div>
  )
}
