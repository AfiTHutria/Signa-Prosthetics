/**
 * Respuestas contextuales del acompañante cuando no hay agente LiveKit en la sala.
 * En producción, un LiveKit Agent (worker) reemplaza esta lógica con voz + LLM.
 */

const GREETING =
  'Hola, soy Sofia, tu acompañante de Signa. Puedo orientarte sobre materiales, medidas y el proceso de tu prótesis. ¿En qué te ayudo hoy?'

/**
 * @param {string} userText
 * @param {Record<string, string>} [context]
 */
export function generateCompanionReply(userText, context = {}) {
  const text = userText.toLowerCase().trim()
  const name = context.fullName?.split(' ')[0] ?? 'usuario'
  const amp = context.amputationType ?? 'tu amputación'
  const sport = context.sports ?? 'tu rutina'
  const material = context.material ?? 'fibra de carbono o titanio'
  const prosthetic = context.prostheticType ?? 'mioeléctrica o mecánica'

  if (!text) {
    return `Cuéntame más, ${name}. Puedo ayudarte con tipo de prótesis, materiales o preparación para el escaneo.`
  }

  if (/hola|buenas|hey|saludos/.test(text)) {
    return `¡Hola ${name}! ${GREETING}`
  }

  if (/material|fibra|titanio|silicona/.test(text)) {
    return `Para ${amp} y ${sport}, suele recomendarse ${material}. Valida tolerancia al peso y sensibilidad del muñón con tu ortopedista antes de decidir.`
  }

  if (/deporte|cicl|natac|correr|gym/.test(text)) {
    return `Con ${sport} en mente, una prótesis deportiva con ${material} puede darte estabilidad y menor fatiga. ¿Quieres priorizar agarre fino o resistencia?`
  }

  if (/dolor|sensibil|muñón|munon/.test(text)) {
    return `El estado del muñón es clave: ${context.stumpCondition ?? 'describe sensibilidad y cicatrización'}. Si hay dolor agudo, consulta primero a tu profesional antes de ajustar la copla.`
  }

  if (/medida|escaneo|escanear|tamaño/.test(text)) {
    const len = context.stumpLength ? `${context.stumpLength} cm de longitud` : 'longitud del muñón'
    const circ = context.stumpCircumference ? `${context.stumpCircumference} cm de circunferencia` : 'circunferencia'
    return `Para el escaneo guiado necesitamos ${len} y ${circ}. Un video con buena luz y el brazo en neutro mejora la precisión del modelo 3D.`
  }

  if (/tipo|mioeléctric|mecánic|prótesis|protesis/.test(text)) {
    return `Según tu perfil, una opción ${prosthetic} encaja bien con ${amp}. Puedo resumir pros/contras si me dices si priorizas estética, fuerza de agarre o batería.`
  }

  if (/precio|costo|seguro|eps/.test(text)) {
    return 'Los costos dependen del material y componentes electrónicos. Te recomiendo revisar cobertura con tu EPS y cotizar con un taller aliado desde el dashboard.'
  }

  if (/gracias|chao|adiós|bye/.test(text)) {
    return `Gracias a ti, ${name}. Cuando quieras retomar, aquí estaré para seguir con tu prototipo.`
  }

  return `Entiendo tu consulta sobre "${userText}". Con ${amp} y uso ${context.dailyUse ?? 'diario'}, exploraríamos ${prosthetic} en ${material}. ¿Quieres profundizar en función de agarre, estética o sesión de escaneo?`
}

export function getWelcomeMessage(context = {}) {
  const name = context.fullName?.split(' ')[0]
  if (name) {
    return `Hola ${name}, soy Sofia de Signa. Vi que tu perfil indica ${context.amputationType ?? 'amputación'} (${context.side ?? ''}). ${GREETING}`
  }
  return GREETING
}
