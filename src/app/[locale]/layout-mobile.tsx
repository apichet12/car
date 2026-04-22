'use client'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Home, Car, Calendar, User, Settings, MessageCircle, Heart } from 'lucide-react'

interface LayoutMobileProps {
  children: ReactNode
  params: { locale: string }
}

export default function LayoutMobile({ children, params: { locale } }: LayoutMobileProps) {
  const pathname = usePathname()
  const th = locale === 'th'

  const navItems = [
    { href: `/${locale}`, icon: Home, label: th ? 'หน้าแรก' : 'Home' },
    { href: `/${locale}/cars`, icon: Car, label: th ? 'รถ' : 'Cars' },
    { href: `/${locale}/booking`, icon: Calendar, label: th ? 'จอง' : 'Book' },
    { href: `/${locale}/profile`, icon: User, label: th ? 'ฉัน' : 'Profile' },
  ]

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg, #0B0B14)' }}>
      {/* Header - Mobile Only */}
      <header style={{
        background: 'var(--dark2, #12121A)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Image src="/logo.png" alt="Catty" width={32} height={32} style={{ borderRadius: 8 }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#D4AF37', fontFamily: 'Kanit' }}>CATTY</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{
            background: 'none',
            border: 'none',
            color: '#CBD5E1',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MessageCircle size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        paddingBottom: 80,
        WebkitOverflowScrolling: 'touch'
      }}>
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--dark2, #12121A)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 70,
        zIndex: 101,
        boxShadow: '0 -4px 12px rgba(0,0,0,0.3)'
      }}>
        {navItems.map(item => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                textDecoration: 'none',
                color: active ? '#D4AF37' : '#94A3B8',
                fontSize: 11,
                fontFamily: 'Kanit',
                fontWeight: active ? 600 : 400,
                transition: 'all 0.2s',
                padding: '8px',
              }}
            >
              <Icon size={24} strokeWidth={active ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
