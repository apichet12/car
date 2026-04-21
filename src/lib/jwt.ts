import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'catty-secret-change-in-production'

export interface JWTPayload {
  userId: string
  email: string
  role: 'USER' | 'ADMIN'
  name: string
}

export const signToken = (payload: JWTPayload) =>
  jwt.sign(payload, SECRET, { expiresIn: '7d' })

export const verifyToken = (token: string): JWTPayload | null => {
  try { return jwt.verify(token, SECRET) as JWTPayload }
  catch { return null }
}

export const getTokenPayload = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
    if (payload.exp && payload.exp < Date.now() / 1000) return null
    return payload
  } catch { return null }
}
