import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { ArrowLeft, CalendarDays, Users, Cog, Zap, Gauge } from 'lucide-react'

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

export default async function CarDetailPage({ params: { locale, id } }: { params: { locale: string; id: string } }) {
  const th = locale === 'th'

  let car: any = null
  try {
    const rawCar = await prisma.car.findUnique({ where: { id: Number(id) } })
    if (!rawCar) notFound()
    car = {
      ...rawCar,
      images: parseImages(rawCar.images),
      features: parseFeatures(rawCar.features),
    }
  } catch { notFound() }

  const fuelLabel: Record<string, string> = {
    gasoline: th ? 'น้ำมัน' : 'Gasoline',
    diesel: th ? 'ดีเซล' : 'Diesel',
    electric: th ? 'ไฟฟ้า' : 'Electric',
    hybrid: th ? 'ไฮบริด' : 'Hybrid',
  }

  const specs = [
    { label: th ? 'ปี' : 'Year', value: car.year, icon: CalendarDays },
    { label: th ? 'ประเภท' : 'Type', value: car.type, icon: Users },
    { label: th ? 'ที่นั่ง' : 'Seats', value: String(car.seats), icon: Users },
    { label: th ? 'เกียร์' : 'Transmission', value: car.transmission === 'auto' ? (th ? 'ออโต้' : 'Automatic') : (th ? 'ธรรมดา' : 'Manual'), icon: Cog },
    { label: th ? 'เชื้อเพลิง' : 'Fuel', value: fuelLabel[car.fuel] || car.fuel, icon: Zap },
    { label: th ? 'ทะเบียน' : 'Plate', value: car.plateNumber, icon: Gauge },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <style>{`
        .spec-card {
          transition: all .3s cubic-bezier(0.4,0,0.2,1);
          border: 1px solid #e5e7eb;
        }
        .spec-card:hover {
          border-color: #D4AF37;
          box-shadow: 0 4px 12px rgba(212,175,55,0.15);
        }
        .feature-badge {
          transition: all .2s cubic-bezier(0.4,0,0.2,1);
        }
        .feature-badge:hover {
          background: linear-gradient(135deg,rgba(10,191,188,0.15),rgba(212,175,55,0.1)) !important;
        }
        .book-btn {
          transition: all .3s cubic-bezier(0.4,0,0.2,1);
        }
        .book-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(212,175,55,0.3);
        }
        .contact-btn {
          transition: all .2s cubic-bezier(0.4,0,0.2,1);
        }
        .contact-btn:hover {
          background: rgba(212,175,55,0.05) !important;
        }
      `}</style>

      {/* Header Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(10,191,188,0.1) 100%)',
        backdropFilter: 'blur(10px)',
        padding: '28px 0 80px',
        borderBottom: '1px solid rgba(212,175,55,0.1)',
        position: 'relative',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <Link href={`/${locale}/cars`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#D4AF37', textDecoration: 'none', marginBottom: 24, fontSize: 14, fontWeight: 700 }}>
            <ArrowLeft size={16} /> {th ? 'กลับไปหน้ารถ' : 'Back to Cars'}
          </Link>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'end' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0ABFBC', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>🚗 {th ? 'รถเช่าพรีเมียม' : 'PREMIUM CAR'}</div>
              <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, margin: 0, color: '#fff', marginBottom: 8 }}>{car.brand} {car.model}</h1>
              <p style={{ color: '#cbd5e1', fontSize: 15, margin: 0 }}>{car.year} • {car.type} • {car.seats} {th ? 'ที่นั่ง' : 'seats'}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, color: '#cbd5e1', marginBottom: 6 }}>{th ? 'ราคาต่อวัน' : 'Price per day'}</div>
              <div style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(36px,4vw,48px)', fontWeight: 900, background: 'linear-gradient(135deg,#D4AF37,#F5D45E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                ฿{car.pricePerDay.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40, marginBottom: 60 }}>

          {/* Left Column */}
          <div>
            {/* Hero Image */}
            <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', marginBottom: 40, background: '#e8e8e8', height: 420 }}>
              {car.images?.[0] ? (
                <Image src={car.images[0]} alt={`${car.brand} ${car.model}`} fill style={{ objectFit: 'cover' }} unoptimized />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', fontSize: 80, color: '#d1d5db' }}>🚗</div>
              )}
            </div>

            {/* Specs Grid */}
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 20 }}>{th ? '📋 ข้อมูลรถ' : '📋 Car Specifications'}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {specs.map((spec) => (
                  <div key={spec.label} className="spec-card" style={{
                    background: '#fff',
                    borderRadius: 16,
                    padding: 20,
                    display: 'flex',
                    gap: 14,
                    alignItems: 'center',
                  }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg,rgba(212,175,55,0.1),rgba(10,191,188,0.1))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <spec.icon size={20} color="#D4AF37" />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, marginBottom: 4 }}>{spec.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>{spec.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {car.features?.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 20 }}>✨ {th ? 'ฟีเจอร์เด่น' : 'Key Features'}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
                  {car.features.map((feature: string, i: number) => (
                    <div key={i} className="feature-badge" style={{
                      background: 'linear-gradient(135deg,rgba(10,191,188,0.1),rgba(212,175,55,0.05))',
                      border: '1px solid rgba(212,175,55,0.2)',
                      borderRadius: 12,
                      padding: '12px 14px',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#0ABFBC',
                      textAlign: 'center',
                    }}>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 12 }}>{th ? 'เกี่ยวกับรถคันนี้' : 'About This Car'}</h3>
              <p style={{ color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
                {th
                  ? `${car.brand} ${car.model} คุณภาพสูง ตรวจสอบครบถ้วน พร้อมให้บริการ 24 ชั่วโมง ราคายุติธรรม ไม่มีค่าใช้จ่ายแอบแฝง`
                  : `${car.brand} ${car.model} premium quality, fully inspected, available 24/7. Fair pricing with no hidden costs.`}
              </p>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div>
            <div style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 20,
              padding: 28,
              position: 'sticky',
              top: 100,
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 6 }}>
                {th ? 'ข้อมูลการจอง' : 'Booking Details'}
              </h3>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 24 }}>
                {th ? 'สะดวก รวดเร็ว ปลอดภัย' : 'Easy, Quick & Secure'}
              </p>

              {/* Booking Date Section */}
              <div style={{ marginBottom: 20, padding: '16px', background: 'linear-gradient(135deg, rgba(212,175,55,0.05), rgba(10,191,188,0.05))', borderRadius: 14, border: '1px solid rgba(212,175,55,0.1)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>{th ? 'วันรับ' : 'Pickup Date'}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>22 เม.ย. 2026 10:00</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>{th ? 'วันคืน' : 'Return Date'}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>24 เม.ย. 2026 10:00</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#0ABFBC', fontWeight: 600 }}>
                  {th ? '✓ ฟรี ส่งรับ - คืนรถ' : '✓ Free Pickup & Return'}
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{ background: '#f9f9f9', borderRadius: 14, padding: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13, paddingBottom: 12, borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>{th ? 'ราคา / วัน' : 'Price / Day'}</span>
                  <span style={{ fontWeight: 600, color: '#111' }}>฿{car.pricePerDay.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13, paddingBottom: 12, borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>{th ? 'จำนวนวัน' : 'Days'}</span>
                  <span style={{ fontWeight: 600, color: '#111' }}>2 {th ? 'วัน' : 'days'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13, paddingBottom: 12, borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>{th ? 'ค่าประกัน' : 'Insurance'}</span>
                  <span style={{ fontWeight: 600, color: '#111' }}>{th ? 'ฟรี' : 'Free'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, color: '#D4AF37' }}>
                  <span>{th ? 'รวมทั้งสิ้น' : 'Total'}</span>
                  <span style={{ fontSize: 20 }}>฿{(car.pricePerDay * 2).toLocaleString()}</span>
                </div>
              </div>

              {/* Highlights */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { icon: '✅', text: th ? 'ทันทีไม่มีรอ' : 'Instant Approval' },
                    { icon: '💳', text: th ? 'หลายวิธีชำระ' : 'Multiple Payment' },
                    { icon: '🛡️', text: th ? 'ประกันครบ' : 'Full Insurance' },
                    { icon: '🎁', text: th ? 'ส่วนลด 20% วันนี้' : '20% Off Today' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                      <span style={{ color: '#4b5563', fontSize: 12, fontWeight: 500 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <Link href={`/${locale}/booking/${car.id}`} className="book-btn" style={{
                display: 'block',
                width: '100%',
                padding: '16px 0',
                background: 'linear-gradient(135deg, #D4AF37, #F5D45E)',
                color: '#000',
                textDecoration: 'none',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 12,
                marginBottom: 12,
                cursor: 'pointer',
              }}>
                {th ? '✓ ยืนยันการจอง' : '✓ Confirm Booking'}
              </Link>

              <button className="contact-btn" style={{
                width: '100%',
                padding: '14px 0',
                background: 'transparent',
                border: '1.5px solid #D4AF37',
                color: '#D4AF37',
                fontSize: 15,
                fontWeight: 700,
                borderRadius: 12,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
                {th ? '💬 ติดต่อเรา' : '💬 Chat with Us'}
              </button>

              {/* Rating */}
              <div style={{ marginTop: 20, padding: '14px', background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(10,191,188,0.08))', borderRadius: 12, border: '1px solid rgba(212,175,55,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 18 }}>⭐</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>4.9 {th ? 'คะแนน' : 'Rating'}</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#0ABFBC', fontWeight: 600 }}>100% {th ? 'พึงพอใจ' : 'Satisfied'}</span>
                </div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  {th ? 'จาก 500+ รีวิว' : 'Based on 500+ reviews'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28, marginBottom: 60 }}>
          {[
            {
              title: th ? '📋 ข้อมูลเพิ่มเติม' : '📋 Additional Info',
              items: [
                { label: th ? 'เชื้อเพลิง' : 'Fuel Type', value: fuelLabel[car.fuel] },
                { label: th ? 'ประตู' : 'Doors', value: '4' },
                { label: th ? 'กระบะ' : 'Trunk', value: th ? 'กว้างขวาง' : 'Spacious' },
              ],
            },
            {
              title: th ? '🛡️ ความปลอดภัย' : '🛡️ Safety',
              items: [
                { label: th ? 'เบลค' : 'Brakes', value: 'ABS' },
                { label: th ? 'ถุงลม' : 'Airbags', value: th ? '6 ใบ' : '6 units' },
                { label: th ? 'ล็อค' : 'Lock', value: th ? 'สมาร์ท' : 'Smart' },
              ],
            },
            {
              title: th ? '🎁 บริการเพิ่มเติม' : '🎁 Add-ons',
              items: [
                { label: 'GPS', value: th ? '฿200/วัน' : '฿200/day' },
                { label: th ? 'ที่นั่งเด็ก' : 'Child seat', value: th ? '฿150/วัน' : '฿150/day' },
                { label: th ? 'รับส่ง' : 'Pickup', value: th ? 'ฟรี' : 'Free' },
              ],
            },
          ].map((section, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 16 }}>{section.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {section.items.map((item, j) => (
                  <div key={j} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: j < section.items.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <span style={{ color: '#6b7280', fontSize: 13 }}>{item.label}</span>
                    <span style={{ fontWeight: 600, color: '#111' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 20, padding: 40, marginBottom: 60 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111', marginBottom: 32, textAlign: 'center' }}>
            {th ? '❓ คำถามที่พบบ่อย' : '❓ Frequently Asked Questions'}
          </h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {[
              { q: th ? 'จองอย่างไร?' : 'How do I book?', a: th ? 'เลือกรถ ใส่วันที่ แล้วจ่ายค่ามัดจำ บรรลัย!' : 'Select car, enter dates, pay deposit. Done!' },
              { q: th ? 'เปลี่ยนวันได้ไหม?' : 'Can I change dates?', a: th ? 'ติดต่อเรา ก่อนล่วงหน้า 24 ชั่วโมง' : 'Contact us 24h before for free changes' },
              { q: th ? 'ประกันครอบคลุมอะไร?' : 'What does insurance cover?', a: th ? 'ประกันครบทั้งอุบัติเหตุ' : 'Comprehensive coverage included' },
              { q: th ? 'รับส่งฟรีไหม?' : 'Is pickup free?', a: th ? 'ฟรีในเมืองภูเก็ต บริเวณอื่นดูราคา' : 'Free in Phuket, ask for other areas' },
            ].map((faq, i) => (
              <div key={i} style={{
                background: 'linear-gradient(135deg,#f9f9f9,#f5f5f5)',
                border: '1px solid #e5e7eb',
                borderRadius: 14,
                padding: 20,
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 8 }}>{faq.q}</div>
                <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}