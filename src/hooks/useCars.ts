'use client'
import { useState, useEffect, useCallback } from 'react'
import type { CarData } from '@/components/cars/CarCard'

interface UseCarsOptions {
  search?: string
  type?: string
  seats?: string
  maxPrice?: string
  available?: boolean
  sort?: string
  page?: number
  limit?: number
}

interface UseCarsResult {
  cars: CarData[]
  total: number
  pages: number
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useCars(options: UseCarsOptions = {}): UseCarsResult {
  const [cars, setCars] = useState<CarData[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCars = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (options.search) params.set('search', options.search)
      if (options.type && options.type !== 'all') params.set('type', options.type)
      if (options.seats && options.seats !== 'all') params.set('seats', options.seats)
      if (options.maxPrice) params.set('maxPrice', options.maxPrice)
      if (options.available) params.set('available', 'true')
      if (options.sort) params.set('sort', options.sort)
      params.set('page', String(options.page || 1))
      params.set('limit', String(options.limit || 12))

      const res = await fetch(`/api/cars?${params}`)
      const data = await res.json()
      setCars(data.cars || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } catch {
      setError('Failed to fetch cars')
    } finally {
      setLoading(false)
    }
  }, [
    options.search, options.type, options.seats, options.maxPrice,
    options.available, options.sort, options.page, options.limit,
  ])

  useEffect(() => {
    const t = setTimeout(fetchCars, 300)
    return () => clearTimeout(t)
  }, [fetchCars])

  return { cars, total, pages, loading, error, refetch: fetchCars }
}
