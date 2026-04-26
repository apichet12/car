// 🔧 FIX: เพิ่ม debug + กัน Prisma error + ไม่ให้ 500 เงียบ

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json()

    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { error: 'All fields required' },
        { status: 400 }
      )
    }

    // 🔍 เช็ค email ซ้ำ
    const exists = await prisma.user.findUnique({
      where: { email }
    })

    if (exists) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      )
    }

    // 🔐 hash password
    const hashed = await bcrypt.hash(password, 10)

    // 💾 สร้าง user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        phone
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (err: any) {
    // 🔥 DEBUG สำคัญ (ดูใน Render logs)
    console.error("REGISTER ERROR FULL:", err)
    console.error("REGISTER ERROR MESSAGE:", err?.message)

    // 🔥 Prisma unique constraint
    if (err?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Duplicate field (unique constraint)' },
        { status: 400 }
      )
    }

    // 🔥 fallback error (ส่ง message จริงออกมา)
    return NextResponse.json(
      { error: err?.message || 'Server error' },
      { status: 500 }
    )
  }
}