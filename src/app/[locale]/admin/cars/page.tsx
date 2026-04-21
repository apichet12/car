'use client'
import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react'

interface Car { id: string; brand: string; model: string; year: number; type: string; seats: number; transmission: string; fuel: string; pricePerDay: number; images: string[]; isAvailable: boolean; plateNumber: string }

const empty = { brand: '', model: '', year: new Date().getFullYear(), type: 'sedan', seats: 5, transmission: 'auto', fuel: 'gasoline', pricePerDay: 0, plateNumber: '', isAvailable: true, images: [] as string[], descTh: '', descEn: '', features: '' }

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
  images: parseImages(car.images),
  features: parseFeatures(car.features),
})

export default function AdminCarsPage() {
  const locale = useLocale()
  const th = locale === 'th'
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<any>(empty)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const fetchCars = () => {
    setLoading(true)
    fetch('/api/cars?limit=50')
      .then(r => r.json())
      .then(d => setCars((d.cars || []).map((car: any) => normalizeCar(car))))
      .finally(() => setLoading(false))
  }
  useEffect(() => { fetchCars() }, [])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p: any) => ({ ...p, [k]: e.target.value }))

  const handleImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'catty/cars')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const d = await res.json()
      if (d.url) setForm((p: any) => ({ ...p, images: [...parseImages(p.images), d.url] }))
      else toast.error('Upload failed')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const body = {
        ...form,
        year: Number(form.year), seats: Number(form.seats), pricePerDay: Number(form.pricePerDay),
        features: typeof form.features === 'string' ? form.features.split(',').map((s: string) => s.trim()).filter(Boolean) : form.features,
      }
      delete body.features_str
      const url = editId ? `/api/cars/${editId}` : '/api/cars'
      const method = editId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) {
        toast.success(editId ? (th ? 'แก้ไขสำเร็จ ✅' : 'Updated ✅') : (th ? 'เพิ่มรถสำเร็จ 🚗' : 'Car added 🚗'))
        setShowForm(false); setEditId(null); setForm(empty); fetchCars()
      } else {
        const d = await res.json(); toast.error(d.error || 'Error')
      }
    } finally { setSaving(false) }
  }

  const deleteCar = async (id: string) => {
    if (!confirm(th ? 'ยืนยันการลบรถ?' : 'Delete this car?')) return
    await fetch(`/api/cars/${id}`, { method: 'DELETE' })
    toast.success(th ? 'ลบสำเร็จ' : 'Deleted')
    fetchCars()
  }

  const startEdit = (car: Car) => {
    setForm({
      ...car,
      images: parseImages((car as any).images),
      features: Array.isArray((car as any).features) ? (car as any).features.join(', ') : (car as any).features || '',
      descTh: (car as any).descTh || '',
      descEn: (car as any).descEn || '',
    })
    setEditId(car.id); setShowForm(true)
    setTimeout(() => document.getElementById('car-form')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const S = { input: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '9px 12px', borderRadius: 10, fontFamily: 'Kanit, sans-serif', fontSize: 13, outline: 'none' } as React.CSSProperties }

  return (
    <div style={{ padding: 28, maxWidth: 1200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 24, fontWeight: 700, color: '#fff' }}>{th ? 'จัดการรถ' : 'Manage Cars'}</h1>
          <p style={{ color: '#64748B', fontSize: 13, marginTop: 2 }}>{cars.length} {th ? 'คัน' : 'cars'}</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(empty) }}
          style={{ background: 'linear-gradient(135deg,#D4AF37,#F5D45E)', color: '#000', border: 'none', padding: '9px 20px', borderRadius: 10, fontFamily: 'Kanit, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> {th ? 'เพิ่มรถ' : 'Add Car'}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div id="car-form" style={{ background: 'var(--card, #16162A)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ color: '#fff', fontSize: 17, fontWeight: 600 }}>{editId ? (th ? 'แก้ไขรถ' : 'Edit Car') : (th ? 'เพิ่มรถใหม่' : 'Add New Car')}</h2>
            <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', padding: '4px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: 'Kanit, sans-serif', fontSize: 12 }}>{th ? 'ปิด' : 'Close'}</button>
          </div>
          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
              {[{ k: 'brand', l: th ? 'ยี่ห้อ *' : 'Brand *', t: 'text', p: 'Toyota' }, { k: 'model', l: th ? 'รุ่น *' : 'Model *', t: 'text', p: 'Camry' }, { k: 'year', l: th ? 'ปี *' : 'Year *', t: 'number', p: '2023' }, { k: 'pricePerDay', l: th ? 'ราคา/วัน *' : 'Price/Day *', t: 'number', p: '1200' }, { k: 'seats', l: th ? 'ที่นั่ง *' : 'Seats *', t: 'number', p: '5' }, { k: 'plateNumber', l: th ? 'ทะเบียน *' : 'Plate *', t: 'text', p: 'กก 1234' }].map(f => (
                <div key={f.k}>
                  <label style={{ fontSize: 10, fontWeight: 600, color: '#0ABFBC', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 5 }}>{f.l}</label>
                  <input type={f.t} placeholder={f.p} value={form[f.k]} onChange={set(f.k)} required style={S.input} />
                </div>
              ))}
              {[{ k: 'type', l: th ? 'ประเภท' : 'Type', opts: ['sedan', 'suv', 'pickup', 'van', 'sport'] }, { k: 'transmission', l: th ? 'เกียร์' : 'Transmission', opts: ['auto', 'manual'] }, { k: 'fuel', l: th ? 'เชื้อเพลิง' : 'Fuel', opts: ['gasoline', 'diesel', 'electric', 'hybrid'] }].map(f => (
                <div key={f.k}>
                  <label style={{ fontSize: 10, fontWeight: 600, color: '#0ABFBC', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 5 }}>{f.l}</label>
                  <select value={form[f.k]} onChange={set(f.k)} style={{ ...S.input, appearance: 'none' }}>
                    {f.opts.map(o => <option key={o} value={o} style={{ background: '#1C1C2E' }}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div style={{ gridColumn: 'span 3' }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: '#0ABFBC', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 5 }}>{th ? 'ฟีเจอร์ (คั่นด้วย ,)' : 'Features (comma sep.)'}</label>
                <input type="text" value={form.features} onChange={set('features')} placeholder="GPS, Bluetooth, Reverse Camera" style={S.input} />
              </div>
              <div style={{ gridColumn: 'span 3' }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: '#0ABFBC', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 5 }}>{th ? 'รูปภาพรถ' : 'Car Images'}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(form.images || []).map((img: string, i: number) => (
                    <div key={i} style={{ position: 'relative', width: 72, height: 56, borderRadius: 10, overflow: 'hidden' }}>
                      <Image src={img} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
                      <button type="button" onClick={() => setForm((p: any) => ({ ...p, images: p.images.filter((_: string, j: number) => j !== i) }))}
                        style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', background: '#ef4444', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}><X size={10} /></button>
                    </div>
                  ))}
                  <label style={{ width: 72, height: 56, border: '2px dashed rgba(212,175,55,0.2)', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 3 }}>
                    {uploading ? <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #D4AF37', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} /> : <><Upload size={14} color="#64748B" /><span style={{ fontSize: 9, color: '#64748B' }}>Upload</span></>}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImg} />
                  </label>
                </div>
              </div>
              <div style={{ gridColumn: 'span 3', display: 'flex', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#94A3B8' }}>
                  <input type="checkbox" checked={form.isAvailable} onChange={e => setForm((p: any) => ({ ...p, isAvailable: e.target.checked }))} style={{ accentColor: '#D4AF37' }} />
                  {th ? 'พร้อมให้เช่า' : 'Available for rent'}
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button type="submit" disabled={saving} style={{ background: 'linear-gradient(135deg,#D4AF37,#F5D45E)', color: '#000', border: 'none', padding: '10px 24px', borderRadius: 10, fontFamily: 'Kanit, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer', opacity: saving ? .6 : 1 }}>
                {saving ? '...' : (editId ? (th ? 'บันทึก' : 'Save') : (th ? 'เพิ่มรถ' : 'Add Car'))}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', padding: '10px 20px', borderRadius: 10, fontFamily: 'Kanit, sans-serif', fontSize: 13, cursor: 'pointer' }}>
                {th ? 'ยกเลิก' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CARS TABLE */}
      <div style={{ background: 'var(--card, #16162A)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {[th ? 'รถ' : 'Car', th ? 'ประเภท' : 'Type', th ? 'ราคา/วัน' : 'Price/Day', th ? 'ที่นั่ง' : 'Seats', th ? 'สถานะ' : 'Status', th ? 'ทะเบียน' : 'Plate', ''].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, background: 'rgba(255,255,255,0.02)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={7} style={{ padding: 20, textAlign: 'center', color: '#475569' }}>{th ? 'กำลังโหลด...' : 'Loading...'}</td></tr>
                : cars.length === 0 ? <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#475569' }}>{th ? 'ยังไม่มีรถ' : 'No cars yet'}</td></tr>
                : cars.map(car => (
                  <tr key={car.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 44, height: 32, borderRadius: 8, overflow: 'hidden', background: '#1C1C2E', position: 'relative', flexShrink: 0 }}>
                          {car.images?.[0] ? <Image src={car.images[0]} alt="" fill style={{ objectFit: 'cover' }} unoptimized /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚗</div>}
                        </div>
                        <div>
                          <div style={{ color: '#fff', fontWeight: 500 }}>{car.brand} {car.model}</div>
                          <div style={{ color: '#475569', fontSize: 10 }}>{car.year}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}><span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', padding: '2px 9px', borderRadius: 8, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: '#94A3B8' }}>{car.type}</span></td>
                    <td style={{ padding: '12px 16px', color: '#D4AF37', fontWeight: 700 }}>฿{car.pricePerDay.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', color: '#94A3B8' }}>{car.seats}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ background: car.isAvailable ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: car.isAvailable ? '#34D399' : '#F87171', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 10 }}>{car.isAvailable ? (th ? 'ว่าง' : 'Available') : (th ? 'ไม่ว่าง' : 'Unavailable')}</span></td>
                    <td style={{ padding: '12px 16px', color: '#64748B', fontSize: 11 }}>{car.plateNumber}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => startEdit(car)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', padding: '4px 10px', borderRadius: 7, cursor: 'pointer', fontFamily: 'Kanit, sans-serif', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><Edit2 size={11} /> {th ? 'แก้ไข' : 'Edit'}</button>
                        <button onClick={() => deleteCar(car.id)} style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171', padding: '4px 10px', borderRadius: 7, cursor: 'pointer', fontFamily: 'Kanit, sans-serif', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><Trash2 size={11} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
