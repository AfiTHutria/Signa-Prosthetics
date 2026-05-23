import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import styles from './SceneCanvas.module.css'

function RotatingCube() {
  const meshRef = useRef(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.6
      meshRef.current.rotation.y += delta * 0.8
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial color="#38bdf8" />
    </mesh>
  )
}

export function SceneCanvas() {
  return (
    <div className={styles.wrapper}>
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 3, 5]} intensity={1} />
        <RotatingCube />
      </Canvas>
    </div>
  )
}
