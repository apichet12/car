'use client'
import { useState, useEffect } from 'react'
import MobileHeader from './MobileHeader'
import BottomNavigation from './BottomNavigation'

interface NavbarWrapperProps {
  user?: { name: string; role: string } | null
}

export default function NavbarWrapper({ user }: NavbarWrapperProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch('/api/admin/settings')
        if (res.ok) {
          const data = await res.json()
          if (data.logo) setLogoUrl(data.logo)
        }
      } catch (error) {
        console.error('Failed to fetch logo:', error)
      }
    }
    fetchLogo()
  }, [])

  return (
    <>
      <MobileHeader logoUrl={logoUrl || undefined} />
      <BottomNavigation user={user} />
    </>
  )
}
