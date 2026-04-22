'use client'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Car, Wrench, Phone, User, MessageSquare } from 'lucide-react'

interface BottomNavProps {
  user?: { name: string; role: string } | null
}

export default function BottomNav({ user }: BottomNavProps) {
  const locale = useLocale()
  const pathname = usePathname()
  const th = locale === 'th'

  const isActive = (href: string) => {
    const basePath = `/${locale}${href}`
    return pathname === basePath || pathname.startsWith(basePath + '/')
  }

  const navItems = [
    { href: '/', label: th ? 'หน้าแรก' : 'Home', icon: Home },
    { href: '/cars', label: th ? 'รถเช่า' : 'Cars', icon: Car },
    { href: '/services', label: th ? 'บริการ' : 'Services', icon: Wrench },
    { href: '/contact', label: th ? 'ติดต่อ' : 'Contact', icon: Phone },
    { href: '/profile', label: th ? 'ฉัน' : 'Me', icon: User },
  ]

  return (
    <>
      {/* Spacer for bottom nav */}
      <div style={{ height: 80 }} className="md:hidden" />

      {/* Bottom Navigation */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0"
        style={{
          zIndex: 50,
          background: 'linear-gradient(180deg, rgba(10,10,15,0.8) 0%, rgba(10,10,15,0.95) 100%)',
          backdropFilter: 'blur(30px)',
          borderTop: '1px solid rgba(212,175,55,0.15)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '8px 0 12px',
          height: 76,
          WebkitBackdropFilter: 'blur(30px)',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                padding: '8px 10px',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                color: active ? '#D4AF37' : '#94A3B8',
                background: active
                  ? 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(10,191,188,0.1))'
                  : 'transparent',
                flex: '1 1 auto',
                maxWidth: '80px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: active
                    ? 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(10,191,188,0.2))'
                    : 'rgba(255,255,255,0.03)',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <Icon
                  size={18}
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    filter: active ? 'drop-shadow(0 0 6px rgba(212,175,55,0.4))' : 'none',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: active ? 700 : 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  transition: 'all 0.3s',
                  letterSpacing: active ? '0.3px' : '0px',
                }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
