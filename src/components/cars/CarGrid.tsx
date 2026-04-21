'use client'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import CarCard, { CarData } from './CarCard'
import { SkeletonCard } from '@/components/ui/Spinner'

interface CarGridProps {
  cars: CarData[]
  loading?: boolean
  emptyTitle?: string
  emptyDesc?: string
  cols?: 2 | 3 | 4
}

export default function CarGrid({
  cars,
  loading = false,
  emptyTitle,
  emptyDesc,
  cols = 4,
}: CarGridProps) {
  const t = useTranslations('cars')
  const locale = useLocale()

  const gridClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[cols]

  if (loading) {
    return (
      <div className={`grid ${gridClass} gap-6`}>
        {[...Array(8)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (cars.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🚗</div>
        <h3 className="text-gray-400 text-lg font-medium mb-2">
          {emptyTitle || t('no_cars')}
        </h3>
        {emptyDesc && <p className="text-gray-600 text-sm mb-6">{emptyDesc}</p>}
        <Link href={`/${locale}/cars`} className="btn-outline-gold text-sm">
          {t('title')}
        </Link>
      </div>
    )
  }

  return (
    <div className={`grid ${gridClass} gap-6`}>
      {cars.map((car) => (
        <CarCard key={car._id} car={car} />
      ))}
    </div>
  )
}
