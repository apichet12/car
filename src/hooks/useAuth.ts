'use client'
import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: (locale?: string) => Promise<void>
  refresh: () => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser?: User | null
}) {
  const [user, setUser] = useState<User | null>(initialUser || null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const refresh = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        setUser(data.user)
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch {
      return { success: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }

  const register = async (registerData: RegisterData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      })
      const data = await res.json()
      if (res.ok) {
        setUser(data.user)
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch {
      return { success: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }

  const logout = async (locale = 'th') => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push(`/${locale}/auth/login`)
    router.refresh()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
