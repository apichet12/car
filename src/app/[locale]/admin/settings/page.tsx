'use client'
import { useState, useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Settings, Mail, Globe, Database, Save, Upload, BarChart3, CheckCircle, Menu, X } from 'lucide-react'

export default function AdminSettings() {
  const locale = useLocale()
  const th = locale === 'th'
  const [tab, setTab] = useState<'general' | 'email' | 'system'>('general')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const [general, setGeneral] = useState({
    companyName: 'CATTY CAR RENTAL PHUKET',
    companyEmail: 'support@cattycar.co.th',
    companyPhone: '0958192507',
    companyAddress: '123 Patong Rd, Patong Beach, Phuket 83150',
    timezone: 'Asia/Bangkok',
    logo: '/logo.png',
  })

  const [email, setEmail] = useState({
    smtpServer: 'smtp.gmail.com',
    smtpPort: '587',
    senderEmail: 'noreply@cattycar.co.th',
    senderPassword: '••••••••',
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings')
        if (res.ok) {
          const data = await res.json()
          setGeneral(prev => ({ ...prev, ...data }))
          setEmail(prev => ({ ...prev, ...data }))
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload-logo', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('upload failed')

      const data = await res.json()
      setGeneral(prev => ({ ...prev, logo: data.url }))
      toast.success(th ? 'อัปโหลดโลโก้เสร็จ!' : 'Logo uploaded!')
    } catch (error) {
      toast.error(th ? 'เกิดข้อผิดพลาด' : 'Error occurred')
    }
  }

  const handleSave = async (section: string) => {
    try {
      setSaving(true)

      const dataToSave = section === 'general' ? general : email

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      })

      if (!res.ok) throw new Error('save failed')

      toast.success(th ? 'บันทึกแล้ว ✓' : 'Saved successfully ✓')
    } catch (error) {
      toast.error(th ? 'เกิดข้อผิดพลาด' : 'Error occurred')
    } finally {
      setSaving(false)
    }
  }

  const S = {
    card: {
      background: 'var(--card, #16162A)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 16,
      padding: '20px',
    } as React.CSSProperties,
    input: {
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: '#fff',
      padding: '12px 16px',
      borderRadius: 12,
      fontFamily: 'Kanit, sans-serif',
      fontSize: 14,
      width: '100%',
    } as React.CSSProperties,
    label: {
      fontSize: 12,
      fontWeight: 600,
      color: '#CBD5E1',
      marginBottom: 8,
      display: 'block',
    } as React.CSSProperties,
    group: { marginBottom: 20 } as React.CSSProperties,
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>
  }

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ color: '#fff' }}>
        <Settings /> {th ? 'ตั้งค่า' : 'Settings'}
      </h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setTab('general')}>General</button>
        <button onClick={() => setTab('email')}>Email</button>
        <button onClick={() => setTab('system')}>System</button>
      </div>

      {/* GENERAL */}
      {tab === 'general' && (
        <div style={S.card}>
          <input
            style={S.input}
            value={general.companyName}
            onChange={e =>
              setGeneral({ ...general, companyName: e.target.value })
            }
          />

          <button onClick={() => handleSave('general')}>
            <Save /> Save
          </button>
        </div>
      )}

      {/* EMAIL */}
      {tab === 'email' && (
        <div style={S.card}>
          <input
            style={S.input}
            value={email.smtpServer}
            onChange={e =>
              setEmail({ ...email, smtpServer: e.target.value })
            }
          />

          <button onClick={() => handleSave('email')}>
            <Save /> Save
          </button>
        </div>
      )}

      {/* SYSTEM */}
      {tab === 'system' && (
        <div style={S.card}>
          <p style={{ color: '#0ABFBC' }}>System OK</p>
        </div>
      )}
    </div>
  )
}