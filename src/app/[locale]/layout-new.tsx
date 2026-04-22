import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Kanit, Playfair_Display } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { cookies } from 'next/headers'
import NavbarWrapper from '@/components/layout/NavbarWrapper'
import Footer from '@/components/layout/Footer'
import ChatBot from '@/components/chat/ChatBot'
import LayoutMobileWrapper from '@/components/layout/LayoutMobileWrapper'
import { verifyToken } from '@/lib/jwt'
import type { Metadata } from 'next'
import '@/styles/globals.css'

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
})
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-playfair',
})

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const title = locale === 'th' ? 'เช่ารถกับแคตตี้ | พรีเมียม ภูเก็ต' : 'Catty Car Rental | Premium Phuket'
  const desc = locale === 'th'
    ? 'เช่ารถ ที่พัก เสริมสวย ติวเรียน — ครบทุกบริการในที่เดียว'
    : 'Car rental, accommodation, beauty & tutoring — all in one place'
  return { title, description: desc }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value
  const userPayload = token ? verifyToken(token) : null
  const user = userPayload
    ? { name: userPayload.name || userPayload.email, role: userPayload.role }
    : null

  return (
    <>
      <div className="bg-mesh" />
      <div className="bg-grid" />
      <NextIntlClientProvider messages={messages} locale={locale}>
        <LayoutMobileWrapper user={user} locale={locale}>
          {children}
        </LayoutMobileWrapper>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#16162A', color: '#fff',
              border: '1px solid rgba(212,175,55,0.2)',
              borderLeft: '3px solid #D4AF37',
              borderRadius: '12px', fontFamily: 'Kanit, sans-serif', fontSize: '14px',
            },
            success: { iconTheme: { primary: '#0ABFBC', secondary: '#000' } },
            error: { style: { borderLeft: '3px solid #ef4444' }, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </NextIntlClientProvider>
    </>
  )
}
