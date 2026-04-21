'use client'
import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Home, Sparkles, BookOpen, Star, Clock } from 'lucide-react'

interface Service {
  id: string; category: string; name: string; nameTh: string
  description: string | null; descTh: string | null
  price: number; unit: string; image: string | null; rating: number
}

const CATS = [
  { key: 'ALL', icon: '✨', labelTh: 'ทั้งหมด', labelEn: 'All Services' },
  { key: 'ACCOMMODATION', icon: '🏠', labelTh: 'ที่พัก', labelEn: 'Accommodation' },
  { key: 'BEAUTY', icon: '💄', labelTh: 'เสริมสวย / สักปาก', labelEn: 'Beauty Services' },
  { key: 'TUTORING', icon: '📚', labelTh: 'ติวเรียน', labelEn: 'Tutoring' },
]

export default function ServicesPage() {
  const locale = useLocale()
  const th = locale === 'th'
  const [services, setServices] = useState<Service[]>([])
  const [cat, setCat] = useState('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = cat !== 'ALL' ? `/api/services?category=${cat}` : '/api/services'
    fetch(url)
      .then(async (r) => {
        if (!r.ok) {
          const text = await r.text()
          throw new Error(`HTTP ${r.status} ${text || ''}`)
        }
        return r.json()
      })
      .then((d) => setServices(d.services || []))
      .catch((err) => {
        console.error('SERVICES FETCH ERROR:', err)
        setServices([])
      })
      .finally(() => setLoading(false))
  }, [cat])

  const displayed = services.filter(s => cat === 'ALL' || s.category === cat)

  const catColor: Record<string, string> = {
    ACCOMMODATION: '#0ABFBC',
    BEAUTY: '#FF6B9D',
    TUTORING: '#8B5CF6',
  }

  const S = {
    card: { background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', transition: 'all .3s' } as React.CSSProperties,
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 90, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 48, paddingTop: 20 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,107,157,0.1)', border: '1px solid rgba(255,107,157,0.25)', padding: '5px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#FF6B9D', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 }}>
            ✨ {th ? 'บริการพิเศษ' : 'Premium Services'}
          </div>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(30px,5vw,54px)', fontWeight: 700, color: '#fff', marginBottom: 12, lineHeight: 1.1 }}>
            {th ? <>บริการครบวงจร<br /><span style={{ background: 'linear-gradient(135deg,#FF6B9D,#D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>กับแคตตี้</span></> : <>Everything You Need<br /><span style={{ background: 'linear-gradient(135deg,#FF6B9D,#D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>with Catty</span></>}
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: 16, fontWeight: 300 }}>
            {th ? 'เช่ารถ · ที่พัก · เสริมสวย · ติวเรียน ครบในที่เดียว' : 'Car rental · Accommodation · Beauty · Tutoring — all in one place'}
          </p>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 36, flexWrap: 'wrap', justifyContent: 'center' }}>
          {CATS.map(c => (
            <button key={c.key} onClick={() => { setCat(c.key); setLoading(true) }} style={{
              padding: '10px 20px', borderRadius: 25, border: `1px solid ${cat === c.key ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
              background: cat === c.key ? 'linear-gradient(135deg,#D4AF37,#F5D45E)' : 'rgba(255,255,255,0.04)',
              color: cat === c.key ? '#000' : '#94A3B8', fontSize: 13, fontWeight: cat === c.key ? 700 : 500,
              cursor: 'pointer', transition: '.2s', fontFamily: 'Kanit',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span>{c.icon}</span> {th ? c.labelTh : c.labelEn}
            </button>
          ))}
        </div>

        {/* Services grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ ...S.card, height: 320 }}>
                <div style={{ height: 180, background: 'rgba(255,255,255,0.04)', animation: 'pulse 2s infinite' }} />
                <div style={{ padding: 16 }}>
                  <div style={{ height: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: 8 }} />
                  <div style={{ height: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 8, width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#CBD5E1' }}>
            {th ? 'ไม่พบบริการ' : 'No services found'}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
            {displayed.map(svc => (
              <div key={svc.id} className="hover:-translate-y-1.5 transition-all duration-300" style={S.card}>
                {/* Image */}
                <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: '#0e0e1a' }}>
                  {svc.image
                    ? <Image src={svc.image} alt={svc.name} fill style={{ objectFit: 'cover', transition: '.5s' }} unoptimized />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>
                        {svc.category === 'ACCOMMODATION' ? '🏠' : svc.category === 'BEAUTY' ? '💄' : '📚'}
                      </div>}
                  {/* Category tag */}
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '3px 10px', borderRadius: 20, fontSize: 10, color: catColor[svc.category] || '#fff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {svc.category === 'ACCOMMODATION' ? (th ? 'ที่พัก' : 'Stay') : svc.category === 'BEAUTY' ? (th ? 'เสริมสวย' : 'Beauty') : (th ? 'ติวเรียน' : 'Tutor')}
                  </div>
                  {/* Rating */}
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '3px 8px', borderRadius: 20, fontSize: 11, color: '#D4AF37', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Star size={10} fill="#D4AF37" /> {svc.rating.toFixed(1)}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '16px 18px' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{th ? svc.nameTh : svc.name}</h3>
                  <p style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.6, marginBottom: 12, height: 38, overflow: 'hidden' }}>
                    {th ? svc.descTh : svc.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: catColor[svc.category] || '#D4AF37' }}>฿{svc.price.toLocaleString()}</span>
                      <span style={{ fontSize: 11, color: '#64748B' }}>/{svc.unit}</span>
                    </div>
                    <button
                      onClick={() => toast.success(th ? `เพิ่ม "${svc.nameTh}" แล้ว! เลือกเพิ่มได้ตอนจองรถค่ะ 🐱` : `"${svc.name}" added! Select it when booking.`)}
                      style={{
                        background: `linear-gradient(135deg,${catColor[svc.category] || '#D4AF37'},${catColor[svc.category] || '#D4AF37'}cc)`,
                        color: svc.category === 'BEAUTY' || svc.category === 'TUTORING' ? '#fff' : '#000',
                        border: 'none', padding: '8px 14px', borderRadius: 10,
                        fontFamily: 'Kanit', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                      }}>
                      {th ? '+ สั่งจอง' : '+ Book'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: 60, background: 'linear-gradient(135deg,rgba(212,175,55,0.08),rgba(255,107,157,0.08))', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 24, padding: '40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
            {th ? 'จองรถพร้อมบริการเสริมได้เลย!' : 'Book a car with add-on services now!'}
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: 15, marginBottom: 24 }}>
            {th ? 'เลือกบริการที่ต้องการได้เลยตอนทำการจองรถ' : 'Select your desired services during the car booking process'}
          </p>
          <Link href={`/${locale}/cars`} style={{ display: 'inline-block', background: 'linear-gradient(135deg,#D4AF37,#F5D45E)', color: '#000', textDecoration: 'none', padding: '13px 32px', borderRadius: 25, fontFamily: 'Kanit', fontWeight: 700, fontSize: 15 }}>
            🚗 {th ? 'ไปเลือกรถ' : 'Browse Cars'}
          </Link>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  )
}
