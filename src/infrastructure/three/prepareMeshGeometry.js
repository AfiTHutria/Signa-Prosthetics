import * as THREE from 'three'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { SimplifyModifier } from 'three/addons/modifiers/SimplifyModifier.js'

const TARGET_SIZE = 1.4
const MAX_VERTICES = 55000

/**
 * Centra, escala y simplifica geometría 3D (STL u otros meshes) para el visor web.
 * @param {THREE.BufferGeometry} geometry
 */
export function prepareMeshGeometry(geometry) {
  let geo = geometry

  if (geo.index) {
    geo = geo.toNonIndexed()
  }

  geo = mergeVertices(geo)
  geo.computeVertexNormals()

  const vertexCount = geo.attributes.position.count
  if (vertexCount > MAX_VERTICES) {
    const modifier = new SimplifyModifier()
    geo = modifier.modify(geo, vertexCount - MAX_VERTICES)
    geo.computeVertexNormals()
  }

  geo.center()
  geo.computeBoundingBox()

  const size = new THREE.Vector3()
  geo.boundingBox.getSize(size)
  const maxDim = Math.max(size.x, size.y, size.z) || 1
  const scale = TARGET_SIZE / maxDim
  geo.scale(scale, scale, scale)
  geo.computeBoundingBox()
  geo.computeBoundingSphere()

  return geo
}

/**
 * Dimensiones del bounding box tras normalizar.
 * @param {THREE.BufferGeometry} geometry
 */
export function getMeshDimensions(geometry) {
  const box = geometry.boundingBox ?? new THREE.Box3().setFromBufferAttribute(geometry.attributes.position)
  const size = new THREE.Vector3()
  box.getSize(size)
  return {
    width: size.x,
    height: size.y,
    depth: size.z,
  }
}
