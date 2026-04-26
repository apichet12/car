// 🔧 FIX: ห้าม import จาก public + กัน locale undefined + กัน crash

import { getRequestConfig } from 'next-intl/server'

// ✅ ย้ายไฟล์มา src/messages ก่อน
import thMessages from '@/messages/th.json'
import enMessages from '@/messages/en.json'

const messages: Record<string, any> = {
  th: thMessages,
  en: enMessages
}

export default getRequestConfig(async ({ locale }) => {
  try {
    const safeLocale = locale && messages[locale] ? locale : 'th' // ✅ กัน undefined

    return {
      locale: safeLocale,
      messages: messages[safeLocale]
    }
  } catch (error) {
    console.error('i18n config error:', error)

    // ✅ fallback กันเว็บล่ม
    return {
      locale: 'th',
      messages: thMessages
    }
  }
})