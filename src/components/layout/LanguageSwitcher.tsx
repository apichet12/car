'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

interface LanguageSwitcherProps {
  variant?: 'pill' | 'dropdown'
}

export default function LanguageSwitcher({ variant = 'pill' }: LanguageSwitcherProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`
    router.push(`/${newLocale}${pathWithoutLocale}`)
    router.refresh()
  }

  if (variant === 'dropdown') {
    return (
      <select
        value={locale}
        onChange={(e) => switchLocale(e.target.value)}
        className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:border-yellow-500/50"
      >
        <option value="th">🇹🇭 ไทย</option>
        <option value="en">🇬🇧 English</option>
      </select>
    )
  }

  return (
    <div className="flex bg-gray-900 rounded-full p-0.5 border border-gray-800">
      {[
        { code: 'th', label: 'TH', flag: '🇹🇭' },
        { code: 'en', label: 'EN', flag: '🇬🇧' },
      ].map((l) => (
        <button
          key={l.code}
          onClick={() => switchLocale(l.code)}
          title={l.flag}
          className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
            locale === l.code
              ? 'bg-yellow-500 text-black shadow-sm'
              : 'text-gray-500 hover:text-white'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
