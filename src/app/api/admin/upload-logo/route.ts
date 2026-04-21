import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Convert to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate filename with timestamp
    const timestamp = Date.now()
    const ext = file.name.split('.').pop() || 'png'
    const filename = `logo_${timestamp}.${ext}`

    // Save to public/uploads/logos directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'logos')
    await fs.mkdir(uploadDir, { recursive: true })

    const filepath = path.join(uploadDir, filename)
    await fs.writeFile(filepath, buffer)

    const publicUrl = `/uploads/logos/${filename}`

    return NextResponse.json({
      success: true,
      filename,
      url: publicUrl,
      message: 'Logo uploaded successfully'
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
