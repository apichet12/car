import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// Path to the settings file
const getSettingsPath = () => {
  return path.join(process.cwd(), 'public', 'config', 'settings.json')
}

// Default settings
const DEFAULT_SETTINGS = {
  companyName: 'CATTY CAR RENTAL PHUKET',
  companyEmail: 'support@cattycar.co.th',
  companyPhone: '+66-82-123-4567',
  companyAddress: '123 Patong Rd, Patong Beach, Phuket 83150',
  timezone: 'Asia/Bangkok',
  logo: '/uploads/logos/logo_1776805199235.jpg',
  smtpServer: 'smtp.gmail.com',
  smtpPort: '587',
  senderEmail: 'noreply@cattycar.co.th',
  senderPassword: '••••••••',
  apiKey: 'sk_prod_4a9c8b2f3d1e5f7g9h2j4k6m8n',
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

// Read settings from file
async function readSettings() {
  try {
    const filePath = getSettingsPath()
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return DEFAULT_SETTINGS
  }
}

// Write settings to file
async function writeSettings(settings: any) {
  try {
    const filePath = getSettingsPath()
    const dir = path.dirname(filePath)

    await fs.mkdir(dir, { recursive: true })

    // ✅ [FIX] atomic write (กันไฟล์พัง)
    const tempPath = filePath + '.tmp'
    await fs.writeFile(tempPath, JSON.stringify(settings, null, 2))
    await fs.rename(tempPath, filePath)

    return true
  } catch (error) {
    console.error('Failed to write settings:', error)
    return false
  }
}

// GET settings
export async function GET() {
  try {
    const settings = await readSettings()

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

    const existingSettings = await readSettings()

    // ✅ [FIX] protect secret fields
    const updatedSettings = {
      ...existingSettings,
      ...data,
      senderPassword: data.senderPassword || existingSettings.senderPassword,
      apiKey: data.apiKey || existingSettings.apiKey,
    }

    const success = await writeSettings(updatedSettings)

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Settings saved successfully',
        settings: sanitizeSettings(updatedSettings), // ✅ safe response
      })
    } else {
      return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
    }
  } catch (error) {
    console.error('Failed to save settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}