// 🔧 FIX สำหรับ next-intl เวอร์ชันเก่า

import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => {
  try {
    if (!locale) {
      throw new Error('Locale is missing')
    }

    return {
      locale, // ✅ ต้องมี (ของคุณขาดตรงนี้)
      messages: (await import(`../../public/locales/${locale}/common.json`)).default
    }
  } catch (error) {
    console.error('i18n config error:', error)
    throw error
  }
})