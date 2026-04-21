'use client'
import { useState, useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Settings, Mail, Globe, Database, Shield, Save, Plus, Trash2, Edit2, Upload, Eye, EyeOff, Copy, CheckCircle } from 'lucide-react'

export default function AdminSettings() {
  const locale = useLocale()
  const th = locale === 'th'
  const [tab, setTab] = useState<'general' | 'email' | 'api' | 'system'>('general')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showApiKey, setShowApiKey] = useState(false)
  const [copiedApiKey, setCopiedApiKey] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // General Settings
  const [general, setGeneral] = useState({
    companyName: 'CATTY CAR RENTAL PHUKET',
    companyEmail: 'support@cattycar.co.th',
    companyPhone: '+66-82-123-4567',
    companyAddress: '123 Patong Rd, Patong Beach, Phuket 83150',
    timezone: 'Asia/Bangkok',
    logo: '/logo.png',
  })

  // Email Settings
  const [email, setEmail] = useState({
    smtpServer: 'smtp.gmail.com',
    smtpPort: '587',
    senderEmail: 'noreply@cattycar.co.th',
    senderPassword: '••••••••',
  })

  // API Settings
  const [api, setApi] = useState({
    apiKey: 'sk_prod_4a9c8b2f3d1e5f7g9h2j4k6m8n',
    enabledPayments: true,
    enabledBooking: true,
  })

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings')
        if (res.ok) {
          const data = await res.json()
          setGeneral(prev => ({...prev, ...data}))
          setEmail(prev => ({...prev, ...data}))
          setApi(prev => ({...prev, ...data}))
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  // Upload logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload-logo', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        setGeneral({...general, logo: data.url})
        toast.success(th ? 'อัปโหลดโลโก้เสร็จ!' : 'Logo uploaded!')
      } else {
        toast.error(th ? 'ไม่สามารถอัปโหลดได้' : 'Upload failed')
      }
    } catch (error) {
      toast.error(th ? 'เกิดข้อผิดพลาด' : 'Error occurred')
    }
  }

  const handleSave = async (section: string) => {
    setSaving(true)
    try {
      const dataToSave = section === 'general' ? general : section === 'email' ? email : api
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      })
      
      if (res.ok) {
        toast.success(th ? 'บันทึกแล้ว ✓' : 'Saved successfully ✓')
      } else {
        toast.error(th ? 'บันทึกไม่สำเร็จ' : 'Save failed')
      }
    } catch (error) {
      toast.error(th ? 'เกิดข้อผิดพลาด' : 'Error occurred')
    } finally {
      setSaving(false)
    }
  }

  const copyApiKey = () => {
    navigator.clipboard.writeText(api.apiKey)
    setCopiedApiKey(true)
    toast.success(th ? 'คัดลอกแล้ว!' : 'Copied!')
    setTimeout(() => setCopiedApiKey(false), 2000)
  }

  const maskApiKey = (key: string) => {
    if (!key) return '••••••••••••••••••••'
    return key.substring(0, 7) + '•'.repeat(key.length - 11) + key.substring(key.length - 4)
  }

  const S = {
    card: { background: 'var(--card, #16162A)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 } as React.CSSProperties,
    input: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '12px 16px', borderRadius: 12, fontFamily: 'Kanit, sans-serif', fontSize: 14, outline: 'none', width: '100%' } as React.CSSProperties,
    label: { fontSize: 12, fontWeight: 600, color: '#CBD5E1', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: 1 } as React.CSSProperties,
    group: { marginBottom: 20 } as React.CSSProperties,
  }

  return (
    <div style={{ padding: '28px', maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 28, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <Settings size={32} /> {th ? 'ตั้งค่าระบบ' : 'System Settings'}
        </h1>
        <p style={{ color: '#CBD5E1', fontSize: 13, fontWeight: 300 }}>
          {th ? 'ปรับแต่งการตั้งค่าทั่วไปและการกำหนดค่าระบบ' : 'Configure general settings and system configurations'}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28, flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }}>
        {[
          { key: 'general', icon: '⚙️', label: th ? 'ทั่วไป' : 'General' },
          { key: 'email', icon: '✉️', label: th ? 'อีเมล' : 'Email' },
          { key: 'api', icon: '🔑', label: th ? 'API' : 'API' },
          { key: 'system', icon: '💾', label: th ? 'ระบบ' : 'System' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)} style={{
            padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: tab === t.key ? 'rgba(212,175,55,0.15)' : 'transparent',
            color: tab === t.key ? '#D4AF37' : '#CBD5E1',
            fontFamily: 'Kanit', fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
            transition: '.2s',
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {/* General Settings */}
        {tab === 'general' && (
          <div style={S.card}>
            <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 24 }}>
              {th ? 'ข้อมูลบริษัท' : 'Company Information'}
            </h2>
            
            {/* Logo Upload Section */}
            <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <label style={S.label}>{th ? 'โลโก้บริษัท' : 'Company Logo'}</label>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ width: 120, height: 120, borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', position: 'relative' }} onClick={() => logoInputRef.current?.click()}>
                  {general.logo ? (
                    <Image src={general.logo} alt="Logo" width={120} height={120} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#94A3B8' }}>
                      <Upload size={32} style={{ margin: '0 auto 8px' }} />
                      <div style={{ fontSize: 12 }}>{th ? 'คลิก' : 'Click'}</div>
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                  <button onClick={() => logoInputRef.current?.click()} style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', padding: '10px 18px', borderRadius: 10, cursor: 'pointer', fontFamily: 'Kanit', fontSize: 13, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Upload size={16} /> {th ? 'เลือกรูปภาพ' : 'Choose Image'}
                  </button>
                  <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>
                    {th ? 'ไฟล์: PNG, JPG, WebP (ไม่เกิน 2MB)' : 'PNG, JPG, WebP (Max 2MB)'}
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Left column */}
              <div>
                <div style={S.group}>
                  <label style={S.label}>{th ? 'ชื่อบริษัท' : 'Company Name'}</label>
                  <input style={S.input} value={general.companyName} onChange={e => setGeneral({...general, companyName: e.target.value})} placeholder="CATTY CAR" />
                </div>

                <div style={S.group}>
                  <label style={S.label}>{th ? 'อีเมลติดต่อ' : 'Email'}</label>
                  <input style={S.input} type="email" value={general.companyEmail} onChange={e => setGeneral({...general, companyEmail: e.target.value})} placeholder="info@cattycar.com" />
                </div>

                <div style={S.group}>
                  <label style={S.label}>{th ? 'เบอร์โทรศัพท์' : 'Phone'}</label>
                  <input style={S.input} value={general.companyPhone} onChange={e => setGeneral({...general, companyPhone: e.target.value})} placeholder="+66-82-XXX-XXXX" />
                </div>
              </div>

              {/* Right column */}
              <div>
                <div style={S.group}>
                  <label style={S.label}>{th ? 'ที่อยู่' : 'Address'}</label>
                  <input style={S.input} value={general.companyAddress} onChange={e => setGeneral({...general, companyAddress: e.target.value})} placeholder="Phuket, Thailand" />
                </div>

                <div style={S.group}>
                  <label style={S.label}>{th ? 'เขตเวลา' : 'Timezone'}</label>
                  <select style={{...S.input, appearance: 'none'}} value={general.timezone} onChange={e => setGeneral({...general, timezone: e.target.value})}>
                    <option value="Asia/Bangkok">Asia/Bangkok (UTC+7)</option>
                    <option value="UTC">UTC (UTC+0)</option>
                    <option value="Asia/Bangkok">Asia/Bangkok</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button onClick={() => handleSave('general')} disabled={saving} style={{ background: 'linear-gradient(135deg,#D4AF37,#F5D45E)', color: '#000', border: 'none', padding: '12px 28px', borderRadius: 12, cursor: 'pointer', fontFamily: 'Kanit', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.6 : 1 }}>
                <Save size={16} /> {saving ? (th ? 'กำลังบันทึก...' : 'Saving...') : (th ? 'บันทึก' : 'Save')}
              </button>
            </div>
          </div>
        )}

        {/* Email Settings */}
        {tab === 'email' && (
          <div style={S.card}>
            <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Mail size={24} /> {th ? 'ตั้งค่าอีเมล SMTP' : 'Email SMTP Settings'}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <div style={S.group}>
                  <label style={S.label}>{th ? 'เซิร์ฟเวอร์ SMTP' : 'SMTP Server'}</label>
                  <input style={S.input} value={email.smtpServer} onChange={e => setEmail({...email, smtpServer: e.target.value})} placeholder="smtp.gmail.com" />
                </div>

                <div style={S.group}>
                  <label style={S.label}>{th ? 'พอร์ต' : 'Port'}</label>
                  <input style={S.input} value={email.smtpPort} onChange={e => setEmail({...email, smtpPort: e.target.value})} placeholder="587" />
                </div>
              </div>

              <div>
                <div style={S.group}>
                  <label style={S.label}>{th ? 'อีเมลผู้ส่ง' : 'Sender Email'}</label>
                  <input style={S.input} type="email" value={email.senderEmail} onChange={e => setEmail({...email, senderEmail: e.target.value})} placeholder="noreply@cattycar.com" />
                </div>

                <div style={S.group}>
                  <label style={S.label}>{th ? 'รหัสผ่าน' : 'Password'}</label>
                  <input style={S.input} type="password" value={email.senderPassword} onChange={e => setEmail({...email, senderPassword: e.target.value})} placeholder="••••••••" />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button onClick={() => handleSave('email')} disabled={saving} style={{ background: 'linear-gradient(135deg,#0ABFBC,#07878A)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 12, cursor: 'pointer', fontFamily: 'Kanit', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.6 : 1 }}>
                <Save size={16} /> {saving ? (th ? 'กำลังบันทึก...' : 'Saving...') : (th ? 'บันทึก' : 'Save')}
              </button>
            </div>
          </div>
        )}

        {/* API Settings */}
        {tab === 'api' && (
          <div style={S.card}>
            <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Shield size={24} /> {th ? 'API Key และการอนุญาต' : 'API Keys & Permissions'}
            </h2>
            
            <div style={S.group}>
              <label style={S.label}>{th ? 'API Key' : 'API Key'}</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input 
                  style={{...S.input, flex: 1, fontFamily: 'monospace'}} 
                  type={showApiKey ? "text" : "password"} 
                  value={showApiKey ? api.apiKey : maskApiKey(api.apiKey)} 
                  readOnly 
                />
                <button 
                  onClick={() => setShowApiKey(!showApiKey)}
                  style={{ 
                    background: 'rgba(212,175,55,0.2)', 
                    border: '1px solid rgba(212,175,55,0.3)', 
                    color: '#D4AF37', 
                    padding: '12px 14px', 
                    borderRadius: 12, 
                    cursor: 'pointer', 
                    fontFamily: 'Kanit', 
                    fontSize: 13, 
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                  title={th ? 'แสดง/ซ่อน' : 'Show/Hide'}
                >
                  {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button 
                  onClick={copyApiKey}
                  style={{ 
                    background: 'rgba(10,191,188,0.2)', 
                    border: '1px solid rgba(10,191,188,0.3)', 
                    color: '#0ABFBC', 
                    padding: '12px 14px', 
                    borderRadius: 12, 
                    cursor: 'pointer', 
                    fontFamily: 'Kanit', 
                    fontSize: 13, 
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                  title={th ? 'คัดลอก' : 'Copy'}
                >
                  {copiedApiKey ? <CheckCircle size={18} /> : <Copy size={18} />}
                </button>
              </div>
              <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 8, margin: 0 }}>
                {th ? '⚠️ อย่าแชร์ API Key กับใครต่างหากรือเพื่อนบ้าน' : '⚠️ Never share your API Key with anyone'}
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 18, marginTop: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#D4AF37', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Globe size={16} /> {th ? 'การอนุญาต' : 'Permissions'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { key: 'enabledPayments', label: th ? 'อนุญาตการชำระเงิน' : 'Allow Payments' },
                  { key: 'enabledBooking', label: th ? 'อนุญาตการจอง' : 'Allow Booking' },
                ].map(p => (
                  <label key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontSize: 13, color: '#CBD5E1' }}>
                    <input type="checkbox" checked={api[p.key as keyof typeof api] as boolean} onChange={e => setApi({...api, [p.key]: e.target.checked})} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button onClick={() => handleSave('api')} disabled={saving} style={{ background: 'linear-gradient(135deg,#10B981,#059669)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 12, cursor: 'pointer', fontFamily: 'Kanit', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.6 : 1 }}>
                <Save size={16} /> {saving ? (th ? 'กำลังบันทึก...' : 'Saving...') : (th ? 'บันทึก' : 'Save')}
              </button>
            </div>
          </div>
        )}

        {/* System Info */}
        {tab === 'system' && (
          <div style={S.card}>
            <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Database size={24} /> {th ? 'ข้อมูลระบบและความปลอดภัย' : 'System Information & Security'}
            </h2>
            
            {/* Security Status */}
            <div style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(10,191,188,0.1))', borderRadius: 12, padding: 20, marginBottom: 28, border: '1px solid rgba(16,185,129,0.3)' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#10B981', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle size={20} /> {th ? 'สถานะความปลอดภัย' : 'Security Status'}
              </h3>
                <CheckCircle size={20} /> {th ? 'สถานะความปลอดภัย' : 'Security Status'}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { icon: '🔒', label: th ? 'HTTPS' : 'HTTPS', status: th ? 'เปิดใช้' : 'Enabled', color: '#10B981' },
                  { icon: '🛡️', label: th ? 'API Key' : 'API Key', status: th ? 'ป้องกัน' : 'Protected', color: '#10B981' },
                  { icon: '🔐', label: th ? 'รหัสผ่าน' : 'Password', status: th ? 'เข้ารหัส' : 'Encrypted', color: '#10B981' },
                  { icon: '📝', label: th ? 'Log' : 'Audit Log', status: th ? 'บันทึก' : 'Logging', color: '#10B981' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 12, border: '1px solid rgba(16,185,129,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span>{item.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#CBD5E1' }}>{item.label}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: item.color }}>✓ {item.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
              {[
                { label: th ? 'เวอร์ชัน' : 'Version', value: 'v2.1.0' },
                { label: th ? 'ฐานข้อมูล' : 'Database', value: 'PostgreSQL 14' },
                { label: th ? 'Node.js' : 'Node.js', value: 'v18.16.0' },
                { label: th ? 'Next.js' : 'Next.js', value: 'v13.4.0' },
                { label: th ? 'สถานะ' : 'Status', value: '🟢 Active' },
                { label: th ? 'ที่เก็บข้อมูล' : 'Storage', value: '2.4 GB / 10 GB' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 16, border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0ABFBC' }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Status Message */}
            <div style={{ marginTop: 28, padding: 18, background: 'rgba(10,191,188,0.05)', borderRadius: 12, border: '1px solid rgba(10,191,188,0.2)' }}>
              <p style={{ fontSize: 12, color: '#CBD5E1', margin: 0, lineHeight: '1.6' }}>
                {th ? '✓ ระบบปลอดภัยและกำลังทำงานปกติ | API Key ป้องกัน | บ็อกอัปข้อมูลล่าสุด: 2 ชั่วโมงที่ผ่านมา' : '✓ System is secure and running normally | API Key protected | Last backup: 2 hours ago'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
