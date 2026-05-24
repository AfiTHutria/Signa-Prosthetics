import { ProstheticArmPreview } from '@/presentation/components/three/ProstheticArmPreview'
import styles from './LandingProstheticArm.module.css'

/**
 * Bloque del landing con vista 3D del brazo protésico (Three.js procedural).
 *
 * ─── Integrar tu archivo PLY ───
 * 1. Coloca el .ply en:  public/models/TU_ARCHIVO.ply
 * 2. URL en código:       /models/TU_ARCHIVO.ply
 * 3. Guía completa:       public/models/README.md
 * 4. Sustituye aquí ProstheticArmPreview por tu visor PLY (PlyModelPreview).
 */
export function LandingProstheticArm({ hideHeader = false, layout = 'default' }) {
  return (
    <div
      className={`${styles.root} ${layout === 'hero' ? styles.rootHero : ''}`.trim()}
    >
      {!hideHeader && (
        <div className={styles.header}>
          <p className={styles.label}>Vista previa 3D</p>
          <p className={styles.title}>Tu brazo protésico</p>
        </div>
      )}
      <ProstheticArmPreview layout={layout} />
    </div>
  )
}
