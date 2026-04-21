import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, isError } from '@/lib/apiAuth'

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req)
  if (isError(auth)) return auth

  try {
    const [totalCars, availableCars, totalBookings, pendingBookings, totalUsers, revenue] = await Promise.all([
      prisma.car.count(),
      prisma.car.count({ where: { isAvailable: true } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.booking.aggregate({
        where: { status: { in: ['APPROVED', 'COMPLETED'] } },
        _sum: { totalPrice: true },
      }),
    ])

    return NextResponse.json({
      totalCars, availableCars, totalBookings, pendingBookings,
      totalUsers, totalRevenue: revenue._sum.totalPrice || 0,
    })
  } catch (error) {
    console.error('ADMIN STATS ERROR:', error)
    return NextResponse.json({
      totalCars: 0,
      availableCars: 0,
      totalBookings: 0,
      pendingBookings: 0,
      totalUsers: 0,
      totalRevenue: 0,
    })
  }
}
