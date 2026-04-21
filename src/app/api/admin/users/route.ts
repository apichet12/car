import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, isError } from '@/lib/apiAuth'

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req)
  if (isError(auth)) return auth

  try {
    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      select: {
        id: true, name: true, email: true, phone: true, avatar: true, createdAt: true, updatedAt: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ users })
  } catch (error) {
    console.error('ADMIN USERS ERROR:', error)
    return NextResponse.json({ users: [] })
  }
}
