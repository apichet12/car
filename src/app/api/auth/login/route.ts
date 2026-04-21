import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { signToken } from '@/lib/jwt'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password)
      return NextResponse.json({ error: 'กรุณากรอกอีเมลและรหัสผ่าน' }, { status: 400 })

    const user: any = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return NextResponse.json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 })

    const token = signToken({ userId: user.id, email: user.email, role: user.role as 'USER' | 'ADMIN', name: user.name })

    const res = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      redirectTo: user.role === 'ADMIN' ? 'admin' : 'home',
    })
    res.cookies.set('token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/', sameSite: 'lax' })
    return res
  } catch (e) {
    console.error('LOGIN ERROR:', e)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}
