'use client'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, Home } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function SuccessPage() {
  const locale = useLocale()
  const th = locale === 'th'
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('id') || 'N/A'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #f8fbff 0%, #ffffff 50%, #f0f9ff 100%)', padding: '20px' }}>
      <div style={{ maxWidth: 600, textAlign: 'center' }}>
        {/* Success Icon */}
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: 120, height: 120, 
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #D4AF37, #0ABFBC)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 24px 60px rgba(10,191,188,0.24)',
            animation: 'pulse-scale 0.6s ease-out'
          }}>
            <CheckCircle2 size={64} color="#fff" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 42, fontWeight: 900, color: '#0F172A', marginBottom: 12, lineHeight: 1.2 }}>
          {th ? '🎉 จองรถสำเร็จแล้ว!' : '🎉 Booking Confirmed!'}
        </h1>

        {/* Subtext */}
        <p style={{ fontSize: 16, color: '#64748B', marginBottom: 32, lineHeight: 1.8 }}>
          {th 
            ? 'ขอบคุณที่ไว้วางใจเรา การจองของคุณได้รับการบันทึก กรุณารอการยืนยันจากทีมงานของเรา'
            : 'Thank you for booking with us! Your reservation has been recorded. Our team will confirm shortly.'}
        </p>

        {/* Booking Details Card */}
        <div style={{
          background: 'rgba(255,255,255,0.92)',
          border: '1px solid rgba(10,191,188,0.18)',
          borderRadius: 24,
          padding: 32,
          marginBottom: 32,
          boxShadow: '0 16px 40px rgba(10,191,188,0.08)'
        }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
              {th ? 'รหัสการจอง' : 'Booking ID'}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#D4AF37', fontFamily: '"Playfair Display",serif' }}>
              #{bookingId}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(10,191,188,0.12)', paddingTop: 20 }}>
            <div style={{ fontSize: 14, color: '#64748B', marginBottom: 12, lineHeight: 1.8 }}>
              {th
                ? 'ตรวจสอบสถานะการจองและรายละเอียดได้ที่หน้าโปรไฟล์ของคุณ เราจะส่ง SMS และอีเมลยืนยันในไม่ช้า'
                : 'Check your booking status and details in your profile. We'll send SMS and email confirmation shortly.'}
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <Link href={`/${locale}/profile`} style={{
            display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: 10,
            background: 'linear-gradient(135deg, #D4AF37, #0ABFBC)',
            color: '#fff', fontWeight: 700, padding: '16px 24px', borderRadius: 16,
            fontSize: 15, textDecoration: 'none', transition: '.3s',
            fontFamily: 'Kanit', boxShadow: '0 12px 32px rgba(10,191,188,0.24)'
          }} onMouseEnter={e => {e.currentTarget.style.transform = 'translateY(-3px)'}} onMouseLeave={e => {e.currentTarget.style.transform = 'translateY(0)'}}>
            {th ? 'ดูการจอง' : 'View Booking'}
            <ArrowRight size={16} />
          </Link>
          <Link href={`/${locale}`} style={{
            display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.9)',
            color: '#0ABFBC', fontWeight: 700, padding: '16px 24px', borderRadius: 16,
            fontSize: 15, textDecoration: 'none', transition: '.3s',
            fontFamily: 'Kanit', border: '2px solid rgba(10,191,188,0.22)',
          }} onMouseEnter={e => {e.currentTarget.style.background = 'rgba(248,250,252,1)'}} onMouseLeave={e => {e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}}>
            <Home size={16} />
            {th ? 'กลับหน้าแรก' : 'Go Home'}
          </Link>
        </div>

        {/* Trust Section */}
        <div style={{
          background: 'rgba(10,191,188,0.08)',
          border: '1px solid rgba(10,191,188,0.18)',
          borderRadius: 18,
          padding: 24,
          marginBottom: 24
        }}>
          <div style={{ fontSize: 13, color: '#0ABFBC', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            🔒 {th ? 'ข้อมูลของคุณปลอดภัย' : 'Your Info is Secure'}
          </div>
          <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7 }}>
            {th
              ? 'ข้อมูลการจองของคุณเข้ารหัส ไม่แชร์ให้บุคคลที่สาม ปลอดภัย 100%'
              : 'Your booking data is encrypted, never shared, and 100% secure.'}
          </p>
        </div>

        {/* Contact Info */}
        <div style={{
          background: 'rgba(255,255,255,0.5)',
          borderRadius: 16,
          padding: 20
        }}>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>
            {th ? 'ต้องการความช่วยเหลือ?' : 'Need Help?'}
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: '📞', text: '081-234-5678' },
              { icon: '💚', text: 'LINE @cattycar' },
              { icon: '📧', text: 'contact@cattycar.com' }
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#0ABFBC', fontWeight: 600 }}>
                <span>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-scale {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
