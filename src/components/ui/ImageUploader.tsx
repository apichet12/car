'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, ImageIcon } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  folder?: string
  maxImages?: number
  label?: string
}

export default function ImageUploader({
  images,
  onChange,
  folder = 'catty/cars',
  maxImages = 6,
  label,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    if (images.length >= maxImages) return

    setUploading(true)
    const newUrls: string[] = []

    for (let i = 0; i < Math.min(files.length, maxImages - images.length); i++) {
      const file = files[i]
      if (!file.type.startsWith('image/')) continue
      if (file.size > 5 * 1024 * 1024) continue

      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder)
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (data.url) newUrls.push(data.url)
      } catch {
        console.error('Upload failed')
      }
    }

    onChange([...images, ...newUrls])
    setUploading(false)
  }

  const remove = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx))
  }

  return (
    <div>
      {label && <label className="label-dark">{label}</label>}

      <div className="flex flex-wrap gap-2">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative w-20 h-16 rounded-xl overflow-hidden bg-gray-800 group border border-gray-700"
          >
            <Image src={img} alt={`Image ${idx + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => remove(idx)}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <X size={16} className="text-red-400" />
            </button>
            {idx === 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-yellow-500/80 text-black text-[10px] text-center py-0.5 font-bold">
                Main
              </div>
            )}
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-20 h-16 border-2 border-dashed border-gray-700 hover:border-yellow-500/50 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {uploading ? (
              <Spinner size="sm" />
            ) : (
              <>
                <Upload size={14} className="text-gray-500" />
                <span className="text-gray-600 text-[10px]">Upload</span>
              </>
            )}
          </button>
        )}
      </div>

      <p className="text-gray-600 text-xs mt-1.5">
        {images.length}/{maxImages} images · Max 5MB each
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleUpload(e.target.files)}
      />
    </div>
  )
}
