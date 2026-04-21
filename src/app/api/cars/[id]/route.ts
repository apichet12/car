import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, isError } from '@/lib/apiAuth'

const parseId = (id: string): number | null => {
  const parsed = Number(id)
  return Number.isInteger(parsed) ? parsed : null
}

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

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const requestedId = parseId(params.id)
    if (requestedId !== null) {
      const car = await prisma.car.findUnique({ where: { id: requestedId } })
      if (car) return NextResponse.json({ car: normalizeCar(car) })
    }
  } catch (error) {
    console.error('CAR GET ERROR:', error)
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

const normalizePayload = (data: any) => ({
  ...data,
  images: Array.isArray(data.images) ? JSON.stringify(data.images) : data.images,
  features: Array.isArray(data.features) ? JSON.stringify(data.features) : data.features,
})

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req)
  if (isError(auth)) return auth
  try {
    const requestedId = parseId(params.id)
    if (requestedId === null) return NextResponse.json({ error: 'Invalid car id' }, { status: 400 })
    const input = await req.json()
    const data = normalizePayload(input)
    const car = await prisma.car.update({ where: { id: requestedId }, data })
    return NextResponse.json({ car: normalizeCar(car) })
  } catch (error) {
    console.error('CAR UPDATE ERROR:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req)
  if (isError(auth)) return auth
  try {
    const requestedId = parseId(params.id)
    if (requestedId === null) return NextResponse.json({ error: 'Invalid car id' }, { status: 400 })
    await prisma.car.delete({ where: { id: requestedId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('CAR DELETE ERROR:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
