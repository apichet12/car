'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  pages: number
  onPageChange: (p: number) => void
}

export default function Pagination({ page, pages, onPageChange }: PaginationProps) {
  if (pages <= 1) return null

  const getPageNumbers = () => {
    const nums: (number | '...')[] = []
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - page) <= 1) {
        nums.push(i)
      } else if (nums[nums.length - 1] !== '...') {
        nums.push('...')
      }
    }
    return nums
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center border border-gray-700 hover:border-yellow-500/50 text-gray-400 hover:text-yellow-400 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={16} />
      </button>

      {getPageNumbers().map((num, idx) =>
        num === '...' ? (
          <span key={`dot-${idx}`} className="text-gray-600 px-1">…</span>
        ) : (
          <button
            key={num}
            onClick={() => onPageChange(num as number)}
            className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
              page === num
                ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                : 'border border-gray-700 text-gray-400 hover:text-yellow-400 hover:border-yellow-500/50'
            }`}
          >
            {num}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(Math.min(pages, page + 1))}
        disabled={page === pages}
        className="w-9 h-9 flex items-center justify-center border border-gray-700 hover:border-yellow-500/50 text-gray-400 hover:text-yellow-400 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
