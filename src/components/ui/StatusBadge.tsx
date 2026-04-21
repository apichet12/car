import { cn, getStatusColor, getStatusLabel } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  locale?: string
  className?: string
}

export default function StatusBadge({ status, locale = 'th', className }: StatusBadgeProps) {
  return (
    <span className={cn(getStatusColor(status), className)}>
      {getStatusLabel(status, locale)}
    </span>
  )
}
