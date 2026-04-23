import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Default settings
const DEFAULT_SETTINGS = {
  companyName: 'CATTY CAR RENTAL PHUKET',
  companyEmail: 'support@cattycar.co.th',
  companyPhone: '0958192507',
  companyAddress: '123 Patong Rd, Patong Beach, Phuket 83150',
  timezone: 'Asia/Bangkok',
  logo: '/uploads/logos/logo.png',
  smtpServer: 'smtp.gmail.com',
  smtpPort: 587,
  senderEmail: 'noreply@cattycar.co.th',
  senderPassword: '••••••••',
  apiKey: '••••••••',
  enabledPayments: true,
  enabledBooking: true,
}

// ✅ [ADD] mask sensitive data
function sanitizeSettings(settings: any) {
  const { senderPassword, apiKey, ...safe } = settings
  return {
    ...safe,
    senderPassword: '••••••••',
    apiKey: '••••••••',
  }
}

// ✅ [ADD] validate input
function validateSettings(data: any) {
  if (!data) return false

  if (data.companyEmail && !data.companyEmail.includes('@')) return false
  if (data.smtpPort && isNaN(Number(data.smtpPort))) return false

  return true
}

// Get or create settings
async function getOrCreateSettings() {
  try {
    let settings = await prisma.settings.findFirst()
    
    if (!settings) {
      settings = await prisma.settings.create({
        data: DEFAULT_SETTINGS,
      })
    }
    
    return settings
  } catch (error) {
    console.error('Failed to get settings:', error)
    return null
  }
}

// GET settings
export async function GET() {
  try {
    const settings = await getOrCreateSettings()

    if (!settings) {
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }

    // ✅ [FIX] hide sensitive data
    return NextResponse.json(sanitizeSettings(settings))

  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// POST update settings
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // ✅ [ADD] validation
    if (!validateSettings(data)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    // Get existing settings
    let settings = await getOrCreateSettings()
    
    if (!settings) {
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }

    // ✅ [FIX] protect secret fields
    const updateData = {
      ...data,
      senderPassword: data.senderPassword && data.senderPassword !== '••••••••' 
        ? data.senderPassword 
        : settings.senderPassword,
      apiKey: data.apiKey && data.apiKey !== '••••••••'
        ? data.apiKey
        : settings.apiKey,
      smtpPort: data.smtpPort ? parseInt(data.smtpPort.toString()) : settings.smtpPort,
    }

    // Update settings in database
    const updatedSettings = await prisma.settings.update({
      where: { id: settings.id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      settings: sanitizeSettings(updatedSettings),
    })

  } catch (error) {
    console.error('Failed to save settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
