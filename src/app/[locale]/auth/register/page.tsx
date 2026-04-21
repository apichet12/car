'use client'
import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Eye, EyeOff, UserPlus, Sparkles, Heart, Zap } from 'lucide-react'

export default function RegisterPage() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })

  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 🚫 กันกดรัว
    if (loading) return

    // 🔍 validate
    if (!form.name || !form.email || !form.password || !form.phone) {
      return toast.error(locale === 'th' ? 'กรอกข้อมูลให้ครบ' : 'Please fill all fields')
    }

    if (form.password.length < 6) {
      return toast.error(locale === 'th' ? 'รหัสผ่านต้องมากกว่า 6 ตัว' : 'Password must be at least 6 characters')
    }

    if (form.password !== form.confirmPassword) {
      return toast.error(t('passwords_not_match'))
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(t('register_success'))

        // ✅ เคลียร์ฟอร์ม
        setForm({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: ''
        })

        // 👉 ไปหน้า login
        router.push(`/${locale}/auth/login`)
      } else {
        toast.error(
          data.error === 'Email already in use'
            ? t('email_taken')
            : data.error
        )
      }

    } catch (err) {
      toast.error(locale === 'th' ? 'เกิดข้อผิดพลาด' : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-dark via-dark-2 to-dark-3">
      <div className="absolute inset-0 bg-mesh"></div>
      <div className="absolute inset-0 bg-grid opacity-30"></div>

      {/* floating */}
      <div className="absolute top-16 left-12 animate-float">
        <Heart className="w-7 h-7 text-rose-brand opacity-20" />
      </div>
      <div className="absolute top-32 right-16 animate-float">
        <UserPlus className="w-6 h-6 text-teal opacity-20" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-brand via-gold to-teal rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              🐱
            </div>

            <h1 className="text-4xl font-bold text-gradient-full mb-3">
              {t('register_title')}
            </h1>

            <p className="text-gray-400">
              {t('register_subtitle')}
            </p>
          </div>

          {/* FORM */}
          <div className="card-premium p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* name */}
              <input
                type="text"
                placeholder={t('name_placeholder')}
                value={form.name}
                onChange={set('name')}
                className="input-premium w-full"
                required
              />

              {/* email */}
              <input
                type="email"
                placeholder={t('email_placeholder')}
                value={form.email}
                onChange={set('email')}
                className="input-premium w-full"
                required
              />

              {/* phone */}
              <input
                type="tel"
                placeholder={t('phone_placeholder')}
                value={form.phone}
                onChange={set('phone')}
                className="input-premium w-full"
                required
              />

              {/* password */}
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder={t('password_placeholder')}
                  value={form.password}
                  onChange={set('password')}
                  className="input-premium w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* confirm */}
              <input
                type="password"
                placeholder={t('password_placeholder')}
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                className="input-premium w-full"
                required
              />

              {/* submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading
                  ? (locale === 'th' ? 'กำลังสมัคร...' : 'Registering...')
                  : t('submit_register')}
              </button>

              {/* login */}
              <p className="text-center text-sm text-gray-400">
                {t('have_account')}{' '}
                <Link href={`/${locale}/auth/login`} className="text-teal">
                  {locale === 'th' ? 'เข้าสู่ระบบ' : 'Login'}
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}