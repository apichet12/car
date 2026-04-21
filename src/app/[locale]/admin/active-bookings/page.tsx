'use client'
import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import { format, isValid, differenceInDays } from 'date-fns'
import { Calendar, Clock, User, Phone, MapPin } from 'lucide-react'

interface Booking {
  id: string
  status: string
  totalPrice: number
  totalDays: number
  startDate: string
  endDate: string
  user: { name: string; email: string; phone: string }
  car: { brand: string; model: string; images: string[] }
  createdAt: string
}

export default function ActiveBookingsPage() {
  const locale = useLocale()
  const th = locale === 'th'
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    fetch('/api/bookings').then(r => r.json()).then(d => setBookings(d.bookings || [])).finally(() => setLoading(false))
  }, [])

  // Update time for countdown every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const formatDate = (value: string | null | undefined, pattern: string) => {
    const date = value ? new Date(value) : new Date('')
    return isValid(date) ? format(date, pattern) : '-'
  }

  const getCountdown = (endDate: string) => {
    const end = new Date(endDate)
    const days = differenceInDays(end, currentTime)
    const hours = Math.floor((end.getTime() - currentTime.getTime()) / (1000 * 60 * 60)) % 24
    const minutes = Math.floor((end.getTime() - currentTime.getTime()) / (1000 * 60)) % 60
    return { days: Math.max(0, days), hours: Math.max(0, hours), minutes: Math.max(0, minutes) }
  }

  const getCountdownColor = (endDate: string) => {
    const { days } = getCountdown(endDate)
    if (days <= 0) return '#EF4444'
    if (days <= 2) return '#FCD34D'
    return '#34D399'
  }

  const activeBookings = bookings.filter(b => b.status === 'APPROVED').sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())

  return (
    <div style={{ padding: '28px', maxWidth: 1400 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
          {th ? '📅 การจองที่กำลังดำเนิน' : '📅 Active Bookings'}
        </h1>
        <p style={{ color: '#64748B', fontSize: 14 }}>
          {th ? `รวม ${activeBookings.length} การจองที่กำลังดำเนิน` : `${activeBookings.length} active booking(s)`}
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#475569' }}>
          {th ? 'กำลังโหลด...' : 'Loading...'}
        </div>
      ) : activeBookings.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 80,
          background: 'var(--card, #16162A)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16,
          color: '#94A3B8'
        }}>
          {th ? '✨ ไม่มีการจองที่กำลังดำเนิน' : '✨ No active bookings'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18 }}>
          {activeBookings.map((b) => {
            const countdown = getCountdown(b.endDate)
            const countdownColor = getCountdownColor(b.endDate)
            const isEnding = countdown.days <= 0

            return (
              <div
                key={b.id}
                style={{
                  background: 'var(--card, #16162A)',
                  border: `2px solid ${isEnding ? '#EF4444' : countdown.days <= 2 ? '#FCD34D' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 20,
                  padding: 20,
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all .3s'
                }}
              >
                {/* Header accent line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${countdownColor}, transparent)`
                }} />

                {/* Car image & info */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 70, height: 70, borderRadius: 12, overflow: 'hidden', background: '#1C1C2E', flexShrink: 0, position: 'relative' }}>
                    {b.car?.images?.[0]
                      ? <Image src={b.car.images[0]} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🚗</div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>
                      {b.car?.brand} {b.car?.model}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                      {b.totalDays} {th ? 'วัน' : 'days'} • ฿{b.totalPrice?.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* User info */}
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 12, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <User size={14} color="#94A3B8" />
                    <div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{th ? 'ชื่อผู้จอง' : 'Name'}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{b.user?.name}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Phone size={14} color="#94A3B8" />
                    <div style={{ fontSize: 12, color: '#94A3B8' }}>{b.user?.phone}</div>
                  </div>
                </div>

                {/* Dates */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 14, fontSize: 12 }}>
                  <div style={{ flex: 1, background: 'rgba(10,191,188,0.1)', borderRadius: 10, padding: 10 }}>
                    <div style={{ color: '#0ABFBC', fontWeight: 600, marginBottom: 4 }}>{th ? 'วันรับ' : 'Pick-up'}</div>
                    <div style={{ color: '#fff', fontWeight: 700 }}>{formatDate(b.startDate, 'dd/MM/yyyy')}</div>
                    <div style={{ color: '#64748B', fontSize: 11, marginTop: 2 }}>{formatDate(b.startDate, 'HH:mm')}</div>
                  </div>
                  <div style={{ flex: 1, background: 'rgba(239,68,68,0.1)', borderRadius: 10, padding: 10 }}>
                    <div style={{ color: '#F87171', fontWeight: 600, marginBottom: 4 }}>{th ? 'วันคืน' : 'Return'}</div>
                    <div style={{ color: '#fff', fontWeight: 700 }}>{formatDate(b.endDate, 'dd/MM/yyyy')}</div>
                    <div style={{ color: '#64748B', fontSize: 11, marginTop: 2 }}>{formatDate(b.endDate, 'HH:mm')}</div>
                  </div>
                </div>

                {/* Countdown */}
                <div style={{
                  background: `rgba(${countdownColor === '#EF4444' ? '239,68,68' : countdownColor === '#FCD34D' ? '252,211,77' : '52,211,153'},0.15)`,
                  border: `1px solid ${countdownColor}33`,
                  borderRadius: 12,
                  padding: 14,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 6, fontWeight: 500 }}>
                    {th ? 'เหลือเวลา' : 'Time remaining'}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: countdownColor, fontFamily: 'monospace', marginBottom: 4 }}>
                    {String(countdown.days).padStart(2, '0')}:{String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>
                    {countdown.days} {th ? 'วัน' : 'day(s)'} {countdown.hours} {th ? 'ชั่วโมง' : 'hr(s)'} {countdown.minutes} {th ? 'นาที' : 'min(s)'}
                  </div>
                  {isEnding && (
                    <div style={{ fontSize: 11, color: '#EF4444', fontWeight: 600, marginTop: 8 }}>
                      ⚠️ {th ? 'กำลังจะหมดอายุ' : 'About to expire'}
                    </div>
                  )}
                </div>

                {/* Status badge */}
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #34D399, #10B981)',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '6px 12px',
                    borderRadius: 8,
                    display: 'inline-block'
                  }}>
                    ✓ {th ? 'กำลังดำเนิน' : 'In Progress'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
