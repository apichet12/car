'use client'
import { useState, useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { format, isValid } from 'date-fns'
import { User, Settings, History, Camera, Save, Lock, Phone, MapPin, MessageSquare, LogOut } from 'lucide-react'

interface UserProfile {
  id: string; name: string; email: string; phone: string | null
  avatar: string | null; bio: string | null; lineId: string | null
  address: string | null; role: string; facebook: string | null; createdAt: string
  _count?: { bookings: number; serviceOrders: number }
}
interface Booking {
  id: string; status: string; totalPrice: number; totalDays: number
  pickupDate: string; returnDate: string; slipImage: string | null
  car: { brand: string; model: string; images: string[] }
  addons: { id: string; name: string; price: number; type: string }[]
  createdAt: string
}

const STATUS_MAP: Record<string, [string, string, string]> = {
  PENDING: ['รอการอนุมัติ', 'Pending', 'rgba(245,158,11,0.15)'],
  APPROVED: ['อนุมัติแล้ว', 'Approved', 'rgba(16,185,129,0.15)'],
  REJECTED: ['ถูกปฏิเสธ', 'Rejected', 'rgba(239,68,68,0.15)'],
  COMPLETED: ['เสร็จสิ้น', 'Completed', 'rgba(99,102,241,0.15)'],
  CANCELLED: ['ยกเลิก', 'Cancelled', 'rgba(100,116,139,0.15)'],
}
const STATUS_COLOR: Record<string, string> = {
  PENDING: '#FCD34D', APPROVED: '#34D399', REJECTED: '#F87171', COMPLETED: '#A5B4FC', CANCELLED: '#94A3B8',
}

const formatDate = (value: string | null | undefined, pattern: string) => {
  const date = value ? new Date(value) : new Date('')
  return isValid(date) ? format(date, pattern) : '-'
}

export default function ProfilePage() {
  const locale = useLocale()
  const router = useRouter()
  const th = locale === 'th'
  const [tab, setTab] = useState<'profile' | 'bookings' | 'settings'>('profile')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const avatarRef = useRef<HTMLInputElement>(null)

  const [editForm, setEditForm] = useState({ name: '', phone: '', bio: '', lineId: '', address: '', facebook: '' })
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/profile').then(r => { if (r.status === 401) { router.push(`/${locale}/auth/login`); return null } return r.json() }),
      fetch('/api/bookings').then(r => r.json()),
    ]).then(([p, b]) => {
      if (p?.user) {
        setUser(p.user)
        setEditForm({ name: p.user.name || '', phone: p.user.phone || '', bio: p.user.bio || '', lineId: p.user.lineId || '', address: p.user.address || '', facebook: p.user.facebook || '' })
      }
      if (b?.bookings) setBookings(b.bookings)
    }).finally(() => setLoading(false))
  }, [locale, router])

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'catty/avatars')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const d = await res.json()
      if (d.url) {
        await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ avatar: d.url }) })
        setUser(u => u ? { ...u, avatar: d.url } : u)
        toast.success(th ? 'อัปโหลดรูปสำเร็จ' : 'Avatar updated')
      }
    } catch { toast.error('Upload failed') }
    finally { setUploadingAvatar(false) }
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editForm) })
      const d = await res.json()
      if (!res.ok) { toast.error(d.error); return }
      setUser(u => u ? { ...u, ...d.user } : u)
      toast.success(th ? 'บันทึกข้อมูลสำเร็จ ✅' : 'Profile saved ✅')
    } finally { setSaving(false) }
  }

  const savePassword = async () => {
    if (pwForm.newPw !== pwForm.confirm) { toast.error(th ? 'รหัสผ่านใหม่ไม่ตรงกัน' : 'Passwords do not match'); return }
    if (pwForm.newPw.length < 6) { toast.error(th ? 'รหัสผ่านต้องมี 6+ ตัว' : 'Min 6 characters'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }) })
      const d = await res.json()
      if (!res.ok) { toast.error(d.error); return }
      toast.success(th ? 'เปลี่ยนรหัสผ่านสำเร็จ 🔒' : 'Password changed 🔒')
      setPwForm({ current: '', newPw: '', confirm: '' })
    } finally { setSaving(false) }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push(`/${locale}/auth/login`)
    router.refresh()
  }

  const S = {
    card: { background: 'var(--card)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 } as React.CSSProperties,
    label: { fontSize: 11, fontWeight: 600, color: '#0ABFBC', textTransform: 'uppercase' as const, letterSpacing: 1, display: 'block', marginBottom: 7 },
    input: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '11px 14px', borderRadius: 12, fontFamily: 'Kanit', fontSize: 14, outline: 'none' },
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(212,175,55,0.2)', borderTopColor: '#D4AF37', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (!user) return null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 90, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>

        {/* PROFILE HERO */}
        <div style={{ ...S.card, padding: '32px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#D4AF37,#0ABFBC,#FF6B9D)' }} />
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 90, height: 90, borderRadius: '50%', border: '3px solid rgba(212,175,55,0.3)', overflow: 'hidden', background: 'linear-gradient(135deg,#1C1C2E,#16162A)', cursor: 'pointer' }}
                onClick={() => avatarRef.current?.click()}>
                {user.avatar
                  ? <Image src={user.avatar} alt={user.name} width={90} height={90} style={{ objectFit: 'cover' }} priority unoptimized />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Playfair Display",serif', fontSize: 34, fontWeight: 700, background: 'linear-gradient(135deg,#D4AF37,#0ABFBC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user.name[0]}</div>}
              </div>
              <button onClick={() => avatarRef.current?.click()} style={{ position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#D4AF37,#F5D45E)', border: '2px solid var(--bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {uploadingAvatar ? <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #000', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} /> : <Camera size={13} color="#000" strokeWidth={2.5} />}
              </button>
              <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f) }} />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 24, fontWeight: 700, color: '#fff', margin: 0 }}>{user.name}</h1>
                {user.role === 'ADMIN' && (
                  <span style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>👑 ADMIN</span>
                )}
              </div>
              <p style={{ color: '#CBD5E1', fontSize: 13, margin: '0 0 10px' }}>{user.email}</p>
              {user.bio && <p style={{ color: '#CBD5E1', fontSize: 13, margin: '0 0 10px', fontStyle: 'italic' }}>"{user.bio}"</p>}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[
                  { n: user._count?.bookings || bookings.length, l: th ? 'การจอง' : 'Bookings' },
                  { n: user._count?.serviceOrders || 0, l: th ? 'บริการเสริม' : 'Services' },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: '#D4AF37' }}>{s.n}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.l}</div>
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>{th ? 'สมาชิกตั้งแต่' : 'Member since'}</div>
                  <div style={{ fontSize: 12, color: '#CBD5E1' }}>{formatDate(user.createdAt, 'MMM yyyy')}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              {user.role === 'ADMIN' && (
                <a href={`/${locale}/admin`} style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37', padding: '8px 16px', borderRadius: 10, fontSize: 13, textDecoration: 'none', fontFamily: 'Kanit', fontWeight: 600 }}>
                  👑 Admin Panel
                </a>
              )}
              <button onClick={logout} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171', padding: '8px 14px', borderRadius: 10, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <LogOut size={14} /> {th ? 'ออก' : 'Logout'}
              </button>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 4, marginBottom: 24 }}>
          {[
            { key: 'profile', icon: <User size={15} />, label: th ? 'โปรไฟล์' : 'Profile' },
            { key: 'bookings', icon: <History size={15} />, label: th ? 'ประวัติการจอง' : 'Booking History' },
            { key: 'settings', icon: <Settings size={15} />, label: th ? 'ตั้งค่า' : 'Settings' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)} style={{
              flex: 1, padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontFamily: 'Kanit', fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
              background: tab === t.key ? 'linear-gradient(135deg,#D4AF37,#F5D45E)' : 'transparent',
              color: tab === t.key ? '#000' : '#94A3B8', transition: '.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <div style={{ ...S.card, padding: '28px' }}>
            <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 24 }}>
              {th ? 'ข้อมูลส่วนตัว' : 'Personal Information'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {[
                { key: 'name', icon: <User size={15} />, label: th ? 'ชื่อ-นามสกุล' : 'Full Name', placeholder: th ? 'สมชาย ใจดี' : 'John Doe' },
                { key: 'phone', icon: <Phone size={15} />, label: th ? 'เบอร์โทร' : 'Phone', placeholder: '08X-XXX-XXXX' },
                { key: 'lineId', icon: <MessageSquare size={15} />, label: 'LINE ID', placeholder: '@yourline' },
                { key: 'facebook', icon: <MessageSquare size={15} />, label: 'Facebook', placeholder: 'facebook.com/...' },
                { key: 'address', icon: <MapPin size={15} />, label: th ? 'ที่อยู่' : 'Address', placeholder: th ? 'ที่อยู่ของคุณ' : 'Your address' },
              ].map(f => (
                <div key={f.key} style={f.key === 'address' ? { gridColumn: 'span 2' } : {}}>
                  <label style={S.label}>{f.label}</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}>{f.icon}</span>
                    <input style={{ ...S.input, paddingLeft: 38 }} placeholder={f.placeholder}
                      value={editForm[f.key as keyof typeof editForm]}
                      onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                </div>
              ))}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={S.label}>{th ? 'Bio / แนะนำตัว' : 'Bio'}</label>
                <textarea style={{ ...S.input, resize: 'none' }} rows={3} placeholder={th ? 'แนะนำตัวสั้นๆ...' : 'Tell us about yourself...'}
                  value={editForm.bio}
                  onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))} />
              </div>
            </div>
            <button onClick={saveProfile} disabled={saving} style={{
              marginTop: 20, background: saving ? '#333' : 'linear-gradient(135deg,#D4AF37,#F5D45E)',
              color: saving ? '#666' : '#000', border: 'none', padding: '12px 28px', borderRadius: 12,
              fontFamily: 'Kanit', fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Save size={16} /> {saving ? (th ? 'กำลังบันทึก...' : 'Saving...') : (th ? 'บันทึกข้อมูล' : 'Save Changes')}
            </button>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {tab === 'bookings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {bookings.length === 0 ? (
              <div style={{ ...S.card, padding: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🚗</div>
                <p style={{ color: '#64748B', marginBottom: 16 }}>{th ? 'ยังไม่มีประวัติการจอง' : 'No booking history yet'}</p>
                <a href={`/${locale}/cars`} style={{ display: 'inline-block', background: 'linear-gradient(135deg,#D4AF37,#F5D45E)', color: '#000', textDecoration: 'none', padding: '10px 24px', borderRadius: 10, fontFamily: 'Kanit', fontWeight: 700, fontSize: 13 }}>
                  {th ? 'จองรถเลย' : 'Book a Car'}
                </a>
              </div>
            ) : bookings.map(b => (
              <div key={b.id} style={{ ...S.card, padding: '18px 20px' }}>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <div style={{ width: 80, height: 58, borderRadius: 10, overflow: 'hidden', background: '#1C1C2E', flexShrink: 0, position: 'relative' }}>
                    {b.car?.images?.[0]
                      ? <Image src={b.car.images[0]} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🚗</div>}
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{b.car?.brand} {b.car?.model}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>
                      {formatDate(b.pickupDate, 'dd/MM/yy')} → {formatDate(b.returnDate, 'dd/MM/yy')} · {b.totalDays} {th ? 'วัน' : 'days'}
                    </div>
                    {b.addons?.length > 0 && (
                      <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {b.addons.map(a => (
                          <span key={a.id} style={{ background: 'rgba(255,107,157,0.1)', color: '#FF6B9D', border: '1px solid rgba(255,107,157,0.2)', padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 600 }}>
                            +{a.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ color: '#D4AF37', fontWeight: 700, fontSize: 18, fontFamily: '"Playfair Display",serif' }}>฿{b.totalPrice.toLocaleString()}</div>
                    <span style={{ background: STATUS_MAP[b.status]?.[2] || 'rgba(100,116,139,0.15)', color: STATUS_COLOR[b.status] || '#94A3B8', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 10 }}>
                      {th ? STATUS_MAP[b.status]?.[0] : STATUS_MAP[b.status]?.[1]}
                    </span>
                    <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>{formatDate(b.createdAt, 'dd/MM/yy')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Change password */}
            <div style={{ ...S.card, padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lock size={17} color="#8B5CF6" />
                </div>
                <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>{th ? 'เปลี่ยนรหัสผ่าน' : 'Change Password'}</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { key: 'current', label: th ? 'รหัสผ่านปัจจุบัน' : 'Current Password' },
                  { key: 'newPw', label: th ? 'รหัสผ่านใหม่' : 'New Password' },
                  { key: 'confirm', label: th ? 'ยืนยันรหัสผ่านใหม่' : 'Confirm New Password' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={S.label}>{f.label}</label>
                    <input type={showPw ? 'text' : 'password'} style={S.input} placeholder="••••••••"
                      value={pwForm[f.key as keyof typeof pwForm]}
                      onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#64748B' }}>
                    <input type="checkbox" checked={showPw} onChange={e => setShowPw(e.target.checked)} style={{ accentColor: '#D4AF37' }} />
                    {th ? 'แสดงรหัสผ่าน' : 'Show passwords'}
                  </label>
                </div>
                <button onClick={savePassword} disabled={saving} style={{ background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontFamily: 'Kanit', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start' }}>
                  <Lock size={15} /> {th ? 'เปลี่ยนรหัสผ่าน' : 'Change Password'}
                </button>
              </div>
            </div>

            {/* Account info */}
            <div style={{ ...S.card, padding: '24px' }}>
              <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{th ? 'ข้อมูลบัญชี' : 'Account Info'}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                {[
                  { label: 'Email', value: user.email, badge: false },
                  { label: th ? 'บทบาท' : 'Role', value: user.role === 'ADMIN' ? '👑 Administrator' : '👤 Member', badge: true },
                  { label: th ? 'สมาชิกตั้งแต่' : 'Member Since', value: formatDate(user.createdAt, 'dd MMMM yyyy'), badge: false },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: '#64748B' }}>{r.label}</span>
                    <span style={r.badge ? { background: user.role === 'ADMIN' ? 'rgba(212,175,55,0.15)' : 'rgba(10,191,188,0.15)', color: user.role === 'ADMIN' ? '#D4AF37' : '#0ABFBC', padding: '3px 10px', borderRadius: 10, fontSize: 11, fontWeight: 700 } : { color: '#fff' }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger zone */}
            <div style={{ ...S.card, padding: '20px 24px', border: '1px solid rgba(239,68,68,0.2)' }}>
              <h3 style={{ color: '#F87171', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{th ? '⚠️ พื้นที่อันตราย' : '⚠️ Danger Zone'}</h3>
              <button onClick={logout} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171', padding: '9px 18px', borderRadius: 10, cursor: 'pointer', fontFamily: 'Kanit', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <LogOut size={14} /> {th ? 'ออกจากระบบ' : 'Sign Out'}
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
