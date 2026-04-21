import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  bgColor?: string
  trend?: { value: number; label: string }
  className?: string
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = 'text-yellow-400',
  bgColor = 'bg-yellow-500/10 border-yellow-500/20',
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-gray-900 rounded-2xl p-5 border transition-colors hover:border-gray-700',
        bgColor,
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <Icon size={22} className={iconColor} />
        {trend && (
          <span
            className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              trend.value >= 0
                ? 'bg-green-500/10 text-green-400'
                : 'bg-red-500/10 text-red-400'
            )}
          >
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white leading-tight">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-gray-500 text-xs mt-1">{label}</div>
      {trend && (
        <p className="text-gray-600 text-xs mt-1">{trend.label}</p>
      )}
    </div>
  )
}
