import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, isError } from '@/lib/apiAuth'

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

const parseFeatures = (features: any): string[] => {
  if (Array.isArray(features)) return features
  if (typeof features === 'string') {
    try {
      const parsed = JSON.parse(features)
      if (Array.isArray(parsed)) return parsed
    } catch {
      return features.split(',').map((s) => s.trim()).filter(Boolean)
    }
  }
  return []
}

const normalizeCar = (car: any) => ({
  ...car,
  id: String(car.id),
  images: parseImages(car.images),
  features: parseFeatures(car.features),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams: p } = new URL(req.url)
    const where: any = {}
    if (p.get('search')) where.OR = [
      { brand: { contains: p.get('search')!, mode: 'insensitive' } },
      { model: { contains: p.get('search')!, mode: 'insensitive' } },
    ]
    if (p.get('type') && p.get('type') !== 'all') where.type = p.get('type')
    if (p.get('seats') && p.get('seats') !== 'all') where.seats = { gte: parseInt(p.get('seats')!) }
    if (p.get('maxPrice')) where.pricePerDay = { lte: parseFloat(p.get('maxPrice')!) }
    if (p.get('available') === 'true') where.isAvailable = true

    const page = Math.max(1, parseInt(p.get('page') || '1'))
    const limit = Math.min(24, parseInt(p.get('limit') || '12'))
    const sortMap: Record<string, any> = { newest: { createdAt: 'desc' }, price_asc: { pricePerDay: 'asc' }, price_desc: { pricePerDay: 'desc' } }
    const orderBy = sortMap[p.get('sort') || 'newest'] || { createdAt: 'desc' }

    let cars: any[] = []
    let total = 0
    try {
      const result = await Promise.all([
        prisma.car.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }),
        prisma.car.count({ where }),
      ])
      cars = result[0].map(normalizeCar)
      total = result[1]
    } catch (dbError) {
      console.error('CARS API ERROR:', dbError)
      return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
    return NextResponse.json({ cars, total, page, pages: Math.ceil(total / limit) })
  } catch (e) { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

const normalizePayload = (data: any) => ({
  ...data,
  images: Array.isArray(data.images) ? JSON.stringify(data.images) : data.images,
  features: Array.isArray(data.features) ? JSON.stringify(data.features) : data.features,
})

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req)
  if (isError(auth)) return auth
  try {
    const input = await req.json()
    const data = normalizePayload(input)
    const car = await prisma.car.create({ data })
    return NextResponse.json({ car: normalizeCar(car) }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Error' }, { status: 500 })
  }
}
