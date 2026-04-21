import { NextRequest, NextResponse } from 'next/server'
import { requireUser, isError } from '@/lib/apiAuth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

async function uploadToLocal(buffer: Buffer, filename: string, folder: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
  await mkdir(uploadDir, { recursive: true })
  const fname = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.]/g, '_')}`
  await writeFile(path.join(uploadDir, fname), buffer)
  return `/uploads/${folder}/${fname}`
}

async function uploadToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  // Dynamic import to avoid errors if cloudinary not configured
  const { default: cloudinary } = await import('@/lib/cloudinary')
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `catty/${folder}`, resource_type: 'auto' },
      (err: any, res: any) => { if (err) reject(err); else resolve(res.secure_url) }
    )
    stream.end(buffer)
  })
}

export async function POST(req: NextRequest) {
  const auth = requireUser(req)
  if (isError(auth)) return auth

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'misc'

    if (!file) return NextResponse.json({ error: 'ไม่พบไฟล์' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'ไฟล์ใหญ่เกิน 5MB' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let url: string

    // Try Cloudinary first, fallback to local
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    if (cloudName && cloudName !== 'your-cloud-name') {
      try {
        url = await uploadToCloudinary(buffer, folder)
      } catch (e) {
        console.warn('Cloudinary failed, using local storage:', e)
        url = await uploadToLocal(buffer, file.name, folder)
      }
    } else {
      // Local storage (works without Cloudinary)
      url = await uploadToLocal(buffer, file.name, folder)
    }

    return NextResponse.json({ url })
  } catch (e: any) {
    console.error('Upload error:', e)
    return NextResponse.json({ error: 'อัปโหลดล้มเหลว: ' + e.message }, { status: 500 })
  }
}
