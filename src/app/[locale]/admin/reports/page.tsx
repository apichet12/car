'use client'
import { useState, useEffect, useMemo } from 'react'
import { useLocale } from 'next-intl'
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, parseISO } from 'date-fns'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calendar, TrendingUp, DollarSign, Users, BookOpen } from 'lucide-react'

interface Booking {
  id: string
  status: string
  totalPrice: number
  startDate: string
  endDate: string
  createdAt: string
  user: { id: string; name: string }
}

type TimePeriod = 'today' | 'week' | 'month' | 'year'

export default function ReportsPage() {
  const locale = useLocale()
  const th = locale === 'th'
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week')

  useEffect(() => {
    fetch('/api/bookings').then(r => r.json()).then(d => setBookings(d.bookings || [])).finally(() => setLoading(false))
  }, [])

  const getDateRange = (period: TimePeriod) => {
    const now = new Date()
    switch (period) {
      case 'today':
        return { start: startOfDay(now), end: endOfDay(now) }
      case 'week':
        return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) }
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) }
      case 'year':
        return { start: startOfYear(now), end: endOfYear(now) }
    }
  }

  const filteredBookings = useMemo(() => {
    const range = getDateRange(timePeriod)
    return bookings.filter(b => isWithinInterval(parseISO(b.createdAt), range))
  }, [bookings, timePeriod])

  const dailyData = useMemo(() => {
    const range = getDateRange(timePeriod)
    const days = timePeriod === 'today' ? 24 : timePeriod === 'week' ? 7 : timePeriod === 'month' ? 30 : 12
    const data: any[] = []
    const now = new Date()

    if (timePeriod === 'today') {
      // Hourly data
      for (let i = 0; i < 24; i++) {
        const hour = new Date()
        hour.setHours(i, 0, 0, 0)
        const count = bookings.filter(b => {
          const date = parseISO(b.createdAt)
          return date.getHours() === i && isWithinInterval(date, range)
        }).length
        data.push({
          label: `${String(i).padStart(2, '0')}:00`,
          bookings: count,
          revenue: bookings.filter(b => {
            const date = parseISO(b.createdAt)
            return date.getHours() === i && isWithinInterval(date, range)
          }).reduce((sum, b) => sum + b.totalPrice, 0)
        })
      }
    } else if (timePeriod === 'week') {
      const dayNames = th ? ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      for (let i = 0; i < 7; i++) {
        const day = new Date(range.start)
        day.setDate(day.getDate() + i)
        const dayStart = startOfDay(day)
        const dayEnd = endOfDay(day)
        const count = bookings.filter(b => isWithinInterval(parseISO(b.createdAt), { start: dayStart, end: dayEnd })).length
        const revenue = bookings.filter(b => isWithinInterval(parseISO(b.createdAt), { start: dayStart, end: dayEnd })).reduce((sum, b) => sum + b.totalPrice, 0)
        data.push({
          label: dayNames[i],
          bookings: count,
          revenue: revenue
        })
      }
    } else if (timePeriod === 'month') {
      for (let i = 1; i <= 30; i++) {
        const day = new Date(range.start.getFullYear(), range.start.getMonth(), i)
        if (day > range.end) break
        const dayStart = startOfDay(day)
        const dayEnd = endOfDay(day)
        const count = bookings.filter(b => isWithinInterval(parseISO(b.createdAt), { start: dayStart, end: dayEnd })).length
        const revenue = bookings.filter(b => isWithinInterval(parseISO(b.createdAt), { start: dayStart, end: dayEnd })).reduce((sum, b) => sum + b.totalPrice, 0)
        data.push({
          label: format(day, 'd'),
          bookings: count,
          revenue: revenue
        })
      }
    } else {
      // Year - monthly data
      const monthNames = th ? ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'สค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      for (let i = 0; i < 12; i++) {
        const month = new Date(now.getFullYear(), i, 1)
        const monthStart = startOfMonth(month)
        const monthEnd = endOfMonth(month)
        const count = bookings.filter(b => isWithinInterval(parseISO(b.createdAt), { start: monthStart, end: monthEnd })).length
        const revenue = bookings.filter(b => isWithinInterval(parseISO(b.createdAt), { start: monthStart, end: monthEnd })).reduce((sum, b) => sum + b.totalPrice, 0)
        data.push({
          label: monthNames[i],
          bookings: count,
          revenue: revenue
        })
      }
    }
    return data
  }, [bookings, timePeriod, th])

  const statusData = useMemo(() => {
    const approved = filteredBookings.filter(b => b.status === 'APPROVED').length
    const completed = filteredBookings.filter(b => b.status === 'COMPLETED').length
    const rejected = filteredBookings.filter(b => b.status === 'REJECTED').length
    const pending = filteredBookings.filter(b => b.status === 'PENDING').length

    return [
      { name: th ? 'อนุมัติ' : 'Approved', value: approved, color: '#34D399' },
      { name: th ? 'เสร็จ' : 'Completed', value: completed, color: '#A5B4FC' },
      { name: th ? 'ปฏิเสธ' : 'Rejected', value: rejected, color: '#F87171' },
      { name: th ? 'รอ' : 'Pending', value: pending, color: '#FCD34D' },
    ].filter(d => d.value > 0)
  }, [filteredBookings, th])

  const stats = useMemo(() => {
    const totalBookings = filteredBookings.length
    const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.totalPrice, 0)
    const approvedCount = filteredBookings.filter(b => b.status === 'APPROVED').length
    const uniqueUsers = new Set(filteredBookings.map(b => b.user?.id)).size

    return {
      totalBookings,
      totalRevenue,
      approvedCount,
      uniqueUsers
    }
  }, [filteredBookings])

  const timeRangeText = () => {
    const range = getDateRange(timePeriod)
    if (timePeriod === 'today') return `${format(new Date(), 'MMM dd, yyyy')}`
    if (timePeriod === 'week') return `${format(range.start, 'MMM dd')} - ${format(range.end, 'MMM dd, yyyy')}`
    if (timePeriod === 'month') return format(new Date(), 'MMMM yyyy')
    return format(new Date(), 'yyyy')
  }

  const C = {
    card: { background: 'var(--card, #16162A)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 } as React.CSSProperties,
  }

  return (
    <div style={{ padding: '28px', maxWidth: 1400 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
          📊 {th ? 'รายงาน' : 'Reports'}
        </h1>
        <p style={{ color: '#64748B', fontSize: 14 }}>
          {th ? 'ข้อมูลการจองและรายได้' : 'Booking and revenue analytics'} • {timeRangeText()}
        </p>
      </div>

      {/* Time Period Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
        {[
          { key: 'today', label: th ? '📅 วันนี้' : '📅 Today' },
          { key: 'week', label: th ? '📆 สัปดาห์นี้' : '📆 This Week' },
          { key: 'month', label: th ? '🗓️ เดือนนี้' : '🗓️ This Month' },
          { key: 'year', label: th ? '📋 ปีนี้' : '📋 This Year' },
        ].map(p => (
          <button
            key={p.key}
            onClick={() => setTimePeriod(p.key as TimePeriod)}
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              cursor: 'pointer',
              fontFamily: 'Kanit, sans-serif',
              fontSize: 13,
              fontWeight: 700,
              transition: '.2s',
              background: timePeriod === p.key ? 'linear-gradient(135deg, #D4AF37, #F5D45E)' : 'rgba(255,255,255,0.05)',
              color: timePeriod === p.key ? '#000' : '#94A3B8',
              border: timePeriod === p.key ? 'none' : '1px solid rgba(255,255,255,0.08)'
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { label: th ? 'การจองทั้งหมด' : 'Total Bookings', value: stats.totalBookings, icon: BookOpen, color: '#0ABFBC', bg: 'rgba(10,191,188,0.1)' },
          { label: th ? 'รายได้รวม' : 'Total Revenue', value: `฿${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
          { label: th ? 'อนุมัติแล้ว' : 'Approved', value: stats.approvedCount, icon: TrendingUp, color: '#D4AF37', bg: 'rgba(212,175,55,0.1)' },
          { label: th ? 'ผู้ใช้งาน' : 'Users', value: stats.uniqueUsers, icon: Users, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
        ].map(s => (
          <div key={s.label} style={{ ...C.card, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={18} color={s.color} />
              </div>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{s.label}</div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{loading ? '...' : s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 20 }}>
          {/* Bookings Chart */}
          <div style={{ ...C.card, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
              {th ? 'การจองตามวัน' : 'Bookings by Day'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="label" stroke="#94A3B8" style={{ fontSize: 12 }} />
                <YAxis stroke="#94A3B8" style={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
                  formatter={(value: any) => [value, th ? 'การจอง' : 'Bookings']}
                />
                <Bar dataKey="bookings" fill="#0ABFBC" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div style={{ ...C.card, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
              {th ? 'รายได้ตามวัน' : 'Revenue by Day'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="label" stroke="#94A3B8" style={{ fontSize: 12 }} />
                <YAxis stroke="#94A3B8" style={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
                  formatter={(value: any) => [`฿${(value as number).toLocaleString()}`, th ? 'รายได้' : 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} dot={{ fill: '#D4AF37', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          {statusData.length > 0 && (
            <div style={{ ...C.card, padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
                {th ? 'สถานะการจอง' : 'Booking Status'}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name} (${entry.value})`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => value} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Summary Table */}
          <div style={{ ...C.card, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
              {th ? 'สรุปรายการ' : 'Summary'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: th ? 'เฉลี่ยต่อวัน' : 'Average per day', value: Math.round(stats.totalBookings / (timePeriod === 'today' ? 1 : timePeriod === 'week' ? 7 : timePeriod === 'month' ? 30 : 365)) },
                { label: th ? 'รายได้เฉลี่ย' : 'Avg revenue', value: `฿${Math.round(stats.totalRevenue / Math.max(1, stats.totalBookings)).toLocaleString()}` },
                { label: th ? 'อัตราการอนุมัติ' : 'Approval rate', value: `${stats.totalBookings > 0 ? Math.round((stats.approvedCount / stats.totalBookings) * 100) : 0}%` },
                { label: th ? 'ผู้ใช้ใหม่' : 'New users', value: stats.uniqueUsers },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 13, color: '#94A3B8' }}>{item.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0ABFBC' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: 60, color: '#475569' }}>
          {th ? 'กำลังโหลด...' : 'Loading...'}
        </div>
      )}
    </div>
  )
}
