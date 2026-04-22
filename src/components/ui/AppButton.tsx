'use client'
import React from 'react'

interface AppButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'icon'
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  type?: 'button' | 'submit' | 'reset'
}

/**
 * Beautiful app-like button for mobile UI
 * Variants:
 * - primary: Gold gradient with glow
 * - secondary: Teal gradient
 * - outline: Transparent with border
 * - icon: Icon button (44x44px touch target)
 */
export default function AppButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  style = {},
  type = 'button',
}: AppButtonProps) {
  const getButtonStyle = (): React.CSSProperties => {
    switch (variant) {
      case 'secondary':
        return {
          background: 'linear-gradient(135deg, #0ABFBC, #078A87)',
          color: '#fff',
          fontWeight: 700,
          padding: '12px 24px',
          borderRadius: '12px',
          border: 'none',
          fontSize: '14px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          opacity: disabled ? 0.5 : 1,
          boxShadow: '0 4px 15px rgba(10,191,188,0.3)',
        }
      case 'outline':
        return {
          background: 'transparent',
          border: '1px solid rgba(212,175,55,0.3)',
          color: '#D4AF37',
          fontWeight: 600,
          padding: '11px 22px',
          borderRadius: '10px',
          fontSize: '13px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          opacity: disabled ? 0.5 : 1,
        }
      case 'icon':
        return {
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px',
          border: 'none',
          background: 'rgba(255,255,255,0.05)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          color: 'rgba(255,255,255,0.6)',
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          opacity: disabled ? 0.5 : 1,
        }
      case 'primary':
      default:
        return {
          background: 'linear-gradient(135deg, #D4AF37, #0ABFBC)',
          color: '#000',
          fontWeight: 700,
          padding: '12px 24px',
          borderRadius: '12px',
          border: 'none',
          fontSize: '14px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          opacity: disabled ? 0.5 : 1,
          boxShadow: '0 8px 24px rgba(10,191,188,0.25)',
          minHeight: '44px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }
    }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className}`}
      style={{
        ...getButtonStyle(),
        ...style,
        fontFamily: 'Kanit, sans-serif',
      }}
    >
      {children}
    </button>
  )
}
