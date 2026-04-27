
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from './i18n/config'
import { getTokenPayload } from './lib/jwt'

const intl = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
})

export async function middleware(req: NextRequest) {
  const response = intl(req)

  const { pathname } = req.nextUrl

  const locale =
    locales.find(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`)) ??
    defaultLocale

  const path = pathname.replace(`/${locale}`, '') || '/'

  const token = req.cookies.get('token')?.value
  let user = null

  //  FIX: กัน jwt พัง
  try {
    user = token ? getTokenPayload(token) : null
  } catch (err) {
    console.error('JWT ERROR:', err)
  }

  //  auth redirect
  if (path === '/auth/login' || path === '/auth/register') {
    if (user) {
      const dest = user.role === 'ADMIN' ? `/${locale}/admin` : `/${locale}`
      return NextResponse.redirect(new URL(dest, req.url))
    }
  }

  // admin guard
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url))
    }
    if (user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/${locale}`, req.url))
    }
  }

  //  user guard
  if (path.startsWith('/profile') || path.startsWith('/booking')) {
    if (!user) {
      const url = new URL(`/${locale}/auth/login`, req.url)
      url.searchParams.set('redirect', path)
      return NextResponse.redirect(url)
    }
  }

  //  return response จาก intl
  return response
}
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}