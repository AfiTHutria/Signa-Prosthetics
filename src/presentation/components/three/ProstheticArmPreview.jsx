import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js'

import styles from './ProstheticArmPreview.module.css'

const PLY_URL = '/models/Prueba_peso.ply'

export function ProstheticArmPreview({ layout = 'default' }) {
  const wrapClass =
    layout === 'hero'
      ? `${styles.wrap} ${styles.wrapHero}`
      : styles.wrap
  const mountRef = useRef(null)

  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const mount = mountRef.current

    if (!mount) return

    let animationFrame

    // ESCENA
    const scene = new THREE.Scene()

    scene.background = new THREE.Color('#eef5ee')

    // TAMAÑO
    const width = mount.clientWidth || 500
    const height = mount.clientHeight || 500

    // CAMARA
    const camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      0.0001,
      100000
    )

    camera.position.set(0, 0, 200)

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })

    renderer.setSize(width, height)

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    )

    renderer.shadowMap.enabled = true

    renderer.outputColorSpace =
      THREE.SRGBColorSpace

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping

    renderer.toneMappingExposure = 1.2

    mount.appendChild(renderer.domElement)

    // LUCES
    const ambientLight =
      new THREE.AmbientLight(
        0xffffff,
        2
      )

    scene.add(ambientLight)

    const directionalLight =
      new THREE.DirectionalLight(
        0xffffff,
        3
      )

    directionalLight.position.set(
      100,
      100,
      100
    )

    directionalLight.castShadow = true

    scene.add(directionalLight)

    const backLight =
      new THREE.DirectionalLight(
        0xb8e0ff,
        2
      )

    backLight.position.set(
      -100,
      50,
      -100
    )

    scene.add(backLight)




    // CONTROLES
    const controls = new OrbitControls(
      camera,
      renderer.domElement
    )

    controls.enableDamping = true

    controls.dampingFactor = 0.05

    controls.autoRotate = true

    controls.autoRotateSpeed = 20

    controls.enablePan = false

    controls.enableZoom = false

    controls.enableRotate = true

    // GRUPO
    const group = new THREE.Group()

    scene.add(group)

    // LOADER
    const loader = new PLYLoader()

    loader.load(
      PLY_URL,

      (geometry) => {
        console.log('PLY CARGADO')
        console.log(geometry)

        geometry.computeVertexNormals()

        geometry.center()

        // MATERIAL DEBUG
        const material =
          new THREE.MeshPhysicalMaterial({
            color: 0xf5f5f5,
            metalness: 0.1,
            roughness: 0.35,
            clearcoat: 1,
            clearcoatRoughness: 0.1,
            side: THREE.DoubleSide,
          })

        const mesh = new THREE.Mesh(
          geometry,
          material
        )

        // ROTACION
        mesh.rotation.x = -Math.PI / 2

        // ESCALA
        mesh.scale.set(
          100,
          100,
          100
        )

        mesh.castShadow = true

        mesh.receiveShadow = true

        group.add(mesh)

        // BOUNDING BOX
        const box = new THREE.Box3().setFromObject(
          mesh
        )

        const size = box.getSize(
          new THREE.Vector3()
        )

        const center = box.getCenter(
          new THREE.Vector3()
        )

        console.log('SIZE', size)
        console.log('CENTER', center)

        const maxDim = Math.max(
          size.x,
          size.y,
          size.z
        )

        // CAMARA
        camera.position.set(
          center.x,
          center.y,
          maxDim * 1.5
        )

        camera.lookAt(center)

        controls.target.copy(center)

        controls.update()

        setStatus('ready')
      },

      (xhr) => {
        console.log(
          `${(
            (xhr.loaded / xhr.total) *
            100
          ).toFixed(2)}% cargado`
        )
      },

      (error) => {
        console.error(
          'ERROR CARGANDO PLY',
          error
        )

        setStatus('error')
      }
    )

    // ANIMACION
    const animate = () => {
      animationFrame =
        requestAnimationFrame(animate)

      controls.update()

      renderer.render(scene, camera)
    }

    animate()

    // RESIZE
    const handleResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight

      camera.aspect = w / h

      camera.updateProjectionMatrix()

      renderer.setSize(w, h)
    }

    window.addEventListener(
      'resize',
      handleResize
    )

    // CLEANUP
    return () => {
      cancelAnimationFrame(
        animationFrame
      )

      window.removeEventListener(
        'resize',
        handleResize
      )

      controls.dispose()

      renderer.dispose()

      if (
        renderer.domElement &&
        mount.contains(
          renderer.domElement
        )
      ) {
        mount.removeChild(
          renderer.domElement
        )
      }
    }
  }, [])

  return (
    <div className={wrapClass}>
      <div
        ref={mountRef}
        className={styles.canvas}
      />

      {status === 'loading' && (
        <div className={styles.overlay}>
          <span className={styles.loader}>
            Cargando modelo 3D...
          </span>
        </div>
      )}

      {status === 'error' && (
        <div className={styles.overlay}>
          <span className={styles.error}>
            Error cargando modelo PLY
          </span>
        </div>
      )}

      {status === 'ready' && (
        <p className={styles.hint}>
          Arrastra para rotar el modelo
        </p>
      )}
    </div>
  )
}