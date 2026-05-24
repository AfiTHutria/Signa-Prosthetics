import * as THREE from 'three'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js'

const stlLoader = new STLLoader()
const plyLoader = new PLYLoader()

export function getMeshExtension(nameOrUrl = '') {
  const clean = String(nameOrUrl).split('?')[0].split('#')[0]
  const match = clean.match(/\.([a-z0-9]+)$/i)
  return match ? match[1].toLowerCase() : ''
}

function parseBuffer(buffer, extension) {
  if (extension === 'stl') {
    return stlLoader.parse(buffer)
  }
  if (extension === 'ply') {
    return plyLoader.parse(buffer)
  }
  throw new Error('Formato no soportado. Usa archivos .stl o .ply')
}

/** Lectura ligera: sin SimplifyModifier (evita cuelgues en mallas grandes). */
export function prepareGeometryForViewer(geometry) {
  const geo = geometry
  geo.computeVertexNormals()
  if (typeof geo.center === 'function') {
    geo.center()
  }
  geo.computeBoundingBox()
  geo.computeBoundingSphere()
  return geo
}

export function loadMeshFromArrayBuffer(buffer, fileName = '') {
  const ext = getMeshExtension(fileName)
  if (!ext) {
    throw new Error('No se reconoce la extensión del archivo (.stl o .ply)')
  }
  const geometry = parseBuffer(buffer, ext)
  return prepareGeometryForViewer(geometry)
}

export function loadMeshFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No se seleccionó ningún archivo'))
      return
    }

    const ext = getMeshExtension(file.name)
    if (ext !== 'stl' && ext !== 'ply') {
      reject(new Error('Solo se admiten archivos .stl o .ply'))
      return
    }

    const loader = ext === 'stl' ? stlLoader : plyLoader
    const objectUrl = URL.createObjectURL(file)

    loader.load(
      objectUrl,
      (geometry) => {
        URL.revokeObjectURL(objectUrl)
        try {
          resolve(prepareGeometryForViewer(geometry))
        } catch (err) {
          reject(err instanceof Error ? err : new Error('No se pudo procesar el modelo'))
        }
      },
      undefined,
      (err) => {
        URL.revokeObjectURL(objectUrl)
        reject(err instanceof Error ? err : new Error('No se pudo leer el archivo'))
      }
    )
  })
}

export function loadMeshFromUrl(url, fileName = '') {
  const ext = getMeshExtension(fileName || url)
  if (!ext) {
    return Promise.reject(new Error('URL sin extensión .stl o .ply'))
  }

  const loader = ext === 'stl' ? stlLoader : plyLoader

  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (geometry) => {
        try {
          resolve(prepareGeometryForViewer(geometry))
        } catch (err) {
          reject(err instanceof Error ? err : new Error('No se pudo procesar el modelo'))
        }
      },
      undefined,
      () => {
        reject(new Error('No se pudo descargar el modelo (CORS, enlace caducado o red)'))
      }
    )
  })
}

/**
 * Escala y encuadra la cámara como en el visor del landing.
 * @param {THREE.Mesh} mesh
 * @param {THREE.PerspectiveCamera} camera
 * @param {import('three/addons/controls/OrbitControls.js').OrbitControls} controls
 */
export function fitMeshToView(mesh, camera, controls) {
  mesh.rotation.x = -Math.PI / 2

  const box = new THREE.Box3().setFromObject(mesh)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  let maxDim = Math.max(size.x, size.y, size.z, 0.0001)

  if (maxDim < 5) {
    const boost = 100 / maxDim
    mesh.scale.set(boost, boost, boost)
    box.setFromObject(mesh)
    box.getSize(size)
    box.getCenter(center)
    maxDim = Math.max(size.x, size.y, size.z, 0.0001)
  }

  controls.target.copy(center)
  camera.position.set(center.x, center.y, center.z + maxDim * 1.6)
  camera.lookAt(center)
  controls.update()
}
