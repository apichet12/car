'use client'
import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { BarChart3, Users, Car, AlertCircle, Settings, TrendingUp } from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalCars: number
  availableCars: number
  bookedCars: number
  totalBookings: number
  activeBookings: number
}

export default function AdminDashboard() {
  const locale = useLocale()
  const th = locale === 'th'
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCars: 0,
    availableCars: 0,
    bookedCars: 0,
    totalBookings: 0,
    activeBookings: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch('/api/admin/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div style={{
      background: 'var(--card, #16162A)',
      border: `2px solid ${color}20`,
      borderRadius: 16,
      padding: 24,
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }}>
      <div style={{
        background: `${color}20`,
        borderRadius: 12,
        padding: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={32} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>
          {label}
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>
          {loading ? '...' : value}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ padding: '28px', maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 32, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <BarChart3 size={36} /> {th ? 'แดชบอร์ด' : 'Dashboard'}
        </h1>
        <p style={{ color: '#CBD5E1', fontSize: 13, fontWeight: 300 }}>
          {th ? 'สถิติและข้อมูลระบบจำเป็น' : 'System statistics and overview'}
        </p>
      </div>

      {/* Navigation */}
      <div style={{ marginBottom: 32, display: 'flex', gap: 12 }}>
        <Link href={`/${locale}/admin`} style={{
          background: 'rgba(212,175,55,0.15)',
          color: '#D4AF37',
          padding: '10px 18px',
          borderRadius: 10,
          textDecoration: 'none',
          fontFamily: 'Kanit',
          fontSize: 13,
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8
        }}>
          <BarChart3 size={16} /> {th ? 'แดชบอร์ด' : 'Dashboard'}
        </Link>
        <Link href={`/${locale}/admin/settings`} style={{
          background: 'transparent',
          color: '#CBD5E1',
          padding: '10px 18px',
          borderRadius: 10,
          textDecoration: 'none',
          fontFamily: 'Kanit',
          fontSize: 13,
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Settings size={16} /> {th ? 'ตั้งค่าระบบ' : 'Settings'}
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 20,
        marginBottom: 32
      }}>
        <StatCard
          icon={Users}
          label={th ? 'จำนวนผู้ใช้ทั้งหมด' : 'Total Users'}
          value={stats.totalUsers}
          color="#D4AF37"
        />
        <StatCard
          icon={Car}
          label={th ? 'รถทั้งหมด' : 'Total Cars'}
          value={stats.totalCars}
          color="#0ABFBC"
        />
        <StatCard
          icon={AlertCircle}
          label={th ? 'รถว่างอยู่' : 'Available Cars'}
          value={stats.availableCars}
          color="#10B981"
        />
        <StatCard
          icon={TrendingUp}
          label={th ? 'รถที่จองแล้ว' : 'Booked Cars'}
          value={stats.bookedCars}
          color="#F59E0B"
        />
        <StatCard
          icon={BarChart3}
          label={th ? 'การจองทั้งหมด' : 'Total Bookings'}
          value={stats.totalBookings}
          color="#8B5CF6"
        />
        <StatCard
          icon={AlertCircle}
          label={th ? 'การจองที่ใช้งาน' : 'Active Bookings'}
          value={stats.activeBookings}
          color="#EF4444"
        />
      </div>

      {/* Summary */}
      <div style={{
        background: 'var(--card, #16162A)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        padding: 24
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
          {th ? 'สรุปข้อมูล' : 'Summary'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, color: '#CBD5E1', fontSize: 14, lineHeight: 1.8 }}>
          <div>
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: '#D4AF37', fontWeight: 700 }}>{stats.totalUsers}</span> {th ? 'ผู้ใช้ลงทะเบียน' : 'registered users'}
            </div>
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: '#0ABFBC', fontWeight: 700 }}>{stats.totalCars}</span> {th ? 'รถในระบบ' : 'cars in system'}
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>{stats.availableCars}</span> {th ? 'รถพร้อมให้เช่า' : 'cars available'}
            </div>
            <div>
              <span style={{ color: '#EF4444', fontWeight: 700 }}>{stats.activeBookings}</span> {th ? 'การจองที่ใช้งาน' : 'active bookings'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
