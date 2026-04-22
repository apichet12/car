'use client'
import { ReactNode, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import NavbarWrapper from '@/components/layout/NavbarWrapper'
import Footer from '@/components/layout/Footer'
import ChatBot from '@/components/chat/ChatBot'
import { Home, Car, Calendar, User, LogOut, MessageCircle, Menu, X } from 'lucide-react'

interface LayoutMobileWrapperProps {
  children: ReactNode
  locale: string
  user?: { name: string; role: string } | null
}

export default function LayoutMobileWrapper({ children, locale, user }: LayoutMobileWrapperProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const th = locale === 'th'

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Desktop Layout
  if (!isMobile) {
    return (
      <>
        <div className="bg-mesh" />
        <div className="bg-grid" />
        <NavbarWrapper user={user} />
        <main className="flex-1 relative z-10" style={{ paddingTop: 60, paddingBottom: 80 }}>
          {children}
        </main>
        <Footer />
        <ChatBot />
      </>
    )
  }

  // Mobile Layout
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
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(10,191,188,0.05))',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #D4AF37, #0ABFBC)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 700,
            color: '#000'
          }}>
            🚗
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#D4AF37', fontFamily: 'Kanit' }}>CATTY</span>
        </div>
        <MessageCircle size={22} style={{ color: '#D4AF37', cursor: 'pointer' }} />
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
        background: 'linear-gradient(180deg, rgba(18,18,26,0.95), rgba(18,18,26,0.98))',
        borderTop: '2px solid rgba(212,175,55,0.2)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 76,
        zIndex: 101,
        backdropFilter: 'blur(20px)'
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
                transition: 'all 0.3s ease',
                padding: '8px',
                borderRadius: '8px',
                marginX: '4px'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 10,
                background: active ? 'rgba(212,175,55,0.15)' : 'transparent',
                transition: 'all 0.3s ease'
              }}>
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              </div>
              <span style={{ fontSize: 10, marginTop: 2 }}>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
