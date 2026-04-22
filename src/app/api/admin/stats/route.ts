import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, isError } from '@/lib/apiAuth'

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req)
  if (isError(auth)) return auth

  try {
    // Get real statistics from database
    const [totalUsers, totalCars, totalBookings] = await Promise.all([
      prisma.user.count(),
      prisma.car.count(),
      prisma.booking.count(),
    ])

    // Get available cars (isAvailable is true)
    const availableCars = await prisma.car.count({
      where: {
        isAvailable: true
      }
    })

    // Get booked cars
    const bookedCars = totalCars - availableCars

    // Get active bookings (status is PENDING, APPROVED, or IN_PROGRESS)
    const activeBookings = await prisma.booking.count({
      where: {
        status: {
          in: ['PENDING', 'APPROVED', 'IN_PROGRESS']
        }
      }
    })

    return NextResponse.json({
      totalUsers,
      totalCars,
      availableCars,
      bookedCars,
      totalBookings,
      activeBookings,
    })
  } catch (error) {
    console.error('ADMIN STATS ERROR:', error)
    return NextResponse.json({
      totalUsers: 0,
      totalCars: 0,
      availableCars: 0,
      bookedCars: 0,
      totalBookings: 0,
      activeBookings: 0,
    })
  }
}
