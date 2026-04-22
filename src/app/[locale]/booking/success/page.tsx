'use client'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { Home } from 'lucide-react'

export default function Success() {
  const th = useLocale() === 'th'
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: 600, textAlign: 'center' }}>
        <h1 style={{ fontSize: 42, color: 'var(--text-primary)', marginBottom: 16 }}>
          {th ? '✅ จองสำเร็จ' : '✅ Success!'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
          {th ? 'ขอบคุณที่ใช้บริการ' : 'Thank you for booking!'}
        </p>
        <Link href="/" style={{ padding: '12px 24px', background: '#D4AF37', color: '#000', textDecoration: 'none', borderRadius: 8, display: 'inline-flex', gap: 8, fontFamily: 'Kanit' }}>
          <Home size={16} /> {th ? 'กลับหน้าแรก' : 'Home'}
        </Link>
      </div>
    </div>
  )
}'use client'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { Home } from 'lucide-react'

export default function Success() {
  const th = useLocale() === 'th'
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: 600, textAlign: 'center' }}>
        <h1 style={{ fontSize: 42, color: 'var(--text-primary)', marginBottom: 16 }}>
          {th ? '✅ จองสำเร็จ' : '✅ Success!'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
          {th ? 'ขอบคุณที่ใช้บริการ' : 'Thank you for booking!'}
        </p>
        <Link href=\" /\\\ style={{ padding: '12px 24px', background: '#D4AF37', color: '#000', textDecoration: 'none', borderRadius: 8, display: 'inline-flex', gap: 8, fontFamily: 'Kanit' }}>
 <Home size={16} /> {th ? 'กลับหน้าแรก' : 'Home'}
 </Link>
 </div>
 </div>
 )
}