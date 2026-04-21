import Link from 'next/link'
import Image from 'next/image'
import prisma from '@/lib/prisma'
import HeroButtons from '@/components/home/HeroButtons'

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

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const th = locale === 'th'
  let cars: any[] = []
  try {
    cars = await prisma.car.findMany({ where: { isAvailable: true }, take: 4, orderBy: { createdAt: 'desc' } })
    cars = cars.map((car) => ({ ...car, images: parseImages(car.images) }))
  } catch (error) {
    console.error('HOME PAGE CAR QUERY ERROR:', error)
  }

  const features = [
    { e: '🔑', t: th ? 'จองง่าย' : 'Easy Booking', d: th ? 'จองออนไลน์ 24 ชม. อนุมัติภายใน 30 นาที' : 'Book online 24/7, approved in 30 minutes', c: 'rgba(212,175,55,0.1)', bc: 'rgba(212,175,55,0.2)' },
    { e: '🛡️', t: th ? 'ประกันครอบคลุม' : 'Full Insurance', d: th ? 'รถทุกคันมีประกันชั้น 1' : 'All cars include comprehensive insurance', c: 'rgba(10,191,188,0.1)', bc: 'rgba(10,191,188,0.2)' },
    { e: '💎', t: th ? 'รถใหม่พรีเมียม' : 'Premium Cars', d: th ? 'ดูแลดี อายุไม่เกิน 3 ปี' : 'Well-maintained, max 3 years old', c: 'rgba(255,107,157,0.1)', bc: 'rgba(255,107,157,0.2)' },
    { e: '📍', t: th ? 'ส่งถึงที่' : 'Delivery', d: th ? 'บริการรับ-ส่งถึงโรงแรม สนามบิน' : 'Pick-up/drop at hotel or airport', c: 'rgba(139,92,246,0.1)', bc: 'rgba(139,92,246,0.2)' },
    { e: '🌙', t: th ? 'บริการ 24/7' : '24/7 Support', d: th ? 'ทีมงานพร้อมช่วยตลอด 24 ชั่วโมง' : 'Team available round the clock', c: 'rgba(212,175,55,0.1)', bc: 'rgba(212,175,55,0.2)' },
    { e: '💸', t: th ? 'ราคาโปร่งใส' : 'Fair Pricing', d: th ? 'ไม่มีค่าใช้จ่ายซ่อนเร้น' : 'No hidden fees, clear pricing', c: 'rgba(10,191,188,0.1)', bc: 'rgba(10,191,188,0.2)' },
    { e: '🏠', t: th ? 'ที่พัก' : 'Stay', d: th ? 'จองที่พักพร้อมรถในครั้งเดียว' : 'Book accommodation with your car', c: 'rgba(255,107,157,0.1)', bc: 'rgba(255,107,157,0.2)' },
    { e: '📚', t: th ? 'ติวเรียน' : 'Tutoring', d: th ? 'ติวเคมี คณิต ฟิสิกส์ วิทย์' : 'Chemistry, Math, Physics tutoring', c: 'rgba(139,92,246,0.1)', bc: 'rgba(139,92,246,0.2)' },
  ]

  const specs = [
    { label: th ? 'จองวันนี้' : 'Book today', value: th ? 'ลด 20%' : '20% off' },
    { label: th ? 'จองล่วงหน้า 7 วัน' : '7-day advance', value: th ? 'ส่วนลดทันที' : 'Instant discount' },
    { label: th ? 'คำถามที่พบบ่อย' : 'FAQs', value: th ? 'ตอบไว' : 'Fast answers' },
  ]

  const heroBookingId = cars[0]?.id ? String(cars[0].id) : ''
  const heroBookingHref = heroBookingId ? `/${locale}/booking/${heroBookingId}` : `/${locale}/cars`

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, background: 'transparent' }}>
      <section style={{ position: 'relative', overflow: 'hidden', padding: '90px 5% 60px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 10% 20%, rgba(10,191,188,0.12), transparent 18%), radial-gradient(circle at 90% 15%, rgba(212,175,55,0.12), transparent 18%)' }} />
        <div style={{ position: 'absolute', left: '8%', top: '10%', width: 340, height: 340, borderRadius: '50%', background: 'rgba(212,175,55,0.08)' }} />
        <div style={{ position: 'absolute', right: '4%', bottom: '10%', width: 360, height: 360, borderRadius: '50%', background: 'rgba(10,191,188,0.08)' }} />

        <div style={{ position: 'relative', maxWidth: 1220, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 34, alignItems: 'center' }}>
          <div style={{ zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(10,191,188,0.1)', border: '1px solid rgba(10,191,188,0.25)', padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 700, color: '#0ABFBC', marginBottom: 20 }}>
              🚗 {th ? 'รถเช่าพรีเมียม ภูเก็ต' : 'Premium Phuket Rental'}
            </div>
            <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(46px,6vw,86px)', lineHeight: 1.02, marginBottom: 18, color: '#F1F5F9' }}>
              {th ? 'เช่ารถสวย' : 'Rent a stylish'}
              <span style={{ display: 'block', background: 'linear-gradient(135deg, #D4AF37, #0ABFBC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{th ? 'เดินทางมีสไตล์' : 'ride with confidence'}</span>
            </h1>
            <p style={{ color: '#CBD5E1', fontSize: 18, lineHeight: 1.85, maxWidth: 620, marginBottom: 32 }}>
              {th ? 'จองวันนี้ลด 20% • จองล่วงหน้า 7 วัน ลดทันที • ไม่มีค่าใช้จ่ายซ่อน • บริการ 24/7' : 'Book today for 20% off • 7-day advance booking • No hidden fees • 24/7 support'}
            </p>
            <HeroButtons locale={locale} th={th} />
          </div>

          <div className="hero-surface" style={{ position: 'relative', padding: 28, minHeight: 520, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <div style={{ width: 54, height: 54, borderRadius: 18, background: 'linear-gradient(135deg,#D4AF37,#0ABFBC)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 28 }}>🚘</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9' }}>{th ? 'ยืนยันโดยเจ้าของ' : 'Owner verified'}</div>
                <div style={{ color: '#CBD5E1', fontSize: 13 }}>{th ? 'บริการพรีเมียม' : 'Premium service'}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ height: 280, position: 'relative', borderRadius: 28, overflow: 'hidden', background: '#E5F0EF' }}>
                {cars[0]?.images?.[0] ? (
                  <Image src={cars[0].images[0]} alt={`${cars[0].brand} ${cars[0].model}`} fill style={{ objectFit: 'cover' }} priority unoptimized />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#CBD5E1', fontSize: 48 }}>🚗</div>
                )}
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#F1F5F9' }}>{th ? 'เจ้าของร้านบอก' : 'Owner says'}</div>
                <p style={{ color: '#CBD5E1', lineHeight: 1.8 }}>{th ? 'ให้บริการด้วยใจ ดูแลทุกรายละเอียด เพื่อให้ท่านเช่าแล้วปลอดใจจากจองจนส่งคืน' : 'We serve with care, checking every detail so you enjoy a worry-free ride from booking to return.'}}</p>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, padding: '16px 18px', borderRadius: 20, background: 'rgba(10,191,188,0.08)', border: '1px solid rgba(10,191,188,0.16)' }}>
                    <div>
                      <div style={{ fontSize: 13, color: '#0ABFBC', fontWeight: 700 }}>{th ? 'จองวันนี้' : 'Book today'}</div>
                      <div style={{ color: '#CBD5E1', fontSize: 14 }}>{th ? 'ลด 20%' : 'Save 20%'}</div>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg, #D4AF37, #0ABFBC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>20%</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, padding: '16px 18px', borderRadius: 20, background: 'rgba(10,191,188,0.08)', border: '1px solid rgba(10,191,188,0.16)' }}>
                    <div>
                      <div style={{ fontSize: 13, color: '#0ABFBC', fontWeight: 700 }}>{th ? 'จองล่วงหน้า' : 'Advance booking'}</div>
                      <div style={{ color: '#CBD5E1', fontSize: 14 }}>{th ? '7 วัน ลดทันที' : '7 days advance'}</div>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#0ABFBC' }}>✓</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '70px 5%', background: 'rgba(255,255,255,0.95)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'stretch' }}>
          <div style={{ display: 'grid', gap: 22 }}>
            <div className="card-glass" style={{ padding: 30 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0ABFBC', textTransform: 'uppercase', letterSpacing: 1 }}>🚗 {th ? 'รถเช่า' : 'Car details'}</div>
                  <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(28px,4vw,38px)', margin: 0, color: '#F1F5F9' }}>{th ? 'อ่านง่าย ครบทุกข้อมูล' : 'Easy to read, complete details'}</h2>
                </div>
                <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>{th ? 'โปรโมชั่น' : 'Special'}</div>
              </div>
              <div style={{ display: 'grid', gap: 12, color: '#CBD5E1', lineHeight: 1.8 }}>
                <p>{th ? 'ข้อมูลรถจัดเรียงให้ดูง่าย พร้อมสเปก งานออกแบบ และระบบช่วยเหลือการจองสำหรับคนที่อยากอ่านเยอะๆ.' : 'The car information is organized clearly with specs, design cues, and booking support for busy travelers.'}</p>
                <p>{th ? 'ทุกคันของเรามีพร้อมอุปกรณ์ความปลอดภัย แอร์เย็นสบาย และบริการเสริมที่คุณเลือกได้เอง.' : 'All cars include safety equipment, cool air conditioning, and optional add-on services to choose from.'}</p>
              </div>
            </div>

            <div className="card-glass" style={{ padding: 30 }}>
              <div style={{ display: 'grid', gap: 14 }}>
                {specs.map((item) => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '14px 18px', borderRadius: 18, background: '#f8fafc', color: '#111827' }}>
                    <span style={{ color: '#6b7280' }}>{item.label}</span>
                    <span style={{ fontWeight: 700 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 22 }}>
            <div className="card-glass" style={{ padding: 30 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0ABFBC', textTransform: 'uppercase', letterSpacing: 1 }}>✨ {th ? 'ฟีเจอร์และเงื่อนไข' : 'Features & perks'}</div>
                  <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(26px,4vw,34px)', margin: 0, color: '#F1F5F9' }}>{th ? 'จองได้สบายใจ' : 'Book with confidence'}</h2>
                </div>
                <div style={{ color: '#0ABFBC', fontWeight: 700 }}>{th ? 'ฟรีไม่มีเงื่อนไข' : 'No hidden terms'}</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {features.map((feature, index: number) => (
                  <span key={index} style={{ padding: '10px 14px', borderRadius: 16, background: feature.bc, color: '#0ABFBC', fontSize: 13, fontWeight: 600, border: `1px solid ${feature.c.replace('0.1', '0.16')}` }}>{feature.e} {feature.t}</span>
                ))}
              </div>
            </div>

            <div className="card-glass" style={{ padding: 30 }}>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9', marginBottom: 8 }}>{th ? 'โปรโมชันพิเศษ' : 'Special promotions'}</div>
                <p style={{ color: '#CBD5E1', lineHeight: 1.75 }}>{th ? 'จองวันนี้ รับส่วนลด 20% และจองล่วงหน้า 7 วัน รับส่วนลดทันที ไม่มีเงื่อนไขเลย.' : 'Book today for 20% off, or reserve 7 days early for an instant discount — no conditions.'}}</p>
              </div>
              <div style={{ display: 'grid', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '14px 16px', borderRadius: 16, background: '#f8fafc', border: '1px solid rgba(15,23,42,0.08)' }}>
                  <span style={{ color: '#6b7280' }}>{th ? 'พร้อมเดินทาง' : 'Ready to go'}</span>
                  <strong style={{ color: '#111827' }}>{th ? 'ทุกคัน' : 'All cars'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '14px 16px', borderRadius: 16, background: '#f8fafc', border: '1px solid rgba(15,23,42,0.08)' }}>
                  <span style={{ color: '#6b7280' }}>{th ? 'บริการเสริม' : 'Add-ons'}</span>
                  <strong style={{ color: '#111827' }}>{th ? 'ฟรี' : 'Free'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section style={{ padding: '70px 5%', background: 'linear-gradient(180deg, rgba(248,250,252,0.5) 0%, rgba(255,255,255,0.95) 100%)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0ABFBC', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>🔒 {th ? 'ความน่าเชื่อถือ' : 'Trustworthy'}</div>
            <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(36px,5vw,52px)', margin: 0, color: '#0F172A', marginBottom: 16 }}>{th ? 'เหตุผลที่คุณเลือกเรา' : 'Why you trust us'}</h2>
            <p style={{ fontSize: 16, color: '#475569', maxWidth: 720, margin: '0 auto' }}>{th ? 'เรามีประสบการณ์ 10+ ปี ให้บริการกับ 50,000+ ลูกค้า ไว้ใจ' : 'Over 10 years of experience serving 50,000+ happy customers'}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              { icon: '👥', title: th ? '50,000+' : '50K+', desc: th ? 'ลูกค้าพอใจ' : 'Happy customers' },
              { icon: '⭐', title: th ? '4.8/5' : '4.8/5', desc: th ? 'คะแนนเฉลี่ย' : 'Average rating' },
              { icon: '🛡️', title: th ? '100%' : '100%', desc: th ? 'ประกันครอบคลุม' : 'Insured cars' },
              { icon: '🔒', title: th ? '24/7' : '24/7', desc: th ? 'บริการลูกค้า' : 'Support team' },
            ].map((stat, i) => (
              <div key={i} style={{ padding: 32, borderRadius: 20, background: 'rgba(10,191,188,0.08)', border: '1px solid rgba(10,191,188,0.16)', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>{stat.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#D4AF37', fontFamily: '"Playfair Display",serif', marginBottom: 6 }}>{stat.title}</div>
                <div style={{ fontSize: 14, color: '#475569' }}>{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '70px 5%', background: 'rgba(255,255,255,0.6)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0ABFBC', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>💬 {th ? 'ความคิดเห็น' : 'Testimonials'}</div>
            <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(36px,5vw,52px)', margin: 0, color: '#0F172A', marginBottom: 16 }}>{th ? 'ลูกค้าพูดเกี่ยวกับเรา' : 'What customers say'}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              { avatar: '👨‍💼', name: th ? 'สมชาย' : 'Somchai', role: th ? 'นักธุรกิจ' : 'Business Owner', text: th ? 'ชอบเช่ารถที่นี่ ทุกครั้งจองเสร็จได้ในวินาที เจ้าของให้บริการอย่างมืออาชีพ' : 'Love renting here! Quick booking process, professional service every time.', rating: 5 },
              { avatar: '👩‍🎨', name: th ? 'สมหญิง' : 'Somying', role: th ? 'ออกแบบกราฟิก' : 'Graphic Designer', text: th ? 'ราคาสมควร ไม่มีค่าใช้จ่ายแอบแฝง รถสะอาด และรับ-ส่งตรงเวลา' : 'Fair pricing, no hidden fees, clean cars, and punctual pick-up/drop-off.', rating: 5 },
              { avatar: '👨‍👩‍👧', name: th ? 'สมพงษ์' : 'Sompong', role: th ? 'นักท่องเที่ยว' : 'Traveler', text: th ? 'จองผ่านแอพง่ายมาก บริการเสริมครบครัน ได้รับส่วนลดด้วย' : 'Easy app booking, complete add-ons, and got a nice discount!', rating: 5 },
            ].map((testimonial, i) => (
              <div key={i} style={{ padding: 28, borderRadius: 18, background: '#fff', border: '1px solid rgba(10,191,188,0.12)', boxShadow: '0 8px 24px rgba(10,191,188,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ fontSize: 40 }}>{testimonial.avatar}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{testimonial.name}</div>
                    <div style={{ fontSize: 13, color: '#64748B' }}>{testimonial.role}</div>
                  </div>
                </div>
                <div style={{ marginBottom: 12, display: 'flex', gap: 3 }}>
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <span key={j} style={{ fontSize: 16 }}>⭐</span>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8 }}>{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
