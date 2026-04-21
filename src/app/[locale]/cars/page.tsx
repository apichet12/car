'use client'
import { useState, useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'
import CarCard from '@/components/cars/CarCard'
import type { CarData } from '@/components/cars/CarCard'
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function CarsPage() {
  const locale = useLocale()
  const th = locale === 'th'
  const [cars, setCars] = useState<CarData[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [seats, setSeats] = useState('all')
  const [maxPrice, setMaxPrice] = useState('')
  const [available, setAvailable] = useState(false)
  const [sort, setSort] = useState('newest')

  const fetchCars = useCallback(async () => {
    setLoading(true)
    const p = new URLSearchParams()
    if (search) p.set('search', search)
    if (type !== 'all') p.set('type', type)
    if (seats !== 'all') p.set('seats', seats)
    if (maxPrice) p.set('maxPrice', maxPrice)
    if (available) p.set('available', 'true')
    p.set('sort', sort); p.set('page', String(page)); p.set('limit', '12')
    try {
      const res = await fetch(`/api/cars?${p}`)
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const d = await res.json()
      setCars(d.cars?.map((c: any) => ({ ...c, _id: c.id || c._id })) || [])
      setTotal(d.total || 0); setPages(d.pages || 1)
    } catch (err) {
      console.error('FETCH ERROR:', err)
      setCars([])
    } finally {
      setLoading(false)
    }
  }, [search, type, seats, maxPrice, available, sort, page])

  useEffect(() => { const t = setTimeout(fetchCars, 300); return () => clearTimeout(t) }, [fetchCars])

  const clearFilters = () => { setSearch(''); setType('all'); setSeats('all'); setMaxPrice(''); setAvailable(false); setSort('newest'); setPage(1) }

  const S = {
    input: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 14px', borderRadius: 12, fontFamily: 'Kanit, sans-serif', fontSize: 13, outline: 'none', width: '100%' } as React.CSSProperties,
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 30, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 36, fontWeight: 700, color: '#fff' }}>{th ? 'รถทั้งหมด' : 'All Cars'}</h1>
          <p style={{ color: '#CBD5E1', marginTop: 4 }}>{th ? 'เลือกรถที่ใช่สำหรับคุณ' : 'Find your perfect car'}</p>
        </div>

        {/* Filters */}
        <div style={{ background: 'var(--card, #16162A)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '20px 22px', marginBottom: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
              <input style={{ ...S.input, paddingLeft: 36 }} placeholder={th ? 'ค้นหายี่ห้อ รุ่น...' : 'Search brand, model...'} value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
            </div>
            <select style={{ ...S.input, appearance: 'none' }} value={type} onChange={e => { setType(e.target.value); setPage(1) }}>
              <option value="all">{th ? 'ทุกประเภท' : 'All Types'}</option>
              {['sedan', 'suv', 'pickup', 'van', 'sport'].map(t => <option key={t} value={t} style={{ background: '#1C1C2E' }} className="capitalize">{t.toUpperCase()}</option>)}
            </select>
            <select style={{ ...S.input, appearance: 'none' }} value={seats} onChange={e => { setSeats(e.target.value); setPage(1) }}>
              <option value="all">{th ? 'ทุกขนาด' : 'Any Size'}</option>
              {['4', '5', '7', '8'].map(s => <option key={s} value={s} style={{ background: '#1C1C2E' }}>{s}+ {th ? 'ที่นั่ง' : 'seats'}</option>)}
            </select>
            <input style={S.input} type="number" placeholder={th ? 'ราคาสูงสุด/วัน' : 'Max Price/Day'} value={maxPrice} onChange={e => { setMaxPrice(e.target.value); setPage(1) }} min={0} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#CBD5E1' }}>
                <div onClick={() => { setAvailable(!available); setPage(1) }} style={{ width: 36, height: 20, borderRadius: 10, background: available ? '#D4AF37' : 'rgba(255,255,255,0.1)', position: 'relative', transition: '.2s', cursor: 'pointer' }}>
                  <span style={{ position: 'absolute', top: 2, width: 16, height: 16, background: '#fff', borderRadius: '50%', transition: '.2s', left: available ? 18 : 2, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                </div>
                {th ? 'แสดงเฉพาะรถว่าง' : 'Available only'}
              </label>
              {(search || type !== 'all' || seats !== 'all' || maxPrice || available) && (
                <button onClick={clearFilters} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Kanit, sans-serif' }}>
                  <X size={13} /> {th ? 'ล้าง' : 'Clear'}
                </button>
              )}
            </div>
            <select style={{ ...S.input, width: 'auto', appearance: 'none' }} value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
              <option value="newest" style={{ background: '#1C1C2E' }}>{th ? 'ใหม่สุด' : 'Newest'}</option>
              <option value="price_asc" style={{ background: '#1C1C2E' }}>{th ? 'ราคา ↑' : 'Price ↑'}</option>
              <option value="price_desc" style={{ background: '#1C1C2E' }}>{th ? 'ราคา ↓' : 'Price ↓'}</option>
            </select>
          </div>
        </div>

        {!loading && <p style={{ color: '#CBD5E1', fontSize: 13, marginBottom: 20 }}>{th ? `พบ ${total} คัน` : `${total} cars found`}</p>}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ background: 'var(--card, #16162A)', borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ height: 200, background: 'rgba(255,255,255,0.04)', animation: 'pulse 2s infinite' }} />
                <div style={{ padding: 16 }}>
                  <div style={{ height: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: 8, animation: 'pulse 2s infinite' }} />
                  <div style={{ height: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 8, width: '60%', animation: 'pulse 2s infinite' }} />
                </div>
              </div>
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <p style={{ color: '#CBD5E1', marginBottom: 16 }}>{th ? 'ไม่พบรถที่ตรงกัน' : 'No cars found'}</p>
            <button onClick={clearFilters} style={{ background: 'transparent', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', padding: '8px 20px', borderRadius: 10, cursor: 'pointer', fontFamily: 'Kanit, sans-serif', fontSize: 13 }}>{th ? 'ล้างการค้นหา' : 'Clear search'}</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
            {cars.map(car => <CarCard key={car._id} car={car} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 40 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: page === 1 ? '#2a2a3a' : '#94A3B8', cursor: page === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={16} />
            </button>
            {[...Array(pages)].map((_, i) => {
              const p = i + 1
              if (Math.abs(p - page) > 2 && p !== 1 && p !== pages) return null
              return (
                <button key={p} onClick={() => setPage(p)}
                  style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: p === page ? 'linear-gradient(135deg,#D4AF37,#F5D45E)' : 'transparent', color: p === page ? '#000' : '#94A3B8' }}>
                  {p}
                </button>
              )
            })}
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
              style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: page === pages ? '#2a2a3a' : '#94A3B8', cursor: page === pages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  )
}
