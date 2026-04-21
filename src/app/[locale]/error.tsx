'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">😿</div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-500 mb-8">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={reset} className="btn-gold">
            Try Again
          </button>
          <Link href="/" className="btn-outline-gold">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
