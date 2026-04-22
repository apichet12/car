'use client'
import { useState, useEffect } from 'react'
import Navbar from './Navbar'

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

  return <Navbar user={user} logoUrl={logoUrl || undefined} />
}
