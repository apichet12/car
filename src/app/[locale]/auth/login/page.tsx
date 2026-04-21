'use client'
import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Car, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || ''

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (loading) return

    const cleanEmail = email.trim()
    const cleanPassword = password.trim()

    // ✅ Validation
    if (!cleanEmail || !cleanPassword) {
      return toast.error(locale === 'th' ? 'กรอกข้อมูลให้ครบ' : 'Please fill all fields')
    }

    if (!cleanEmail.includes('@')) {
      return toast.error(locale === 'th' ? 'อีเมลไม่ถูกต้อง' : 'Invalid email')
    }

    if (cleanPassword.length < 6) {
      return toast.error(
        locale === 'th'
          ? 'รหัสผ่านต้องอย่างน้อย 6 ตัว'
          : 'Password must be at least 6 characters'
      )
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        console.log("ROLE =", data.user?.role)
        toast.success(locale === 'th' ? 'เข้าสู่ระบบสำเร็จ! 🐱' : 'Logged in successfully! 🐱')

        const targetPath =
          data.user.role?.toUpperCase() === 'ADMIN'
            ? `/${locale}/admin`
            : (redirect ? `/${locale}${redirect}` : `/${locale}`)

        // ✅ DEBUG
        console.log("GO TO =", targetPath)

        // 🔥 ตัวจบ (สำคัญมาก)
        setTimeout(() => {
          window.location.href = targetPath
        }, 300)
      } else {
        console.log("LOGIN ERROR:", res.status, data)
        if (data.error === 'Invalid credentials' || data.error === 'อีเมลหรือรหัสผ่านไม่ถูกต้อง') {
          toast.error(
            locale === 'th'
              ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
              : 'Invalid email or password'
          )
        } else {
          toast.error(data.error || t('login_failed'))
        }
      }
    } catch {
      toast.error(locale === 'th' ? 'เกิดข้อผิดพลาด กรุณาลองใหม่' : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-to-br from-dark via-dark-2 to-dark-3 ${loading ? 'cursor-wait' : ''}`}>

      <div className="absolute inset-0 bg-mesh"></div>
      <div className="absolute inset-0 bg-grid opacity-30"></div>

      <div className="absolute top-20 left-10 animate-float">
        <Car className="w-8 h-8 text-gold opacity-20" />
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '2s' }}>
        <Sparkles className="w-6 h-6 text-teal opacity-20" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg">

          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-gold to-teal rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              🐱
            </div>

            <h1 className="text-4xl font-bold text-gradient-full mb-3">
              {t('login_title')}
            </h1>

            <p className="text-gray-400">
              {t('login_subtitle')}
            </p>
          </div>

          <div className="card-premium p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('email_placeholder')}
                required
                className="input-premium w-full"
              />

              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={t('password_placeholder')}
                  required
                  className="input-premium w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading
                  ? (locale === 'th' ? 'กำลังเข้าสู่ระบบ...' : 'Signing in...')
                  : t('submit_login')}
              </button>

              <p className="text-center text-sm text-gray-400">
                {t('no_account')}{' '}
                <Link href={`/${locale}/auth/register`} className="text-teal">
                  {locale === 'th' ? 'สร้างบัญชีใหม่' : 'Create account'}
                </Link>
              </p>
            </form>

           

          </div>
        </div>
      </div>
    </div>
  )
}