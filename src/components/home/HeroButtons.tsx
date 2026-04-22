'use client'
import Link from 'next/link'

interface HeroButtonsProps {
  locale: string
  th: boolean
}

export default function HeroButtons({ locale, th }: HeroButtonsProps) {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Link 
        href={`/${locale}/cars`} 
        style={{ 
          background: 'linear-gradient(135deg, #D4AF37, #0ABFBC)', 
          color: '#fff', 
          fontWeight: 700, 
          padding: '16px 32px', 
          borderRadius: 16, 
          fontSize: 16, 
          textDecoration: 'none', 
          transition: '.3s', 
          fontFamily: 'Kanit', 
          boxShadow: '0 12px 32px rgba(10,191,188,0.24)', 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: 8,
          cursor: 'pointer'
        }} 
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'} 
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        🚗 {th ? 'เรียกดูรถทั้งหมด' : 'Browse All Cars'}
      </Link>
      <Link 
        href={`/${locale}/services`} 
        style={{ 
          background: 'rgba(255,255,255,0.95)', 
          border: '2px solid rgba(10,191,188,0.22)', 
          color: '#0ABFBC', 
          fontWeight: 700, 
          padding: '14px 30px', 
          borderRadius: 16, 
          fontSize: 16, 
          textDecoration: 'none', 
          transition: '.3s', 
          fontFamily: 'Kanit', 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: 8,
          cursor: 'pointer'
        }} 
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,250,252,0.98)'} 
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.95)'}
      >
        ✨ {th ? 'บริการเสริม' : 'Add-ons'}
      </Link>
    </div>
  )
}
