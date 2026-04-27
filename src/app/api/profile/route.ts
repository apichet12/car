import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireUser, isError } from '@/lib/apiAuth'
import bcrypt from 'bcryptjs'

// ---------------- GET PROFILE ----------------
export async function GET(req: NextRequest) {
  const auth = requireUser(req)
  if (isError(auth)) return auth

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
        _count: {
          select: { bookings: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('PROFILE GET ERROR:', error)
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    
    // Check if it's a database connection error
    if (errorMsg.includes('Can\'t reach database') || errorMsg.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { error: 'Database connection unavailable. Please try again later.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// ---------------- UPDATE PROFILE ----------------
export async function PUT(req: NextRequest) {
  const auth = requireUser(req)
  if (isError(auth)) return auth

  try {
    const {
      name,
      phone,
      avatar,
      currentPassword,
      newPassword
    } = await req.json()

    const updateData: any = {}

    if (name !== undefined) updateData.name = name
    if (phone !== undefined) updateData.phone = phone
    if (avatar !== undefined) updateData.avatar = avatar

    // ---------------- PASSWORD CHANGE ----------------
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'กรุณากรอกรหัสผ่านปัจจุบัน' },
          { status: 400 }
        )
      }

      const user = await prisma.user.findUnique({
        where: { id: auth.userId }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      const valid = await bcrypt.compare(
        currentPassword,
        user.password
      )

      if (!valid) {
        return NextResponse.json(
          { error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' },
          { status: 400 }
        )
      }

      updateData.password = await bcrypt.hash(newPassword, 12)
    }

    const updated = await prisma.user.update({
      where: { id: auth.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true
      }
    })

    return NextResponse.json({ user: updated })
  } catch (error) {
    console.error('PROFILE UPDATE ERROR:', error)
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    
    // Check if it's a database connection error
    if (errorMsg.includes('Can\'t reach database') || errorMsg.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { error: 'Database connection unavailable. Please try again later.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}