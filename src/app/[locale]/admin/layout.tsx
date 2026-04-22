import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/jwt'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { LayoutDashboard, Car, BookOpen, Users, TrendingUp, Settings, LogOut, ArrowLeft } from 'lucide-react'

export default async function AdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value
  const payload = token ? verifyToken(token) : null

  if (!payload || payload.role !== 'ADMIN') {
    redirect(`/${locale}/auth/login`)
  }

  const pendingCount = await prisma.booking.count({ where: { status: 'PENDING' } })

  if (!payload || payload.role !== 'ADMIN') {
    redirect(`/${locale}/auth/login`)
  }

  const navItems = [
    { href: `/${locale}/admin`, label: locale === 'th' ? 'แดชบอร์ด' : 'Dashboard', icon: LayoutDashboard },
    { href: `/${locale}/admin/cars`, label: locale === 'th' ? 'จัดการรถ' : 'Manage Cars', icon: Car },
    { href: `/${locale}/admin/bookings`, label: locale === 'th' ? 'การจอง' : 'Bookings', icon: BookOpen, badgeCount: pendingCount },
    { href: `/${locale}/admin/users`, label: locale === 'th' ? 'ผู้ใช้งาน' : 'Users', icon: Users },
    { href: `/${locale}/admin/reports`, label: locale === 'th' ? 'รายงาน' : 'Reports', icon: TrendingUp },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0, background: 'var(--dark2, #12121A)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 70, height: 'calc(100vh - 70px)',
      }}>
        {/* Admin badge */}
        <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#0ABFBC)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#000', flexShrink: 0 }}>
            {payload.name?.[0] || 'A'}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{payload.name?.split(' ')[0] || 'Admin'}</div>
            <div style={{ fontSize: 10, color: '#D4AF37', fontWeight: 500 }}>👑 Super Admin</div>
          </div>
        </div>

        <nav style={{ padding: '8px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 2, padding: '10px 10px 6px' }}>
            {locale === 'th' ? 'เมนูหลัก' : 'MAIN MENU'}
          </div>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', margin: '1px 0', borderRadius: 10,
              color: '#94A3B8', fontSize: 13, fontWeight: 400,
              textDecoration: 'none', transition: 'all .2s', fontFamily: 'Kanit, sans-serif',
              position: 'relative',
            }}>
              <item.icon size={15} style={{ flexShrink: 0 }} />
              <span>{item.label}</span>
              {(item as any).badgeCount !== undefined && (
                <span style={{ marginLeft: 'auto', background: '#FF6B9D', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px 1px', borderRadius: 10 }}>
                  {(item as any).badgeCount || 0}
                </span>
              )}
            </Link>
          ))}

          <div style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 2, padding: '14px 10px 6px', marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            {locale === 'th' ? 'ตั้งค่า' : 'SETTINGS'}
          </div>
          <Link href={`/${locale}/admin/settings`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, color: '#94A3B8', fontSize: 13, textDecoration: 'none', fontFamily: 'Kanit, sans-serif' }}>
            <Settings size={15} />
            <span>{locale === 'th' ? 'ตั้งค่าระบบ' : 'Settings'}</span>
          </Link>
        </nav>

        <div style={{ padding: '10px 8px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <Link href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', borderRadius: 10, color: '#94A3B8', fontSize: 12, textDecoration: 'none', transition: '.2s' }}>
            <ArrowLeft size={14} />
            {locale === 'th' ? 'กลับหน้าเว็บ' : 'Back to Site'}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowX: 'hidden', minHeight: '100%' }}>{children}</main>
    </div>
  )
}
