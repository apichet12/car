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
  logo: '/uploads/logos/logo_1713619200.png',
  smtpServer: 'smtp.gmail.com',
  smtpPort: '587',
  senderEmail: 'noreply@cattycar.co.th',
  senderPassword: '••••••••',
  apiKey: 'sk_prod_4a9c8b2f3d1e5f7g9h2j4k6m8n',
  enabledPayments: true,
  enabledBooking: true,
}

// Read settings from file
async function readSettings() {
  try {
    const filePath = getSettingsPath()
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    // File doesn't exist or is invalid, return defaults
    return DEFAULT_SETTINGS
  }
}

// Write settings to file
async function writeSettings(settings: any) {
  try {
    const filePath = getSettingsPath()
    const dir = path.dirname(filePath)
    
    // Create directory if it doesn't exist
    await fs.mkdir(dir, { recursive: true })
    
    // Write file
    await fs.writeFile(filePath, JSON.stringify(settings, null, 2))
    return true
  } catch (error) {
    console.error('Failed to write settings:', error)
    return false
  }
}

export async function GET() {
  try {
    const settings = await readSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Read existing settings
    const existingSettings = await readSettings()
    
    // Merge with new data
    const updatedSettings = { ...existingSettings, ...data }
    
    // Write to file
    const success = await writeSettings(updatedSettings)
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Settings saved successfully',
        settings: updatedSettings 
      })
    } else {
      return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
    }
  } catch (error) {
    console.error('Failed to save settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}

