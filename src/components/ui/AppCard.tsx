'use client'
import React from 'react'

interface AppCardProps {
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * Beautiful app-like card for mobile UI
 * Usage: <AppCard>Content</AppCard>
 */
export default function AppCard({
  children,
  onClick,
  active = false,
  className = '',
  style = {},
}: AppCardProps) {
  return (
    <div
      onClick={onClick}
      className={`card-mobile ${className}`}
      style={{
        borderColor: active ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.1)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
