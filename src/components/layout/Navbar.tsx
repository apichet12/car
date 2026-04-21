'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, Shield, User, LogOut, Car, Home, Wrench, Phone } from 'lucide-react'

interface NavbarProps {
  user?: { name: string; role: string } | null
  logoUrl?: string
}

export default function Navbar({ user, logoUrl }: NavbarProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const switchLocale = (l: string) => {
    const p = pathname.replace(`/${locale}`, '') || '/'
    document.cookie = `NEXT_LOCALE=${l};path=/;max-age=31536000`
    router.push(`/${l}${p}`)
    router.refresh()
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push(`/${locale}/auth/login`)
    router.refresh()
    setMenuOpen(false)
  }

  const th = locale === 'th'

  const links = [
    { href: `/${locale}`, label: th ? 'หน้าแรก' : 'Home', icon: <Home size={14} /> },
    { href: `/${locale}/cars`, label: th ? 'รถเช่า' : 'Cars', icon: <Car size={14} /> },
    { href: `/${locale}/services`, label: th ? 'บริการ' : 'Services', icon: <Wrench size={14} /> },
    { href: `/${locale}/contact`, label: th ? 'ติดต่อ' : 'Contact', icon: <Phone size={14} /> },
  ]

  const navBg = scrolled ? 'rgba(10,10,15,0.98)' : 'rgba(10,10,15,0.88)'

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 68, background: navBg, backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,175,55,0.12)', display: 'flex', alignItems: 'center', padding: '0 5%', transition: 'background .3s' }}>
      {/* Logo */}
      <Link href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 'auto' }}>
        {logoUrl ? (
          <Image 
            src={logoUrl} 
            alt="Logo" 
            width={40} 
            height={40} 
            style={{ borderRadius: 12, objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#D4AF37,#0ABFBC)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 4px 12px rgba(212,175,55,0.3)', flexShrink: 0 }}>🐱</div>
        )}
        <span style={{ fontFamily: '"Playfair Display",serif', fontSize: 17, fontWeight: 700, background: 'linear-gradient(135deg,#D4AF37,#0ABFBC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', whiteSpace: 'nowrap' }}>
          {th ? 'แคตตี้คาร์' : 'CATTY CAR'}
        </span>
      </Link>

      {/* Desktop links */}
      <div style={{ display: 'flex', gap: 28, alignItems: 'center', marginRight: 28 }} className="hidden md:flex">
        {links.map(l => (
          <Link key={l.href} href={l.href} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#E2E8F0', fontSize: 13, textDecoration: 'none', transition: '.2s' }}>
            {l.icon}{l.label}
          </Link>
        ))}
        {user?.role === 'ADMIN' && (
          <Link href={`/${locale}/admin`} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#D4AF37', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            <Shield size={14} />{th ? 'แอดมิน' : 'Admin'}
          </Link>
        )}
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Lang */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 3, gap: 2 }}>
          {['th', 'en'].map(l => (
            <button key={l} onClick={() => switchLocale(l)} style={{ padding: '4px 10px', borderRadius: 14, border: 'none', cursor: 'pointer', fontFamily: 'Kanit', fontSize: 11, fontWeight: 700, transition: '.2s', background: locale === l ? 'linear-gradient(135deg,#D4AF37,#F5D45E)' : 'transparent', color: locale === l ? '#000' : '#94A3B8' }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Auth */}
        {user ? (
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 8 }}>
            <Link href={`/${locale}/profile`} className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 no-underline text-sm transition-colors duration-200">
              <User size={15} />{user.name.split(' ')[0]}
            </Link>
            <button onClick={logout} className="bg-transparent border border-red-500/20 text-slate-300 hover:text-red-400 hover:border-red-400/40 px-2.5 py-1 rounded-md cursor-pointer text-xs transition-all duration-200 flex items-center gap-1">
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 8 }}>
            <Link href={`/${locale}/auth/login`} className="nav-link" style={{ fontSize: 13, color: '#E2E8F0' }}>{th ? 'เข้าสู่ระบบ' : 'Login'}</Link>
            <Link href={`/${locale}/auth/register`} className="btn-gold" style={{ padding: '7px 16px', fontSize: 12, borderRadius: 20, textDecoration: 'none' }}>{th ? 'สมัคร' : 'Register'}</Link>
          </div>
        )}

        {/* Hamburger */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: 'absolute', top: 68, left: 0, right: 0, background: 'rgba(10,10,15,0.98)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,175,55,0.1)', padding: '12px 5%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {links.map(l => <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{ padding: '10px 4px', color: '#E2E8F0', textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>{l.icon}{l.label}</Link>)}
          {user?.role === 'ADMIN' && <Link href={`/${locale}/admin`} onClick={() => setMenuOpen(false)} style={{ padding: '10px 4px', color: '#D4AF37', textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}><Shield size={14} />{th ? 'แอดมิน' : 'Admin'}</Link>}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, marginTop: 4, display: 'flex', gap: 12 }}>
            {user ? (<>
              <Link href={`/${locale}/profile`} onClick={() => setMenuOpen(false)} style={{ color: '#E2E8F0', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}><User size={13} />{th ? 'โปรไฟล์' : 'Profile'}</Link>
              <button onClick={logout} style={{ background: 'transparent', border: 'none', color: '#F87171', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><LogOut size={13} />{th ? 'ออก' : 'Logout'}</button>
            </>) : (<>
              <Link href={`/${locale}/auth/login`} onClick={() => setMenuOpen(false)} style={{ color: '#E2E8F0', textDecoration: 'none', fontSize: 13 }}>{th ? 'เข้าสู่ระบบ' : 'Login'}</Link>
              <Link href={`/${locale}/auth/register`} onClick={() => setMenuOpen(false)} style={{ color: '#D4AF37', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>{th ? 'สมัคร' : 'Register'}</Link>
            </>)}
          </div>
        </div>
      )}
    </nav>
  )
}
