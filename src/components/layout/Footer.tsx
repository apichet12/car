'use client'
import { useLocale } from 'next-intl'
import Link from 'next/link'

export default function Footer() {
  const locale = useLocale()

  return (
    <footer style={{
      background: '#2D3D4A',
      borderTop: '1px solid rgba(212,175,55,0.1)',
      padding: '0',
      position: 'relative',
      zIndex: 1,
    }}>
      {/* Top line accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, #D4AF37, #0ABFBC)',
      }} />

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 40,
        padding: '60px 5%',
        maxWidth: 1400,
        margin: '0 auto',
      }}>
        {/* Brand & Company Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 45, height: 45, borderRadius: 8,
              background: 'linear-gradient(135deg, #D4AF37, #0ABFBC)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              fontWeight: 700, color: '#fff',
            }}>🐱</div>
            <div>
              <div style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 18,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #D4AF37, #0ABFBC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
                lineHeight: 1.2,
              }}>CATTY CAR RENTAL</div>
              <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                {locale === 'th' ? 'บริษัท แคตตี้ จำกัด' : 'Catty Co., Ltd'}
              </div>
            </div>
          </div>

          {/* Address */}
          <div style={{ fontSize: 13, color: '#D1D5DB', lineHeight: 1.8, marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              📍 {locale === 'th' ? 'ที่อยู่' : 'Address'}
            </div>
            <div style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.6 }}>
              {locale === 'th'
                ? '193-195 สำนักงานเลควราชดา\nถนนรัชดาภิเษก เขตคลองเตย\nกรุงเทพมหานคร'
                : '193-195 Lake Rajada Office Complex\nRatchadapisek Road, Khlong Toei\nBangkok, Thailand'}
            </div>
          </div>

          {/* Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#D1D5DB', fontSize: 12 }}>
              <span>📞</span>
              <span>02-038-5222</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#D1D5DB', fontSize: 12 }}>
              <span>💚</span>
              <span>@cattycar</span>
            </div>
          </div>

          {/* Verified Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: 6,
            fontSize: 11,
            color: '#D4AF37',
            fontWeight: 600,
          }}>
            ✓ {locale === 'th' ? 'ยืนยันแล้ว' : 'Verified'}
          </div>

          {/* Social Icons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            {[
              { icon: '💚', name: 'LINE' },
              { icon: '👍', name: 'Facebook' },
              { icon: '📸', name: 'Instagram' }
            ].map(s => (
              <a
                key={s.name}
                href="#"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Services Column */}
        <div>
          <h4 style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 16,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
          }}>
            {locale === 'th' ? 'เกี่ยวกับ Catty' : 'About Catty'}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { href: `/${locale}/cars`, label: locale === 'th' ? 'รถเช่าทั้งหมด' : 'All Cars' },
              { href: `/${locale}/services`, label: locale === 'th' ? 'บริการของเรา' : 'Our Services' },
              { href: `/${locale}/booking`, label: locale === 'th' ? 'วิธีการจอง' : 'How to Book' },
            ].map(l => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  style={{
                    color: '#9CA3AF',
                    textDecoration: 'none',
                    fontSize: 13,
                    fontWeight: 400,
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h4 style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 16,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
          }}>
            {locale === 'th' ? 'บริการสนับสนุน' : 'Support'}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { href: `/${locale}/faq`, label: locale === 'th' ? 'คำถามที่พบบ่อย' : 'FAQ' },
              { href: `/${locale}/contact`, label: locale === 'th' ? 'ติดต่อเรา' : 'Contact Us' },
              { href: `/${locale}/profile`, label: locale === 'th' ? 'บัญชีของฉัน' : 'My Account' },
            ].map(l => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  style={{
                    color: '#9CA3AF',
                    textDecoration: 'none',
                    fontSize: 13,
                    fontWeight: 400,
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h4 style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 16,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
          }}>
            {locale === 'th' ? 'ข้อมูลทางการ' : 'Legal'}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { href: `/${locale}/privacy`, label: locale === 'th' ? 'นโยบายความเป็นส่วนตัว' : 'Privacy Policy' },
              { href: `/${locale}/terms`, label: locale === 'th' ? 'เงื่อนไขการใช้บริการ' : 'Terms of Service' },
              { href: `/${locale}/`, label: locale === 'th' ? 'สัญญาลูกเช่า' : 'Rental Agreement' },
            ].map(l => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  style={{
                    color: '#9CA3AF',
                    textDecoration: 'none',
                    fontSize: 13,
                    fontWeight: 400,
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Download Apps */}
        <div>
          <h4 style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 16,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
          }}>
            {locale === 'th' ? 'ดาวน์โหลดแอป' : 'Download App'}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a
              href="#"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 6,
                textDecoration: 'none',
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              🍎 App Store
            </a>
            <a
              href="#"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 6,
                textDecoration: 'none',
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              🎮 Google Play
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '24px 5%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          maxWidth: 1400,
          margin: '0 auto',
        }}>
          <div style={{ color: '#6B7280', fontSize: 12, fontWeight: 400 }}>
            © 2026 Catty Car Rental Co., Ltd. {locale === 'th' ? 'สงวนสิทธิ์ทั้งหมด' : 'All rights reserved'}
          </div>
          <div style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ width: 20, height: 20, background: 'rgba(212, 175, 55, 0.2)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#D4AF37' }}>✓</span>
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                {locale === 'th' ? 'ปลอดภัยและเชื่อถือได้' : 'Safe & Trusted'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ width: 20, height: 20, background: 'rgba(212, 175, 55, 0.2)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#D4AF37' }}>🔒</span>
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                {locale === 'th' ? 'เข้ารหัสแบบ SSL' : 'SSL Encrypted'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
