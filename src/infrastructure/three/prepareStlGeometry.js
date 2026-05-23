import { prepareMeshGeometry } from './prepareMeshGeometry'

/** @deprecated Usa prepareMeshGeometry */
export function prepareStlGeometry(geometry) {
  return prepareMeshGeometry(geometry)
}
