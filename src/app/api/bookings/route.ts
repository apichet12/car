import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireUser, getUser, isError } from '@/lib/apiAuth'
import { differenceInDays } from 'date-fns'

export async function POST(req: NextRequest) {
  const auth = requireUser(req)
  if (isError(auth)) return auth

  try {
    const { carId, pickupDate, returnDate, slipImage, paymentMethod, addons } =
      await req.json()

    // ✅ carId fix
    const carIdNumber = Number(carId)
    if (!Number.isInteger(carIdNumber)) {
      return NextResponse.json({ error: 'Invalid carId' }, { status: 400 })
    }

    const car = await prisma.car.findUnique({
      where: { id: carIdNumber },
    })

    if (!car || !car.isAvailable) {
      return NextResponse.json(
        { error: 'รถไม่ว่างในขณะนี้' },
        { status: 400 }
      )
    }

    const pickup = new Date(pickupDate)
    const returnD = new Date(returnDate)

    const totalDays = differenceInDays(returnD, pickup)
    if (totalDays < 1) {
      return NextResponse.json({ error: 'วันที่ไม่ถูกต้อง' }, { status: 400 })
    }

    const addonsTotal = (addons || []).reduce(
      (s: number, a: any) => s + (a.price || 0),
      0
    )

    const booking = await prisma.booking.create({
      data: {
        userId: auth.userId,
        carId: carIdNumber,

        // 🔥 IMPORTANT: ต้องใช้ชื่อจาก Prisma schema
        startDate: pickup,
        endDate: returnD,

        totalPrice: totalDays * car.pricePerDay + addonsTotal,

        paymentProof: slipImage || null,
        notes: null,

        status: 'PENDING',
      },
      include: {
        car: true,
      },
    })

    return NextResponse.json({ booking }, { status: 201 })
  } catch (e: any) {
    console.error('BOOKING ERROR:', e)
    return NextResponse.json(
      { error: e.message || 'Server error' },
      { status: 500 }
    )
  }
}

// ---------------- GET ----------------

const parseImages = (images: any): string[] => {
  if (Array.isArray(images)) return images
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images)
      if (Array.isArray(parsed)) return parsed
    } catch {
      return images.split(',').map((s) => s.trim()).filter(Boolean)
    }
  }
  return []
}

export async function GET(req: NextRequest) {
  const user = getUser(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const where = user.role === 'ADMIN' ? {} : { userId: user.userId }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        car: {
          select: {
            brand: true,
            model: true,
            images: true,
            pricePerDay: true,
            type: true,
          },
        },
        user: {
          select: { name: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const normalized = bookings.map((b: any) => ({
      ...b,
      car: {
        ...b.car,
        images: parseImages(b.car.images),
      },
    }))

    return NextResponse.json({ bookings: normalized })
  } catch (error) {
    console.error('BOOKINGS GET ERROR:', error)
    return NextResponse.json({ bookings: [] })
  }
}