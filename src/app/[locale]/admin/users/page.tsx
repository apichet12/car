'use client'
import { useState, useEffect, useMemo } from 'react'
import { useLocale } from 'next-intl'
import { format, isValid } from 'date-fns'
import toast from 'react-hot-toast'
import { Users, Mail, Phone, Calendar, TrendingUp } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  phone: string | null
  avatar: string | null
  createdAt: string
  updatedAt: string
  _count: { bookings: number }
}

export default function AdminUsersPage() {
  const locale = useLocale()
  const th = locale === 'th'
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const formatDate = (value: string | null | undefined, pattern: string) => {
    const date = value ? new Date(value) : new Date('')
    return isValid(date) ? format(date, pattern) : '-'
  }

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(d => setUsers(d.users || [])).finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  const stats = useMemo(() => ({
    total: users.length,
    totalBookings: users.reduce((sum, u) => sum + (u._count?.bookings || 0), 0),
    avgBookingsPerUser: users.length > 0 ? Math.round(users.reduce((sum, u) => sum + (u._count?.bookings || 0), 0) / users.length * 10) / 10 : 0,
    activeUsers: users.filter(u => u._count?.bookings > 0).length
  }), [users])

  return (
    <div style={{ padding: '28px', maxWidth: 1400 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
          👥 {th ? 'จัดการผู้ใช้' : 'Manage Users'}
        </h1>
        <p style={{ color: '#CBD5E1', fontSize: 14 }}>
          {th ? 'ข้อมูลสมาชิกและประวัติการจอง' : 'Member information and booking history'} • {filtered.length} {th ? 'คน' : 'users'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { label: th ? 'สมาชิกทั้งหมด' : 'Total Users', value: stats.total, icon: Users, color: '#0ABFBC', bg: 'rgba(10,191,188,0.1)' },
          { label: th ? 'การจองทั้งหมด' : 'Total Bookings', value: stats.totalBookings, icon: TrendingUp, color: '#D4AF37', bg: 'rgba(212,175,55,0.1)' },
          { label: th ? 'สมาชิกที่ใช้งาน' : 'Active Users', value: stats.activeUsers, icon: Users, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
          { label: th ? 'เฉลี่ยต่อคน' : 'Avg per User', value: stats.avgBookingsPerUser, icon: TrendingUp, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card, #16162A)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={18} color={s.color} />
              </div>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{s.label}</div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{loading ? '...' : s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={th ? '🔍 ค้นหาชื่อหรืออีเมล...' : '🔍 Search name or email...'}
          style={{ flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '10px 16px', borderRadius: 12, fontFamily: 'Kanit, sans-serif', fontSize: 13, outline: 'none' }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setViewMode('grid')} style={{ padding: '8px 16px', borderRadius: 10, border: viewMode === 'grid' ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)', background: viewMode === 'grid' ? 'rgba(212,175,55,0.1)' : 'transparent', color: viewMode === 'grid' ? '#D4AF37' : '#94A3B8', cursor: 'pointer', fontFamily: 'Kanit, sans-serif', fontSize: 12, fontWeight: 600, transition: '.2s' }}>
            ⊞ {th ? 'การ์ด' : 'Grid'}
          </button>
          <button onClick={() => setViewMode('table')} style={{ padding: '8px 16px', borderRadius: 10, border: viewMode === 'table' ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)', background: viewMode === 'table' ? 'rgba(212,175,55,0.1)' : 'transparent', color: viewMode === 'table' ? '#D4AF37' : '#94A3B8', cursor: 'pointer', fontFamily: 'Kanit, sans-serif', fontSize: 12, fontWeight: 600, transition: '.2s' }}>
            ≡ {th ? 'ตาราง' : 'Table'}
          </button>
        </div>
      </div>

      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 28 }}>
          {loading ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#475569' }}>
              {th ? 'กำลังโหลด...' : 'Loading...'}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#475569' }}>
              {th ? 'ไม่พบผู้ใช้' : 'No users found'}
            </div>
          ) : (
            filtered.map(u => (
              <div key={u.id} onClick={() => setSelectedUser(u)} style={{ background: 'var(--card, #16162A)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20, cursor: 'pointer', transition: 'all .3s' }} onMouseEnter={(e) => (e.currentTarget as any).style.borderColor = 'rgba(212,175,55,0.3)'} onMouseLeave={(e) => (e.currentTarget as any).style.borderColor = 'rgba(255,255,255,0.06)'}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  {u.avatar ? <img src={u.avatar} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 16, border: '2px solid #D4AF37' }} /> : <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#0ABFBC)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 28, color: '#000', marginBottom: 16 }}>{u.name[0]}</div>}
                  <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{u.name}</h3>
                  <p style={{ color: '#CBD5E1', fontSize: 12, marginBottom: 16, wordBreak: 'break-all' }}>{u.email}</p>
                  <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    <div style={{ background: 'rgba(10,191,188,0.1)', borderRadius: 10, padding: 10 }}>
                      <div style={{ fontSize: 11, color: '#CBD5E1', marginBottom: 4 }}>{th ? 'การจอง' : 'Bookings'}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#0ABFBC' }}>{u._count?.bookings || 0}</div>
                    </div>
                    <div style={{ background: 'rgba(139,92,246,0.1)', borderRadius: 10, padding: 10 }}>
                      <div style={{ fontSize: 11, color: '#CBD5E1', marginBottom: 4 }}>{th ? 'เบอร์โทร' : 'Phone'}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#8B5CF6', wordBreak: 'break-all' }}>{u.phone ? u.phone.substring(0, 6) + '...' : '-'}</div>
                    </div>
                  </div>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#CBD5E1' }}>
                      <Calendar size={14} />
                      <span>{th ? 'เข้าเมื่อ' : 'Joined'}: {formatDate(u.createdAt, 'dd MMM yyyy')}</span>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedUser(u) }} style={{ width: '100%', marginTop: 12, padding: '10px 16px', background: 'linear-gradient(135deg,#D4AF37,#F5D45E)', color: '#000', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Kanit, sans-serif', fontSize: 12, fontWeight: 700, transition: '.2s' }}>
                    {th ? 'ดูรายละเอียด' : 'View Details'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {viewMode === 'table' && (
        <div style={{ background: 'var(--card, #16162A)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {[th ? 'ผู้ใช้' : 'User', th ? 'อีเมล' : 'Email', th ? 'เบอร์โทร' : 'Phone', th ? 'การจอง' : 'Bookings', th ? 'เข้าเมื่อ' : 'Joined', th ? 'จัดการ' : 'Action'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, background: 'rgba(255,255,255,0.02)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center', color: '#CBD5E1' }}>{th ? 'กำลังโหลด...' : 'Loading...'}</td></tr>
                  : filtered.length === 0 ? <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#CBD5E1' }}>{th ? 'ไม่พบผู้ใช้' : 'No users found'}</td></tr>
                  : filtered.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {u.avatar ? <img src={u.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 0 1px rgba(255,255,255,0.08)' }} /> : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#0ABFBC)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#000', flexShrink: 0 }}>{u.name[0]}</div>}
                          <div style={{ color: '#fff', fontWeight: 500, fontSize: 13 }}>{u.name}</div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#CBD5E1', fontSize: 12, maxWidth: 150, wordBreak: 'break-all' }}>{u.email}</td>
                      <td style={{ padding: '12px 16px', color: '#CBD5E1' }}>{u.phone || '-'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: 'rgba(10,191,188,0.1)', color: '#0ABFBC', padding: '4px 11px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>{u._count?.bookings || 0}</span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#CBD5E1', fontSize: 11 }}>{formatDate(u.createdAt, 'dd MMM yyyy')}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <button onClick={() => setSelectedUser(u)} style={{ background: 'linear-gradient(135deg,#D4AF37,#F5D45E)', color: '#000', border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontFamily: 'Kanit, sans-serif', fontSize: 11, fontWeight: 700 }}>
                          {th ? 'ดู' : 'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 600, background: 'rgba(15,23,42,0.98)', borderRadius: 24, boxShadow: '0 24px 80px rgba(0,0,0,0.45)', padding: 28, position: 'relative' }}>
            <button onClick={() => setSelectedUser(null)} style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '.2s' }} onMouseEnter={(e) => (e.currentTarget as any).style.background = 'rgba(255,255,255,0.15)'}>✕</button>
            
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              {selectedUser.avatar ? <img src={selectedUser.avatar} alt="" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 20px', border: '3px solid #D4AF37' }} /> : <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#0ABFBC)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 42, color: '#000', margin: '0 auto 20px' }}>{selectedUser.name[0]}</div>}
              <h2 style={{ color: '#F1F5F9', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{selectedUser.name}</h2>
              <p style={{ color: '#CBD5E1', fontSize: 14 }}>{selectedUser.email}</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Mail size={14} color="#CBD5E1" />
                  <div style={{ color: '#94A3B8', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{th ? 'อีเมล' : 'Email'}</div>
                </div>
                <div style={{ color: '#F1F5F9', fontSize: 13, wordBreak: 'break-all' }}>{selectedUser.email}</div>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Phone size={14} color="#CBD5E1" />
                  <div style={{ color: '#94A3B8', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{th ? 'เบอร์โทร' : 'Phone'}</div>
                </div>
                <div style={{ color: '#fff', fontSize: 13 }}>{selectedUser.phone || '-'}</div>
              </div>

              <div style={{ background: 'rgba(10,191,188,0.05)', borderRadius: 14, padding: 16, border: '1px solid rgba(10,191,188,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <TrendingUp size={14} color="#0ABFBC" />
                  <div style={{ color: '#0ABFBC', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{th ? 'การจองทั้งหมด' : 'Total Bookings'}</div>
                </div>
                <div style={{ color: '#0ABFBC', fontSize: 18, fontWeight: 700 }}>{selectedUser._count.bookings || 0}</div>
              </div>

              <div style={{ background: 'rgba(139,92,246,0.05)', borderRadius: 14, padding: 16, border: '1px solid rgba(139,92,246,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Calendar size={14} color="#8B5CF6" />
                  <div style={{ color: '#8B5CF6', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{th ? 'เข้าเมื่อ' : 'Joined'}</div>
                </div>
                <div style={{ color: '#8B5CF6', fontSize: 12, fontWeight: 600 }}>{formatDate(selectedUser.createdAt, 'dd MMM yyyy')}</div>
              </div>

              <div style={{ background: 'rgba(212,175,55,0.05)', borderRadius: 14, padding: 16, border: '1px solid rgba(212,175,55,0.2)' }}>
                <div style={{ color: '#D4AF37', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{th ? 'วันที่อัปเดต' : 'Last Updated'}</div>
                <div style={{ color: '#D4AF37', fontSize: 12, fontWeight: 600 }}>{formatDate(selectedUser.updatedAt, 'dd MMM yyyy')}</div>
              </div>

              <div style={{ background: 'rgba(16,185,129,0.05)', borderRadius: 14, padding: 16, border: '1px solid rgba(16,185,129,0.2)' }}>
                <div style={{ color: '#10B981', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{th ? 'ID ผู้ใช้' : 'User ID'}</div>
                <div style={{ color: '#10B981', fontSize: 11, fontWeight: 700, fontFamily: 'monospace', wordBreak: 'break-all' }}>{selectedUser.id}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 14, marginBottom: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, fontSize: 12 }}>
                <span style={{ color: '#94A3B8', fontWeight: 600 }}>{th ? 'สมาชิกมา' : 'Member for'}:</span>
                <span style={{ color: '#CBD5E1' }}>
                  {Math.floor((new Date().getTime() - new Date(selectedUser.createdAt).getTime()) / (1000 * 60 * 60 * 24))} {th ? 'วัน' : 'days'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedUser(null)} style={{ padding: '10px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', cursor: 'pointer', fontFamily: 'Kanit, sans-serif', fontSize: 13, fontWeight: 600, transition: '.2s' }} onMouseEnter={(e) => (e.currentTarget as any).style.background = 'rgba(255,255,255,0.05)'}>
                {th ? 'ปิด' : 'Close'}
              </button>
              <button onClick={() => {
                navigator.clipboard.writeText(JSON.stringify({
                  id: selectedUser.id,
                  name: selectedUser.name,
                  email: selectedUser.email,
                  phone: selectedUser.phone,
                  bookings: selectedUser._count.bookings,
                  joined: formatDate(selectedUser.createdAt, 'dd MMM yyyy')
                }, null, 2))
                toast.success(th ? 'คัดลอกแล้ว' : 'Copied!')
              }} style={{ padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(135deg,#D4AF37,#F5D45E)', color: '#000', border: 'none', cursor: 'pointer', fontFamily: 'Kanit, sans-serif', fontSize: 13, fontWeight: 700, transition: '.2s' }}>
                {th ? '📋 คัดลอก' : '📋 Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
