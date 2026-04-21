'use client'
import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import { format, isValid } from 'date-fns'
import { CheckCircle, XCircle, Eye, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface Booking {
  id: string; status: string; totalPrice: number; totalDays: number
  startDate: string; endDate: string; slipImage?: string; adminNote?: string
  user: { name: string; email: string; phone: string }
  car: { brand: string; model: string; images: string[] }
  createdAt: string
}

export default function AdminBookingsPage() {
  const locale = useLocale()
  const th = locale === 'th'
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [slipModal, setSlipModal] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/bookings').then(r => r.json()).then(d => setBookings(d.bookings || [])).finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
      toast.success(status === 'APPROVED' ? (th ? 'อนุมัติแล้ว ✅' : 'Approved ✅') : (th ? 'ปฏิเสธแล้ว' : 'Rejected'))
    }
    setUpdating(null)
  }

  const filtered = bookings
    .filter(b => filter === 'ALL' || b.status === filter)
    .filter(b => !search || b.user?.name?.toLowerCase().includes(search.toLowerCase()) || b.car?.brand?.toLowerCase().includes(search.toLowerCase()))

  const STATUS: Record<string, [string, string, string, string]> = {
    PENDING: ['rgba(245,158,11,0.15)', '#FCD34D', 'รอ', 'Pending'],
    APPROVED: ['rgba(16,185,129,0.15)', '#34D399', 'อนุมัติ', 'Approved'],
    REJECTED: ['rgba(239,68,68,0.15)', '#F87171', 'ปฏิเสธ', 'Rejected'],
    COMPLETED: ['rgba(99,102,241,0.15)', '#A5B4FC', 'เสร็จ', 'Done'],
    CANCELLED: ['rgba(100,116,139,0.15)', '#94A3B8', 'ยกเลิก', 'Cancelled'],
  }

  const badge = (s: string) => {
    const [bg, color, labelTh, labelEn] = STATUS[s] || STATUS.PENDING
    return <span style={{ background: bg, color, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 10 }}>{th ? labelTh : labelEn}</span>
  }

  const formatDate = (value: string | null | undefined, pattern: string) => {
    const date = value ? new Date(value) : new Date('')
    return isValid(date) ? format(date, pattern) : '-'
  }

  const tabs = [
    { key: 'ALL', label: th ? 'ทั้งหมด' : 'All', count: bookings.length },
    { key: 'PENDING', label: th ? 'รอ' : 'Pending', count: bookings.filter(b => b.status === 'PENDING').length },
    { key: 'APPROVED', label: th ? 'อนุมัติ' : 'Approved', count: bookings.filter(b => b.status === 'APPROVED').length },
    { key: 'REJECTED', label: th ? 'ปฏิเสธ' : 'Rejected', count: bookings.filter(b => b.status === 'REJECTED').length },
    { key: 'COMPLETED', label: th ? 'เสร็จ' : 'Done', count: bookings.filter(b => b.status === 'COMPLETED').length },
  ]

  return (
    <div style={{ padding: 28, maxWidth: 1200 }}>
      {slipModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setSlipModal(null)}>
          <div style={{ position: 'relative', maxWidth: 480, width: '100%' }}>
            <img src={slipModal} alt="slip" style={{ width: '100%', borderRadius: 16, objectFit: 'contain', maxHeight: '80vh' }} />
            <button onClick={() => setSlipModal(null)} style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16 }}>✕</button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 24, fontWeight: 700, color: '#fff' }}>
          {th ? 'จัดการการจอง' : 'Manage Bookings'}
        </h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 3, flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)} style={{ padding: '6px 14px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'Kanit, sans-serif', fontSize: 12, fontWeight: 500, transition: '.2s', background: filter === tab.key ? 'linear-gradient(135deg,#D4AF37,#F5D45E)' : 'transparent', color: filter === tab.key ? '#000' : '#94A3B8' }}>
              {tab.label} <span style={{ opacity: .7, fontSize: 10 }}>({tab.count})</span>
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={th ? '🔍 ค้นหา...' : '🔍 Search...'}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '7px 14px', borderRadius: 10, fontFamily: 'Kanit, sans-serif', fontSize: 12, outline: 'none', width: 200 }} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#475569' }}>{th ? 'กำลังโหลด...' : 'Loading...'}</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#475569', background: 'var(--card, #16162A)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
          {th ? 'ไม่มีการจอง' : 'No bookings'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(b => (
            <div key={b.id} style={{ background: 'var(--card, #16162A)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 18 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', width: 180, flexShrink: 0 }}>
                  <div style={{ width: 56, height: 40, borderRadius: 10, overflow: 'hidden', background: '#1C1C2E', flexShrink: 0, position: 'relative' }}>
                    {b.car?.images?.[0]
                      ? <Image src={b.car.images[0]} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🚗</div>}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{b.car?.brand} {b.car?.model}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{b.totalDays} {th ? 'วัน' : 'days'}</div>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{b.user?.name}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{b.user?.email}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{b.user?.phone}</div>
                </div>
                <div style={{ minWidth: 130 }}>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{formatDate(b.startDate, 'dd/MM/yy')} → {formatDate(b.endDate, 'dd/MM/yy')}</div>
                  <div style={{ color: '#D4AF37', fontWeight: 700, fontSize: 16, marginTop: 4 }}>฿{b.totalPrice?.toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
                  {badge(b.status)}
                  <div style={{ display: 'flex', gap: 6 }}>
                    {b.slipImage && <button onClick={() => setSlipModal(b.slipImage!)} style={{ padding: '4px 10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94A3B8', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontFamily: 'Kanit, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={11} /> {th ? 'สลิป' : 'Slip'}</button>}
                    {b.status === 'PENDING' && <>
                      <button disabled={updating === b.id} onClick={() => updateStatus(b.id, 'APPROVED')} style={{ padding: '4px 11px', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)', color: '#34D399', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontFamily: 'Kanit, sans-serif', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle size={11} /> {th ? 'อนุมัติ' : 'Approve'}
                      </button>
                      <button disabled={updating === b.id} onClick={() => updateStatus(b.id, 'REJECTED')} style={{ padding: '4px 10px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#F87171', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontFamily: 'Kanit, sans-serif', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <XCircle size={11} /> {th ? 'ปฏิเสธ' : 'Reject'}
                      </button>
                    </>}
                    {b.status === 'APPROVED' && <button disabled={updating === b.id} onClick={() => updateStatus(b.id, 'COMPLETED')} style={{ padding: '4px 11px', border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.1)', color: '#A5B4FC', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontFamily: 'Kanit, sans-serif', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Check size={11} /> {th ? 'เสร็จสิ้น' : 'Complete'}
                    </button>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
