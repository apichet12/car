import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currency = '฿'): string {
  return `${currency}${amount.toLocaleString()}`
}

export function formatDate(date: string | Date, fmt = 'dd/MM/yyyy'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return fmt
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', String(year))
    .replace('yy', String(year).slice(-2))
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending: 'badge-status-pending',
    approved: 'badge-status-approved',
    rejected: 'badge-status-rejected',
    completed: 'badge-status-completed',
  }
  return map[status] || 'badge-status-pending'
}

export function getStatusLabel(status: string, locale: string): string {
  const map: Record<string, Record<string, string>> = {
    th: {
      pending: 'รอการอนุมัติ',
      approved: 'อนุมัติแล้ว',
      rejected: 'ถูกปฏิเสธ',
      completed: 'เสร็จสิ้น',
    },
    en: {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      completed: 'Completed',
    },
  }
  return map[locale]?.[status] || status
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}
