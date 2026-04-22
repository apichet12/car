'use client'
import Link from 'next/link'
import { useState } from 'react'

interface HeroButtonsProps {
  locale: string
  th: boolean
}

export default function HeroButtons({ locale, th }: HeroButtonsProps) {
  const [hoveredCars, setHoveredCars] = useState(false)
  const [hoveredAddOns, setHoveredAddOns] = useState(false)

  return (
    <div style={{ 
      display: 'flex', 
      gap: 12, 
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      <Link 
        href={`/${locale}/cars`} 
        style={{ 
          background: hoveredCars 
            ? 'linear-gradient(135deg, #F5D45E, #14C1B8)' 
            : 'linear-gradient(135deg, #D4AF37, #0ABFBC)',
          color: '#000',
          fontWeight: 700, 
          padding: '14px 28px', 
          borderRadius: '14px', 
          fontSize: '15px', 
          textDecoration: 'none', 
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', 
          fontFamily: 'Kanit', 
          boxShadow: hoveredCars 
            ? '0 16px 40px rgba(10,191,188,0.35)' 
            : '0 12px 32px rgba(10,191,188,0.24)',
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: 8,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '44px'
        }}
        onMouseEnter={() => setHoveredCars(true)}
        onMouseLeave={() => setHoveredCars(false)}
      >
        <span style={{ 
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          display: 'inline-block',
          transform: hoveredCars ? 'scale(1.2)' : 'scale(1)'
        }}>
          🚗
        </span>
        {th ? 'เรียกดูรถ' : 'Browse Cars'}
      </Link>

      <Link 
        href={`/${locale}/services`} 
        style={{ 
          background: hoveredAddOns
            ? 'linear-gradient(135deg, rgba(248,250,252,1), rgba(241,245,249,1))'
            : 'rgba(255,255,255,0.95)',
          border: '2px solid rgba(10,191,188,0.3)',
          color: hoveredAddOns ? '#0ABFBC' : '#0ABFBC',
          fontWeight: 700, 
          padding: '12px 24px', 
          borderRadius: '14px', 
          fontSize: '15px', 
          textDecoration: 'none', 
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          fontFamily: 'Kanit', 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: 8,
          cursor: 'pointer',
          minHeight: '44px',
          boxShadow: hoveredAddOns
            ? '0 8px 24px rgba(10,191,188,0.2)'
            : 'none'
        }}
        onMouseEnter={() => setHoveredAddOns(true)}
        onMouseLeave={() => setHoveredAddOns(false)}
      >
        <span style={{ 
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          display: 'inline-block',
          transform: hoveredAddOns ? 'scale(1.2)' : 'scale(1)'
        }}>
          ✨
        </span>
        {th ? 'บริการ' : 'Services'}
      </Link>
    </div>
  )
}
