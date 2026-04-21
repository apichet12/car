'use client'
import { useLocale } from 'next-intl'
import Modal from './Modal'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) {
  const locale = useLocale()

  return (
    <Modal open={open} onClose={onCancel} title={title} size="sm">
      <p className="text-gray-400 text-sm mb-6">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
            danger
              ? 'bg-red-500 hover:bg-red-400 text-white'
              : 'bg-yellow-500 hover:bg-yellow-400 text-black'
          }`}
        >
          {confirmLabel || (locale === 'th' ? 'ยืนยัน' : 'Confirm')}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 text-sm transition-colors"
        >
          {cancelLabel || (locale === 'th' ? 'ยกเลิก' : 'Cancel')}
        </button>
      </div>
    </Modal>
  )
}
