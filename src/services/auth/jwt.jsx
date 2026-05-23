const SECRET = 'signa-prosthetics-demo-secret'

function base64UrlEncode(value) {
  const json = typeof value === 'string' ? value : JSON.stringify(value)
  return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/')
  return atob(padded)
}

export function signJwt(payload, expiresInMs = 1000 * 60 * 60 * 24) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const body = { ...payload, iat: Date.now(), exp: Date.now() + expiresInMs }
  return [base64UrlEncode(header), base64UrlEncode(body), base64UrlEncode(SECRET)].join('.')
}

export function verifyJwt(token) {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    if (parts[2] !== base64UrlEncode(SECRET)) return null
    const payload = JSON.parse(base64UrlDecode(parts[1]))
    if (!payload.exp || payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}
