import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(payload.userId) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    })
  } catch {
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
