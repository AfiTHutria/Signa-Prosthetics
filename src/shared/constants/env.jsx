export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? '',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  livekitUrl: import.meta.env.VITE_LIVEKIT_URL ?? '',
  /** Base URL de signa-api (entrevista de voz / intake-agent) */
  intakeApiUrl: import.meta.env.VITE_INTAKE_API_URL ?? '',
  /** GET — reporte clínico para panel profesional */
  reportApiUrl: import.meta.env.VITE_REPORT_API_URL ?? '',
}

/** LiveKit listo cuando hay URL pública y backend de tokens */
export function isLiveKitConfigured() {
  return Boolean(env.livekitUrl && env.apiUrl)
}

/** Entrevista de voz configurada cuando apunta a signa-api */
export function isIntakeConfigured() {
  return Boolean(env.intakeApiUrl)
}
