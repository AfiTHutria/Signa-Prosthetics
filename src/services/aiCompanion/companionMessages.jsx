export const COMPANION_MSG = {
  CHAT: 'chat',
  TYPING: 'typing',
  SYSTEM: 'system',
}

/**
 * @param {string} text
 * @param {'user' | 'assistant' | 'system'} from
 */
export function createChatMessage(text, from = 'user') {
  return {
    type: COMPANION_MSG.CHAT,
    message: text.trim(),
    from,
    timestamp: Date.now(),
  }
}

/**
 * @param {unknown} raw
 * @returns {ReturnType<typeof createChatMessage> | null}
 */
export function parseCompanionMessage(raw) {
  if (!raw || typeof raw !== 'object') return null
  const msg = /** @type {Record<string, unknown>} */ (raw)
  if (msg.type !== COMPANION_MSG.CHAT || typeof msg.message !== 'string') return null
  return {
    type: COMPANION_MSG.CHAT,
    message: msg.message,
    from: msg.from === 'assistant' ? 'assistant' : msg.from === 'system' ? 'system' : 'user',
    timestamp: typeof msg.timestamp === 'number' ? msg.timestamp : Date.now(),
  }
}
