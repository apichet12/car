'use client'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { Users, Fuel, Settings2 } from 'lucide-react'

export interface CarData {
  _id: string
  brand: string
  model: string
  year: number
  type: string
  seats: number
  transmission: string
  fuel: string
  pricePerDay: number
  images: string[]
  isAvailable: boolean
}

export default function CarCard({ car }: { car: CarData }) {
  const locale = useLocale()

  const fuelLabel: Record<string, string> = {
    gasoline: locale === 'th' ? 'น้ำมัน' : 'Gas',
    diesel: locale === 'th' ? 'ดีเซล' : 'Diesel',
    electric: locale === 'th' ? 'ไฟฟ้า' : 'EV',
    hybrid: locale === 'th' ? 'ไฮบริด' : 'Hybrid',
  }

  return (
    <div className="card-premium" style={{ overflow: 'hidden', cursor: 'pointer' }}>
      {/* Image */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#0e0e1a' }}>
        {car.images[0] ? (
          <Image
            src={car.images[0]}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover"
            style={{ transition: '.5s' }}
            unoptimized
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>🚗</div>
        )}
        {/* Type */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
          padding: '3px 10px', borderRadius: 20, fontSize: 10,
          color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600,
        }}>{car.type}</div>
        {/* Available */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600,
          background: car.isAvailable ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
          color: car.isAvailable ? '#34D399' : '#F87171',
          border: `1px solid ${car.isAvailable ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
        }}>
          {car.isAvailable
            ? (locale === 'th' ? 'ว่าง' : 'Available')
            : (locale === 'th' ? 'ไม่ว่าง' : 'Unavailable')}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{car.brand} {car.model}</div>
            <div style={{ fontSize: 11, color: '#CBD5E1', marginTop: 3 }}>{car.year}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: '"Playfair Display",serif',
              fontSize: 19, color: '#D4AF37', fontWeight: 700,
            }}>฿{car.pricePerDay.toLocaleString()}</div>
            <div style={{ fontSize: 9, color: '#94A3B8' }}>/{locale === 'th' ? 'วัน' : 'day'}</div>
          </div>
        </div>

        {/* Specs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '10px 0' }}>
          {[
            `👥 ${car.seats}`,
            `⚙️ ${car.transmission === 'auto' ? (locale === 'th' ? 'ออโต้' : 'Auto') : (locale === 'th' ? 'ธรรมดา' : 'Manual')}`,
            `⛽ ${fuelLabel[car.fuel] || car.fuel}`,
          ].map(s => (
            <span key={s} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              padding: '3px 9px', borderRadius: 10, fontSize: 11, color: '#CBD5E1',
            }}>{s}</span>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <Link href={`/${locale}/cars/${car._id}`} style={{
            flex: 1, textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#CBD5E1', padding: '9px 0', borderRadius: 12,
            fontSize: 12, textDecoration: 'none', transition: '.3s',
            fontFamily: 'Kanit',
          }}>
            {locale === 'th' ? 'รายละเอียด' : 'Details'}
          </Link>
          {car.isAvailable && (
            <Link href={`/${locale}/booking/${car._id}`} style={{
              flex: 1, textAlign: 'center',
              background: 'linear-gradient(135deg,#D4AF37,#F5D45E)',
              color: '#000', fontWeight: 700, padding: '9px 0', borderRadius: 12,
              fontSize: 12, textDecoration: 'none', transition: '.3s',
              fontFamily: 'Kanit',
            }}>
              {locale === 'th' ? 'จองเลย' : 'Book Now'}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
