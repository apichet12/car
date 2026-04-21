import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, requireUser, getUser, isError } from '@/lib/apiAuth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = Number(params.id)
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 })

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { car: true, user: { select: { name: true, email: true, phone: true } }, addons: true },
    })
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (user.role !== 'ADMIN' && booking.userId !== user.userId)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ booking })
  } catch (error) {
    console.error('BOOKING GET ERROR:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req)
  if (isError(auth)) return auth

  const id = Number(params.id)
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 })

  try {
    const { status, adminNote } = await req.json()
    const booking = await prisma.booking.update({
      where: { id },
      data: { status, adminNote },
    })
    return NextResponse.json({ booking })
  } catch (error) {
    console.error('BOOKING PATCH ERROR:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireUser(req)
  if (isError(auth)) return auth

  const id = Number(params.id)
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 })

  try {
    const booking = await prisma.booking.findUnique({ where: { id } })
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (auth.role !== 'ADMIN' && booking.userId !== auth.userId)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    await prisma.booking.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('BOOKING DELETE ERROR:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
