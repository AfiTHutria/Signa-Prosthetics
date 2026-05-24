/** Datos de ejemplo (misma forma que GET /datos_reporte) para demo si la API no responde. */
export const DEMO_REPORT_RAW = {
  patient_profile: {
    full_name: 'Carlos Mendoza López',
    age: 34,
    height_cm: 172,
    weight_kg: 78,
    occupation_or_daily_role: 'trabajo de pie en comercio',
    dominant_side: 'derecho',
  },
  amputation_profile: {
    limb: 'inferior',
    side: 'izquierdo',
    level_reported: 'debajo de la rodilla',
    level_interpreted: 'transtibial probable',
    cause_category: 'traumatica',
    cause_detail: 'accidente de moto',
    time_since_amputation: '2 años',
    previous_prosthesis_use: true,
  },
  residual_limb_status: {
    pain_present: true,
    pain_score_0_10: 4,
    phantom_pain: false,
    skin_issues: ['irritación ocasional', 'sudoración'],
    open_wound_reported: false,
    sensitivity_areas: 'zona distal',
    volume_changes_reported: true,
  },
  functional_goals: {
    main_goal: 'caminar y trabajar con mayor estabilidad',
    daily_use_expected_hours: 8,
    activity_level: 'moderado',
    priority_activities: [
      'caminar en calle',
      'subir escaleras',
      'usar transporte público',
    ],
    environment: ['clima caluroso', 'terreno urbano', 'transporte público'],
  },
  design_preferences: {
    top_priorities: ['comodidad', 'resistencia', 'facilidad para poner y quitar'],
    appearance_preference: 'discreta/natural',
    color_or_style: 'sin preferencia específica',
    customization_interest: false,
  },
  patient_concerns: {
    main_concern: 'que le genere dolor después de varias horas',
    expectations: 'poder trabajar sin depender tanto de otras personas',
  },
  professional_flags: {
    requires_skin_review: true,
    requires_pain_review: true,
    information_confidence: 'media',
    missing_data: [
      'medidas clínicas exactas',
      'escaneo del muñón',
      'evaluación presencial',
    ],
  },
  'modelo miembro':
    'https://fbe1df8685fc6f9ce874778cf7ed4c62.r2.cloudflarestorage.com/signa/models/miembro-izquierdo-transtibial.stl?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=639f0233570b7351bef185baa2a1eafd%2F20260524%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260524T001604Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=4b9fca02d5982ed8095300ad42500f65cc0855c56845fbbb2d60e3fa327a2625',
  'modelo protesis':
    'https://fbe1df8685fc6f9ce874778cf7ed4c62.r2.cloudflarestorage.com/signa/models/protesis-izquierda-transtibial.stl?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=639f0233570b7351bef185baa2a1eafd%2F20260524%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260524T001604Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=37971d77ae2554dfa506c61abd61b4ec1ae25bf055e3840915f4d4ad37f1368c',
}
