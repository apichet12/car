import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, JWTPayload } from './jwt'

export const getUser = (req: NextRequest): JWTPayload | null => {
  const token = req.cookies.get('token')?.value
  return token ? verifyToken(token) : null
}

export const requireUser = (req: NextRequest): JWTPayload | NextResponse => {
  const user = getUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return user
}

export const requireAdmin = (req: NextRequest): JWTPayload | NextResponse => {
  const user = getUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return user
}

export const isError = (v: JWTPayload | NextResponse): v is NextResponse =>
  v instanceof NextResponse
