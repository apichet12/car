'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, ImageIcon } from 'lucide-react'

interface SlipUploaderProps {
  onUpload: (url: string) => void
  label?: string
}

export default function SlipUploader({ onUpload, label }: SlipUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large (max 5MB)')
      return
    }

    setError('')
    setUploading(true)

    // Show local preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'catty/slips')

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (data.url) {
        onUpload(data.url)
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (err) {
      setError('Upload failed, please try again')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-2">
      {label && <label className="label-dark">{label}</label>}

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-700">
          <div className="relative h-48">
            <Image src={preview} alt="Slip preview" fill className="object-contain bg-gray-900" />
          </div>
          <button
            onClick={() => { setPreview(null); if (inputRef.current) inputRef.current.value = '' }}
            className="absolute top-2 right-2 w-7 h-7 bg-black/70 hover:bg-red-500/80 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X size={14} />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-700 hover:border-yellow-500/50 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors group"
        >
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-yellow-500/10 transition-colors">
            {uploading ? (
              <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload size={20} className="text-gray-500 group-hover:text-yellow-400 transition-colors" />
            )}
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm font-medium">
              {uploading ? 'Uploading...' : 'Click or drag & drop'}
            </p>
            <p className="text-gray-600 text-xs mt-0.5">PNG, JPG, JPEG up to 5MB</p>
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
    </div>
  )
}
