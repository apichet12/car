import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const where: any = { isActive: true }
  if (searchParams.get('category')) where.category = searchParams.get('category')

  try {
    if (!prisma.service || typeof prisma.service.findMany !== 'function') {
      console.warn('SERVICES API WARNING: prisma.service is unavailable.')
      return NextResponse.json({ services: [] })
    }

    const services = await prisma.service.findMany({ where, orderBy: { price: 'asc' } })
    return NextResponse.json({ services })
  } catch (error) {
    console.error('SERVICES API ERROR:', error)
    return NextResponse.json({ services: [] })
  }
}
