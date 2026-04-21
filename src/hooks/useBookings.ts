'use client'
import { useState, useEffect, useCallback } from 'react'

export interface BookingItem {
  _id: string
  pickupDate: string
  returnDate: string
  totalDays: number
  totalPrice: number
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  slipImage: string
  adminNote?: string
  car: {
    _id: string
    brand: string
    model: string
    images: string[]
    pricePerDay: number
    type: string
  }
  user?: {
    name: string
    email: string
    phone: string
  }
  createdAt: string
}

export function useBookings() {
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/bookings')
      if (res.status === 401) {
        setError('unauthorized')
        return
      }
      const data = await res.json()
      setBookings(data.bookings || [])
    } catch {
      setError('fetch_failed')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch_() }, [fetch_])

  const updateStatus = async (id: string, status: string, adminNote?: string) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNote }),
    })
    if (res.ok) {
      setBookings(prev =>
        prev.map(b => b._id === id ? { ...b, status: status as BookingItem['status'] } : b)
      )
      return true
    }
    return false
  }

  return { bookings, loading, error, refetch: fetch_, updateStatus }
}
