'use client'
import { useState, useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { differenceInDays, format, addDays } from 'date-fns'
import { ArrowLeft, Calendar, CreditCard, Home, Sparkles, BookOpen, Check, Upload, X, ChevronDown, ChevronUp, QrCode, Banknote, Phone, Smartphone } from 'lucide-react'

interface Car { id: string; _id?: string; brand: string; model: string; year: number; type: string; seats: number; pricePerDay: number; images: string[] }
interface Service { id: string; category: string; name: string; nameTh: string; price: number; unit: string; image: string | null; descTh: string | null; description: string | null }

const PAYMENT_METHODS = [
  { id: 'PROMPTPAY', icon: '📱', labelTh: 'พร้อมเพย์', labelEn: 'PromptPay', desc: '081-234-5678', hasQR: true, hasSlip: true },
  { id: 'BANK_TRANSFER', icon: '🏦', labelTh: 'โอนผ่านธนาคาร', labelEn: 'Bank Transfer', desc: 'กสิกรไทย 123-4-56789-0', hasQR: false, hasSlip: true },
  { id: 'CREDIT_CARD', icon: '💳', labelTh: 'บัตรเครดิต/เดบิต', labelEn: 'Credit / Debit Card', desc: 'Visa, MasterCard, JCB', hasQR: false, hasSlip: false },
  { id: 'CASH', icon: '💵', labelTh: 'เงินสด', labelEn: 'Cash on Pickup', desc: 'ชำระเมื่อรับรถ', hasQR: false, hasSlip: false },
  { id: 'LINE_PAY', icon: '💚', labelTh: 'LINE Pay', labelEn: 'LINE Pay', desc: 'สแกน QR ผ่าน LINE', hasQR: true, hasSlip: true },
]

const SERVICE_CATS = [
  { key: 'ACCOMMODATION', icon: '🏠', labelTh: 'ที่พัก', labelEn: 'Accommodation', color: '#0ABFBC' },
  { key: 'BEAUTY', icon: '💄', labelTh: 'เสริมสวย / สักปาก', labelEn: 'Beauty Services', color: '#FF6B9D' },
  { key: 'TUTORING', icon: '📚', labelTh: 'ติวเรียน', labelEn: 'Tutoring', color: '#8B5CF6' },
]

export default function BookingPage({ params: { locale, carId } }: { params: { locale: string; carId: string } }) {
  const router = useRouter()
  const th = locale === 'th'
  const [car, setCar] = useState<Car | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const today = format(new Date(), 'yyyy-MM-dd')
  const [pickup, setPickup] = useState(today)
  const [returnD, setReturnD] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'))
  const [payMethod, setPayMethod] = useState('PROMPTPAY')
  const [slipUrl, setSlipUrl] = useState('')
  const [slipPreview, setSlipPreview] = useState('')
  const [uploadingSlip, setUploadingSlip] = useState(false)
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({})
  const [openCat, setOpenCat] = useState<string | null>('ACCOMMODATION')
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const slipRef = useRef<HTMLInputElement>(null)

  const totalDays = pickup && returnD ? Math.max(0, differenceInDays(new Date(returnD), new Date(pickup))) : 0
  const carTotal = car ? totalDays * car.pricePerDay : 0
  const addonTotal = services.filter(s => selectedAddons[s.id]).reduce((sum, s) => sum + s.price, 0)
  const grandTotal = carTotal + addonTotal

  useEffect(() => {
    if (!carId || carId === 'undefined') return
    Promise.all([
      fetch(`/api/cars/${carId}`),
      fetch('/api/services'),
    ]).then(async ([carRes, servicesRes]) => {
      if (!carRes.ok) {
        const error = await carRes.text()
        throw new Error(error || 'Failed to load car')
      }
      if (!servicesRes.ok) {
        const error = await servicesRes.text()
        throw new Error(error || 'Failed to load services')
      }
      const cd = await carRes.json()
      const sd = await servicesRes.json()
      if (cd.car) setCar({ ...cd.car, _id: cd.car.id })
      if (sd.services) setServices(sd.services)
    }).catch((err: any) => {
      console.error('LOAD BOOKING DATA ERROR:', err)
      toast.error('ไม่สามารถโหลดข้อมูลได้')
    }).finally(() => setLoading(false))
  }, [carId])

  const handleSlip = async (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('กรุณาเลือกไฟล์รูปภาพ'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('ไฟล์ใหญ่เกิน 5MB'); return }
    const reader = new FileReader()
    reader.onload = e => setSlipPreview(e.target?.result as string)
    reader.readAsDataURL(file)
    setUploadingSlip(true)
    try {
      const fd = new FormData(); fd.append('file', file); fd.append('folder', 'slips')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const d = await res.json()
      if (d.url) { setSlipUrl(d.url); toast.success(th ? 'อัปโหลดสลิปสำเร็จ ✅' : 'Slip uploaded ✅') }
      else throw new Error(d.error)
    } catch (e: any) { toast.error('อัปโหลดล้มเหลว: ' + (e.message || '')); setSlipPreview('') }
    finally { setUploadingSlip(false) }
  }

  const canProceed = () => {
    if (step === 1) return totalDays >= 1
    if (step === 2) {
      const pm = PAYMENT_METHODS.find(p => p.id === payMethod)
      if (pm?.hasSlip && !slipUrl) return false
      if (payMethod === 'CREDIT_CARD' && (!cardForm.number || !cardForm.expiry || !cardForm.cvv || !cardForm.name)) return false
      return true
    }
    return true
  }

  const submit = async () => {
    if (!car) return
    setSubmitting(true)
    const addons = services.filter(s => selectedAddons[s.id]).map(s => ({ type: s.category, name: th ? s.nameTh : s.name, price: s.price, detail: th ? s.descTh : s.description }))
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId: car.id || car._id, pickupDate: pickup, returnDate: returnD, slipImage: slipUrl || null, paymentMethod: payMethod, addons }),
      })
      const d = await res.json()
      if (!res.ok) {
        if (res.status === 401) { router.push(`/${locale}/auth/login?redirect=/booking/${carId}`); return }
        toast.error(d.error || 'เกิดข้อผิดพลาด')
      } else {
        toast.success(th ? '🎉 จองสำเร็จ! รอการอนุมัติจากทีมงาน' : '🎉 Booked! Awaiting approval')
        setTimeout(() => router.push(`/${locale}/profile`), 1500)
      }
    } catch { toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่') }
    finally { setSubmitting(false) }
  }

  const S = {
    card: { background: '#16162A', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' } as React.CSSProperties,
    label: { fontSize: 11, fontWeight: 600, color: '#0ABFBC', textTransform: 'uppercase' as const, letterSpacing: 1, display: 'block', marginBottom: 7 },
    input: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '11px 14px', borderRadius: 12, fontFamily: 'Kanit, sans-serif', fontSize: 14, outline: 'none' } as React.CSSProperties,
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(212,175,55,0.2)', borderTopColor: '#D4AF37', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (!car) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <p style={{ color: '#64748B' }}>ไม่พบข้อมูลรถ</p>
      <Link href={`/${locale}/cars`} className="btn-gold">← ดูรถทั้งหมด</Link>
    </div>
  )

  const selectedPM = PAYMENT_METHODS.find(p => p.id === payMethod)!

  // Inline QR component (ASCII-art style SVG QR placeholder)
  const QRCodeDisplay = ({ amount }: { amount: number }) => (
    <div style={{ background: '#fff', borderRadius: 16, padding: 16, display: 'inline-block', textAlign: 'center' }}>
      <div style={{ fontSize: 11, color: '#333', fontWeight: 700, marginBottom: 8 }}>
        {payMethod === 'PROMPTPAY' ? 'PromptPay QR Code' : 'LINE Pay QR Code'}
      </div>
      {/* QR pattern using SVG grid */}
      <svg width="140" height="140" viewBox="0 0 140 140" style={{ display: 'block' }}>
        <rect width="140" height="140" fill="white"/>
        {/* Finder patterns */}
        <rect x="5" y="5" width="40" height="40" fill="black"/><rect x="9" y="9" width="32" height="32" fill="white"/><rect x="13" y="13" width="24" height="24" fill="black"/>
        <rect x="95" y="5" width="40" height="40" fill="black"/><rect x="99" y="9" width="32" height="32" fill="white"/><rect x="103" y="13" width="24" height="24" fill="black"/>
        <rect x="5" y="95" width="40" height="40" fill="black"/><rect x="9" y="99" width="32" height="32" fill="white"/><rect x="13" y="103" width="24" height="24" fill="black"/>
        {/* Data pattern (fake but looks like QR) */}
        {[0,1,2,3,4,5,6,7,8].map(row => [0,1,2,3,4,5,6,7,8].map(col => {
          const hash = (row * 13 + col * 7 + row * col) % 3
          if (hash === 0 && !((row < 5 && col < 5) || (row < 5 && col > 5) || (row > 5 && col < 5))) {
            return <rect key={`${row}-${col}`} x={50 + col * 5} y={50 + row * 5} width="4" height="4" fill="black"/>
          }
          return null
        }))}
        {[0,2,4,6,8,10,12].map(i => <rect key={`t${i}`} x={50 + i * 5} y={50} width="4" height="4" fill="black"/>)}
        {[1,3,5,7,9,11].map(i => <rect key={`tt${i}`} x={50 + i * 5} y={55} width="4" height="4" fill="black"/>)}
        {[0,3,6,9,12].map(i => <rect key={`tb${i}`} x={50 + i * 5} y={60} width="4" height="4" fill="black"/>)}
        {[1,4,7,10].map(i => <rect key={`tc${i}`} x={50 + i * 5} y={65} width="4" height="4" fill="black"/>)}
        {[2,5,8,11].map(i => <rect key={`td${i}`} x={50 + i * 5} y={70} width="4" height="4" fill="black"/>)}
        {[0,3,6,9,12].map(i => <rect key={`te${i}`} x={50 + i * 5} y={75} width="4" height="4" fill="black"/>)}
        {[1,4,8,12].map(i => <rect key={`tf${i}`} x={50 + i * 5} y={80} width="4" height="4" fill="black"/>)}
        {[2,5,7,10].map(i => <rect key={`tg${i}`} x={50 + i * 5} y={85} width="4" height="4" fill="black"/>)}
        {[0,3,6,9].map(i => <rect key={`th${i}`} x={50 + i * 5} y={90} width="4" height="4" fill="black"/>)}
        {[1,5,8,11].map(i => <rect key={`ti${i}`} x={50 + i * 5} y={95} width="4" height="4" fill="black"/>)}
        {[2,4,7,10,12].map(i => <rect key={`tj${i}`} x={50 + i * 5} y={100} width="4" height="4" fill="black"/>)}
        {[0,3,6,9,12].map(i => <rect key={`tk${i}`} x={50 + i * 5} y={105} width="4" height="4" fill="black"/>)}
        {[1,4,7,11].map(i => <rect key={`tl${i}`} x={50 + i * 5} y={110} width="4" height="4" fill="black"/>)}
      </svg>
      <div style={{ marginTop: 10, fontSize: 11, color: '#333' }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#D4AF37', marginBottom: 2 }}>฿{amount.toLocaleString()}</div>
        <div>{payMethod === 'PROMPTPAY' ? '081-234-5678' : 'LINE: @cattycar'}</div>
        <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>Catty Car Rental</div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', paddingTop: 90, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
        <Link href={`/${locale}/cars/${carId}`} className="inline-flex items-center gap-1.5 text-slate-500 no-underline mb-6 text-sm transition-colors duration-200 hover:text-amber-400">
          <ArrowLeft size={15} /> {th ? 'กลับ' : 'Back'}
        </Link>

        <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
          {th ? 'จองรถ' : 'Book a Car'} 🚗
        </h1>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32, marginTop: 20 }}>
          {[{ n: 1, l: th ? 'วันที่' : 'Dates' }, { n: 2, l: th ? 'ชำระเงิน' : 'Payment' }, { n: 3, l: th ? 'บริการเสริม' : 'Add-ons' }, { n: 4, l: th ? 'ยืนยัน' : 'Confirm' }].map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <button onClick={() => { if (s.n < step || (s.n === step + 1 && canProceed())) setStep(s.n) }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, background: 'transparent', border: 'none', cursor: 'pointer', flex: 1, padding: 0 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, transition: '.3s', background: step > s.n ? 'linear-gradient(135deg,#D4AF37,#F5D45E)' : step === s.n ? 'linear-gradient(135deg,#D4AF37,#F5D45E)' : 'rgba(255,255,255,0.08)', color: step >= s.n ? '#000' : '#64748B' }}>
                  {step > s.n ? <Check size={16} strokeWidth={3} /> : s.n}
                </div>
                <span style={{ fontSize: 11, color: step >= s.n ? '#D4AF37' : '#64748B', fontWeight: step === s.n ? 600 : 400, whiteSpace: 'nowrap' }}>{s.l}</span>
              </button>
              {i < 3 && <div style={{ flex: 1, height: 2, background: step > s.n ? 'linear-gradient(90deg,#D4AF37,#F5D45E)' : 'rgba(255,255,255,0.08)', marginBottom: 20, transition: '.3s', minWidth: 20 }} />}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 22, alignItems: 'start' }}>
          {/* LEFT */}
          <div>
            {/* STEP 1 */}
            {step === 1 && (
              <div style={S.card}>
                <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={18} color="#D4AF37" /></div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{th ? 'เลือกวันที่รับ-คืนรถ' : 'Select Pickup & Return'}</div>
                </div>
                <div style={{ padding: '20px 22px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={S.label}>{th ? '📅 วันรับรถ' : '📅 Pickup Date'}</label>
                      <input type="date" value={pickup} min={today} style={S.input} onChange={e => { setPickup(e.target.value); if (e.target.value >= returnD) setReturnD(format(addDays(new Date(e.target.value), 1), 'yyyy-MM-dd')) }} />
                    </div>
                    <div>
                      <label style={S.label}>{th ? '📅 วันคืนรถ' : '📅 Return Date'}</label>
                      <input type="date" value={returnD} min={pickup ? format(addDays(new Date(pickup), 1), 'yyyy-MM-dd') : today} style={S.input} onChange={e => setReturnD(e.target.value)} />
                    </div>
                  </div>
                  {totalDays > 0 && (
                    <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <span style={{ color: '#94A3B8', fontSize: 14 }}>{totalDays} {th ? 'วัน' : 'days'} × ฿{car.pricePerDay.toLocaleString()}</span>
                      <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: 22, fontFamily: '"Playfair Display",serif' }}>฿{carTotal.toLocaleString()}</span>
                    </div>
                  )}
                  <button onClick={() => { if (canProceed()) setStep(2); else toast.error(th ? 'กรุณาเลือกวันที่' : 'Please select dates') }} className="btn-gold" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 14, borderRadius: 12, opacity: totalDays < 1 ? .5 : 1 }}>
                    {th ? 'ถัดไป: เลือกวิธีชำระเงิน →' : 'Next: Choose Payment →'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div style={S.card}>
                <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(10,191,188,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CreditCard size={18} color="#0ABFBC" /></div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{th ? 'เลือกวิธีชำระเงิน' : 'Payment Method'}</div>
                </div>
                <div style={{ padding: '18px 22px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                    {PAYMENT_METHODS.map(pm => (
                      <div key={pm.id} onClick={() => setPayMethod(pm.id)} className="pay-option" style={{ background: payMethod === pm.id ? 'rgba(212,175,55,0.07)' : 'rgba(255,255,255,0.02)', borderColor: payMethod === pm.id ? '#D4AF37' : 'rgba(255,255,255,0.08)', cursor: 'pointer' }}>
                        <span style={{ fontSize: 22, width: 30 }}>{pm.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{th ? pm.labelTh : pm.labelEn}</div>
                          <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{pm.desc}</div>
                        </div>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${payMethod === pm.id ? '#D4AF37' : 'rgba(255,255,255,0.2)'}`, background: payMethod === pm.id ? '#D4AF37' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: '.2s' }}>
                          {payMethod === pm.id && <Check size={12} color="#000" strokeWidth={3} />}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* QR code display */}
                  {selectedPM.hasQR && grandTotal > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, textAlign: 'center', marginBottom: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 14 }}>
                        <QrCode size={16} style={{ display: 'inline', marginRight: 6 }} />{th ? 'สแกน QR ชำระเงิน' : 'Scan QR to Pay'}
                      </div>
                      <QRCodeDisplay amount={grandTotal > 0 ? grandTotal : carTotal} />
                      <div style={{ marginTop: 12, fontSize: 12, color: '#64748B' }}>
                        {th ? 'หลังโอนแล้ว กรุณาอัปโหลดสลิปด้านล่าง' : 'After payment, upload slip below'}
                      </div>
                    </div>
                  )}

                  {/* Bank transfer info */}
                  {payMethod === 'BANK_TRANSFER' && (
                    <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
                      <div style={{ fontWeight: 600, color: '#D4AF37', marginBottom: 8, fontSize: 13 }}>💳 {th ? 'ข้อมูลบัญชีธนาคาร' : 'Bank Account'}</div>
                      <div style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.8 }}>
                        <div>ธนาคาร: <strong style={{ color: '#fff' }}>กสิกรไทย (KBANK)</strong></div>
                        <div>{th ? 'เลขบัญชี: ' : 'Account No: '}<strong style={{ color: '#fff', fontFamily: 'monospace', fontSize: 15 }}>123-4-56789-0</strong></div>
                        <div>{th ? 'ชื่อ: ' : 'Name: '}<strong style={{ color: '#fff' }}>Catty Car Rental</strong></div>
                      </div>
                    </div>
                  )}

                  {/* Credit card form */}
                  {payMethod === 'CREDIT_CARD' && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 18, marginBottom: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 14 }}>💳 {th ? 'ข้อมูลบัตร' : 'Card Details'}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div>
                          <label style={S.label}>{th ? 'หมายเลขบัตร' : 'Card Number'}</label>
                          <input className="input-field" placeholder="1234 5678 9012 3456" value={cardForm.number}
                            onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0,16).replace(/(\d{4})/g,'$1 ').trim(); setCardForm(p => ({ ...p, number: v })) }} maxLength={19} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div>
                            <label style={S.label}>{th ? 'วันหมดอายุ' : 'Expiry'}</label>
                            <input className="input-field" placeholder="MM/YY" value={cardForm.expiry}
                              onChange={e => { const v = e.target.value.replace(/\D/g,'').slice(0,4); setCardForm(p => ({ ...p, expiry: v.length > 2 ? v.slice(0,2)+'/'+v.slice(2) : v })) }} maxLength={5} />
                          </div>
                          <div>
                            <label style={S.label}>CVV</label>
                            <input className="input-field" placeholder="123" type="password" value={cardForm.cvv}
                              onChange={e => setCardForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g,'').slice(0,4) }))} maxLength={4} />
                          </div>
                        </div>
                        <div>
                          <label style={S.label}>{th ? 'ชื่อบนบัตร' : 'Name on Card'}</label>
                          <input className="input-field" placeholder="JOHN DOE" value={cardForm.name}
                            onChange={e => setCardForm(p => ({ ...p, name: e.target.value.toUpperCase() }))} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cash info */}
                  {payMethod === 'CASH' && (
                    <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
                      <div style={{ color: '#34D399', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>💵 {th ? 'ชำระเงินสด' : 'Cash Payment'}</div>
                      <div style={{ color: '#94A3B8', fontSize: 13 }}>{th ? 'ชำระเงินเมื่อรับรถ ไม่ต้องอัปโหลดสลิป' : 'Pay on pickup. No slip needed.'}</div>
                    </div>
                  )}

                  {/* Slip upload */}
                  {selectedPM.hasSlip && (
                    <div style={{ marginBottom: 16 }}>
                      <label style={S.label}>{th ? '📸 อัปโหลดสลิป (บังคับ)' : '📸 Upload Slip (Required)'}</label>
                      <div onClick={() => !slipPreview && slipRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleSlip(f) }}
                        style={{ border: `2px dashed ${slipPreview ? '#0ABFBC' : 'rgba(212,175,55,0.2)'}`, borderRadius: 14, padding: slipPreview ? 12 : 28, textAlign: 'center', cursor: slipPreview ? 'default' : 'pointer', transition: '.3s', position: 'relative' }}>
                        {slipPreview ? (
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img src={slipPreview} alt="slip" style={{ maxHeight: 140, borderRadius: 10, objectFit: 'contain' }} />
                            <button onClick={e => { e.stopPropagation(); setSlipPreview(''); setSlipUrl(''); if (slipRef.current) slipRef.current.value = '' }}
                              style={{ position: 'absolute', top: -6, right: -6, width: 24, height: 24, borderRadius: '50%', background: '#ef4444', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✕</button>
                            <div style={{ marginTop: 8, fontSize: 12, color: '#34D399', fontWeight: 600 }}>✅ {th ? 'อัปโหลดสำเร็จ' : 'Uploaded'}</div>
                          </div>
                        ) : uploadingSlip ? (
                          <div style={{ color: '#94A3B8', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #D4AF37', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />{th ? 'กำลังอัปโหลด...' : 'Uploading...'}
                          </div>
                        ) : (
                          <>
                            <Upload size={28} color="#64748B" style={{ margin: '0 auto 8px', display: 'block' }} />
                            <div style={{ color: '#94A3B8', fontSize: 13, marginBottom: 4 }}>{th ? 'คลิกหรือลากไฟล์มาวาง' : 'Click or drag & drop'}</div>
                            <div style={{ color: '#475569', fontSize: 11 }}>PNG, JPG max 5MB</div>
                          </>
                        )}
                        <input ref={slipRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleSlip(f) }} />
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setStep(1)} className="btn-outline" style={{ flex: 1, justifyContent: 'center', borderRadius: 12, padding: '12px' }}>← {th ? 'กลับ' : 'Back'}</button>
                    <button onClick={() => { if (canProceed()) setStep(3); else toast.error(selectedPM.hasSlip ? (th ? 'กรุณาอัปโหลดสลิป' : 'Please upload slip') : (th ? 'กรุณากรอกข้อมูลบัตร' : 'Please fill card details')) }}
                      className="btn-gold" style={{ flex: 2, justifyContent: 'center', borderRadius: 12, padding: '12px', fontSize: 14 }}>
                      {th ? 'ถัดไป: บริการเสริม →' : 'Next: Add-ons →'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div style={S.card}>
                <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,107,157,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles size={18} color="#FF6B9D" /></div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{th ? 'บริการเสริม (ไม่บังคับ)' : 'Add-on Services'}</div>
                    <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{th ? 'ที่พัก • เสริมสวย • ติวเรียน' : 'Stay · Beauty · Tutoring'}</div>
                  </div>
                </div>
                <div style={{ padding: '16px 22px' }}>
                  {SERVICE_CATS.map(cat => {
                    const catSvcs = services.filter(s => s.category === cat.key)
                    const isOpen = openCat === cat.key
                    const selCount = catSvcs.filter(s => selectedAddons[s.id]).length
                    return (
                      <div key={cat.key} style={{ marginBottom: 10 }}>
                        <button onClick={() => setOpenCat(isOpen ? null : cat.key)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, background: isOpen ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.07)`, cursor: 'pointer' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 18 }}>{cat.icon}</span>
                            <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{th ? cat.labelTh : cat.labelEn}</span>
                            {selCount > 0 && <span style={{ background: cat.color, color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>{selCount}</span>}
                          </div>
                          {isOpen ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
                        </button>
                        {isOpen && (
                          <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {catSvcs.map(svc => {
                              const sel = !!selectedAddons[svc.id]
                              return (
                                <div key={svc.id} onClick={() => setSelectedAddons(p => ({ ...p, [svc.id]: !p[svc.id] }))} className="svc-card" style={{ borderColor: sel ? '#D4AF37' : 'rgba(255,255,255,0.07)', background: sel ? 'rgba(212,175,55,0.07)' : 'rgba(255,255,255,0.02)' }}>
                                  {svc.image && (
                                    <div style={{ position: 'relative', height: 80, overflow: 'hidden' }}>
                                      <Image src={svc.image} alt={svc.name} fill style={{ objectFit: 'cover' }} unoptimized />
                                      {sel && <div style={{ position: 'absolute', inset: 0, background: 'rgba(212,175,55,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={24} color="#D4AF37" strokeWidth={3} /></div>}
                                    </div>
                                  )}
                                  <div style={{ padding: '10px 12px' }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{th ? svc.nameTh : svc.name}</div>
                                    <div style={{ fontSize: 11, color: '#64748B', marginBottom: 6, lineHeight: 1.4, height: 32, overflow: 'hidden' }}>{th ? svc.descTh : svc.description}</div>
                                    <div style={{ color: sel ? '#D4AF37' : '#94A3B8', fontWeight: 700, fontSize: 13 }}>฿{svc.price.toLocaleString()}<span style={{ fontWeight: 400, fontSize: 10, color: '#64748B' }}>/{svc.unit}</span></div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div style={{ padding: '0 22px 20px', display: 'flex', gap: 10 }}>
                  <button onClick={() => setStep(2)} className="btn-outline" style={{ flex: 1, justifyContent: 'center', borderRadius: 12, padding: '12px' }}>← {th ? 'กลับ' : 'Back'}</button>
                  <button onClick={() => setStep(4)} className="btn-gold" style={{ flex: 2, justifyContent: 'center', borderRadius: 12, padding: '12px', fontSize: 14 }}>
                    {th ? 'ถัดไป: ยืนยัน →' : 'Next: Confirm →'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div style={S.card}>
                <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>✅ {th ? 'สรุปการจอง' : 'Booking Summary'}</div>
                </div>
                <div style={{ padding: '20px 22px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                    {[
                      { l: th ? 'รถ' : 'Car', v: `${car.brand} ${car.model} ${car.year}` },
                      { l: th ? 'วันรับ' : 'Pickup', v: format(new Date(pickup), 'dd/MM/yyyy') },
                      { l: th ? 'วันคืน' : 'Return', v: format(new Date(returnD), 'dd/MM/yyyy') },
                      { l: th ? 'จำนวนวัน' : 'Days', v: `${totalDays} ${th ? 'วัน' : 'days'}` },
                      { l: th ? 'ราคารถ' : 'Car Total', v: `฿${carTotal.toLocaleString()}` },
                      { l: th ? 'วิธีชำระ' : 'Payment', v: th ? selectedPM.labelTh : selectedPM.labelEn },
                    ].map(r => (
                      <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ color: '#64748B' }}>{r.l}</span>
                        <span style={{ color: '#fff', fontWeight: 500 }}>{r.v}</span>
                      </div>
                    ))}
                    {services.filter(s => selectedAddons[s.id]).length > 0 && (
                      <>
                        <div style={{ fontSize: 12, color: '#FF6B9D', fontWeight: 600, paddingTop: 4 }}>✨ {th ? 'บริการเสริม' : 'Add-ons'}</div>
                        {services.filter(s => selectedAddons[s.id]).map(s => (
                          <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                            <span style={{ color: '#94A3B8' }}>+ {th ? s.nameTh : s.name}</span>
                            <span style={{ color: '#FF6B9D' }}>฿{s.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </>
                    )}
                    <div style={{ borderTop: '2px solid rgba(212,175,55,0.2)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{th ? 'ยอดรวมทั้งหมด' : 'Grand Total'}</span>
                      <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: 26, fontFamily: '"Playfair Display",serif' }}>฿{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setStep(3)} className="btn-outline" style={{ flex: 1, justifyContent: 'center', borderRadius: 12, padding: '12px' }}>← {th ? 'กลับ' : 'Back'}</button>
                    <button onClick={submit} disabled={submitting}
                      style={{ flex: 2, background: submitting ? '#333' : 'linear-gradient(135deg,#D4AF37,#F5D45E)', color: submitting ? '#666' : '#000', border: 'none', padding: '13px', borderRadius: 12, fontFamily: 'Kanit, sans-serif', fontWeight: 700, fontSize: 15, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      {submitting ? (th ? 'กำลังส่ง...' : 'Submitting...') : (`🎉 ${th ? 'ยืนยันการจอง' : 'Confirm Booking'}`)}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT - Summary sticky */}
          <div style={{ position: 'sticky', top: 90 }}>
            <div style={S.card}>
              <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: '#0e0e1a' }}>
                {car.images?.[0]
                  ? <Image src={car.images[0]} alt={`${car.brand} ${car.model}`} fill style={{ objectFit: 'cover' }} unoptimized />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>🚗</div>}
              </div>
              <div style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{car.brand} {car.model}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginBottom: 14 }}>{car.year} · {car.type} · {car.seats} {th ? 'ที่นั่ง' : 'seats'}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>฿{car.pricePerDay.toLocaleString()} × {totalDays || '?'} {th ? 'วัน' : 'd'}</span>
                    <span style={{ color: '#fff' }}>฿{carTotal.toLocaleString()}</span>
                  </div>
                  {addonTotal > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>{th ? 'บริการเสริม' : 'Add-ons'}</span>
                    <span style={{ color: '#FF6B9D' }}>+฿{addonTotal.toLocaleString()}</span>
                  </div>}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{th ? 'รวม' : 'Total'}</span>
                    <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: 22, fontFamily: '"Playfair Display",serif' }}>฿{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 16 }}>
                  {[1,2,3,4].map(n => (
                    <button key={n} onClick={() => setStep(n)} style={{ width: n === step ? 20 : 7, height: 7, borderRadius: 4, border: 'none', cursor: 'pointer', background: n === step ? '#D4AF37' : n < step ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.1)', transition: '.3s', padding: 0 }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
