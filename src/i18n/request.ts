import { getRequestConfig } from 'next-intl/server'

// Import messages directly (more reliable than dynamic imports in production)
import thMessages from '../../public/locales/th/common.json'
import enMessages from '../../public/locales/en/common.json'

const messages: Record<string, any> = {
  th: thMessages,
  en: enMessages
}

export default getRequestConfig(async ({ locale }) => {
  try {
    if (!locale || !messages[locale]) {
      console.error(`Locale "${locale}" not found or invalid`)
      throw new Error(`Unsupported locale: ${locale}`)
    }

    return {
      locale,
      messages: messages[locale]
    }
  } catch (error) {
    console.error('i18n config error:', error)
    throw error
  }
})