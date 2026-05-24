import { AlertTriangle, Box, ExternalLink, RefreshCw } from 'lucide-react'
import styles from './PatientReportPanel.module.css'

function Section({ title, children }) {
  return (
    <section className={styles.section}>
      <h4 className={styles.sectionTitle}>{title}</h4>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  )
}

function Row({ label, value }) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div className={styles.row}>
      <dt className={styles.rowLabel}>{label}</dt>
      <dd className={styles.rowValue}>{String(value)}</dd>
    </div>
  )
}

function TagList({ items }) {
  if (!items?.length) return <p className={styles.muted}>—</p>
  return (
    <ul className={styles.tagList}>
      {items.map((item) => (
        <li key={item} className={styles.tag}>
          {item}
        </li>
      ))}
    </ul>
  )
}

function ModelLink({ href, label }) {
  if (!href) {
    return <p className={styles.muted}>No disponible</p>
  }
  return (
    <a href={href} className={styles.modelLink} target="_blank" rel="noreferrer">
      <Box size={16} aria-hidden />
      {label}
      <ExternalLink size={14} aria-hidden />
    </a>
  )
}

export function PatientReportPanel({ report, status, error, onReload, fromDemo = false }) {
  if (status === 'loading') {
    return (
      <div className={styles.state}>
        <p>Cargando reporte clínico…</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className={styles.stateError}>
        <AlertTriangle size={20} aria-hidden />
        <p>{error}</p>
        {onReload && (
          <button type="button" className={styles.reloadBtn} onClick={onReload}>
            <RefreshCw size={14} aria-hidden />
            Reintentar
          </button>
        )}
      </div>
    )
  }

  if (!report) return null

  const pp = report.patientProfile
  const ap = report.amputationProfile
  const rl = report.residualLimbStatus
  const fg = report.functionalGoals
  const dp = report.designPreferences
  const pc = report.patientConcerns
  const pf = report.professionalFlags

  const displayName = pp.full_name?.trim() || 'Paciente'

  return (
    <div className={styles.panel}>
      <header className={styles.patientHero}>
        <p className={styles.patientHeroLabel}>Paciente</p>
        <h3 className={styles.patientHeroName}>{displayName}</h3>
        {pp.occupation_or_daily_role && (
          <p className={styles.patientHeroMeta}>{pp.occupation_or_daily_role}</p>
        )}
      </header>

      {fromDemo && (
        <p className={styles.demoBanner}>
          Mostrando datos de demostración (la API no respondió o no está configurada).
        </p>
      )}

      {onReload && (
        <button type="button" className={styles.reloadBtnTop} onClick={onReload}>
          <RefreshCw size={14} aria-hidden />
          Actualizar desde API
        </button>
      )}

      {(pf.requires_skin_review || pf.requires_pain_review) && (
        <div className={styles.alerts}>
          {pf.requires_skin_review && (
            <span className={styles.alert}>Revisión de piel requerida</span>
          )}
          {pf.requires_pain_review && (
            <span className={styles.alert}>Revisión de dolor requerida</span>
          )}
        </div>
      )}

      <Section title="Perfil del paciente">
        <dl className={styles.dl}>
          <Row label="Nombre completo" value={pp.full_name} />
          <Row label="Edad" value={pp.age != null ? `${pp.age} años` : null} />
          <Row label="Estatura" value={pp.height_cm ? `${pp.height_cm} cm` : null} />
          <Row label="Peso" value={pp.weight_kg ? `${pp.weight_kg} kg` : null} />
          <Row label="Ocupación / rol diario" value={pp.occupation_or_daily_role} />
          <Row label="Lado dominante" value={pp.dominant_side} />
        </dl>
      </Section>

      <Section title="Amputación">
        <dl className={styles.dl}>
          <Row label="Miembro" value={ap.limb} />
          <Row label="Lado" value={ap.side} />
          <Row label="Nivel reportado" value={ap.level_reported} />
          <Row label="Nivel interpretado" value={ap.level_interpreted} />
          <Row label="Causa" value={ap.cause_category} />
          <Row label="Detalle" value={ap.cause_detail} />
          <Row label="Tiempo desde amputación" value={ap.time_since_amputation} />
          <Row
            label="Uso previo de prótesis"
            value={ap.previous_prosthesis_use ? 'Sí' : 'No'}
          />
        </dl>
      </Section>

      <Section title="Estado del muñón">
        <dl className={styles.dl}>
          <Row label="Dolor presente" value={rl.pain_present ? 'Sí' : 'No'} />
          <Row label="Escala de dolor (0–10)" value={rl.pain_score_0_10} />
          <Row label="Dolor fantasma" value={rl.phantom_pain ? 'Sí' : 'No'} />
          <Row label="Herida abierta" value={rl.open_wound_reported ? 'Sí' : 'No'} />
          <Row label="Zonas sensibles" value={rl.sensitivity_areas} />
          <Row
            label="Cambios de volumen"
            value={rl.volume_changes_reported ? 'Reportados' : 'No reportados'}
          />
        </dl>
        <p className={styles.subLabel}>Problemas de piel</p>
        <TagList items={rl.skin_issues} />
      </Section>

      <Section title="Objetivos funcionales">
        <dl className={styles.dl}>
          <Row label="Objetivo principal" value={fg.main_goal} />
          <Row label="Horas de uso diario" value={fg.daily_use_expected_hours} />
          <Row label="Nivel de actividad" value={fg.activity_level} />
        </dl>
        <p className={styles.subLabel}>Actividades prioritarias</p>
        <TagList items={fg.priority_activities} />
        <p className={styles.subLabel}>Entorno</p>
        <TagList items={fg.environment} />
      </Section>

      <Section title="Preferencias de diseño">
        <dl className={styles.dl}>
          <Row label="Apariencia" value={dp.appearance_preference} />
          <Row label="Color / estilo" value={dp.color_or_style} />
          <Row
            label="Interés en personalización"
            value={dp.customization_interest ? 'Sí' : 'No'}
          />
        </dl>
        <p className={styles.subLabel}>Prioridades</p>
        <TagList items={dp.top_priorities} />
      </Section>

      <Section title="Preocupaciones del paciente">
        <dl className={styles.dl}>
          <Row label="Principal preocupación" value={pc.main_concern} />
          <Row label="Expectativas" value={pc.expectations} />
        </dl>
      </Section>

      <Section title="Indicadores clínicos">
        <dl className={styles.dl}>
          <Row label="Confianza de la información" value={pf.information_confidence} />
        </dl>
        <p className={styles.subLabel}>Datos faltantes</p>
        <TagList items={pf.missing_data} />
      </Section>

      <Section title="Modelos 3D (STL)">
        <p className={styles.subLabel}>Miembro / muñón</p>
        <ModelLink href={report.modeloMiembro} label="Abrir modelo del miembro" />
        <p className={styles.subLabel}>Prótesis</p>
        <ModelLink href={report.modeloProtesis} label="Abrir modelo de prótesis" />
      </Section>
    </div>
  )
}
