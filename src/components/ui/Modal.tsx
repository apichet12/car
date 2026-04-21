'use client'
import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!open) return null

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[size]

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={cn(
          'w-full bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/60 relative animate-slide-up',
          sizeClass
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <h2 className="text-white font-semibold text-lg">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
            >
              <X size={18} />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
          >
            <X size={20} />
          </button>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
