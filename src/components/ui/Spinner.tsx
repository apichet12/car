import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClass = { sm: 'w-4 h-4 border-2', md: 'w-7 h-7 border-2', lg: 'w-10 h-10 border-3' }[size]
  return (
    <div
      className={cn(
        'rounded-full border-yellow-500 border-t-transparent animate-spin',
        sizeClass,
        className
      )}
    />
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="skeleton h-48" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 rounded-lg w-3/4" />
        <div className="skeleton h-4 rounded-lg w-1/2" />
        <div className="flex gap-2 mt-4">
          <div className="skeleton h-9 rounded-xl flex-1" />
          <div className="skeleton h-9 rounded-xl flex-1" />
        </div>
      </div>
    </div>
  )
}
