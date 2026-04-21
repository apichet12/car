'use client'
import { useTranslations, useLocale } from 'next-intl'
import { Search, X } from 'lucide-react'

export interface FilterState {
  search: string
  type: string
  seats: string
  maxPrice: string
  available: boolean
  sort: string
}

interface CarFilterProps {
  filters: FilterState
  onChange: (f: FilterState) => void
  onClear: () => void
}

export default function CarFilter({ filters, onChange, onClear }: CarFilterProps) {
  const t = useTranslations('cars')
  const locale = useLocale()

  const set = (k: keyof FilterState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => onChange({ ...filters, [k]: e.target.value })

  const toggle = (k: keyof FilterState) => () =>
    onChange({ ...filters, [k]: !filters[k as keyof FilterState] })

  const hasFilters =
    filters.search ||
    filters.type !== 'all' ||
    filters.seats !== 'all' ||
    filters.maxPrice ||
    filters.available

  return (
    <div className="card-dark p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={set('search')}
            placeholder={t('search_placeholder')}
            className="input-dark pl-9"
          />
        </div>

        {/* Type */}
        <select value={filters.type} onChange={set('type')} className="input-dark">
          <option value="all">{t('filter_type')}: {t('filter_all_types')}</option>
          {['sedan', 'suv', 'pickup', 'van', 'sport'].map((v) => (
            <option key={v} value={v} className="capitalize">
              {v.toUpperCase()}
            </option>
          ))}
        </select>

        {/* Seats */}
        <select value={filters.seats} onChange={set('seats')} className="input-dark">
          <option value="all">{t('filter_seats')}: {t('filter_all_seats')}</option>
          {['4', '5', '7', '8'].map((v) => (
            <option key={v} value={v}>{v}+ {t('seats')}</option>
          ))}
        </select>

        {/* Max Price */}
        <input
          type="number"
          value={filters.maxPrice}
          onChange={set('maxPrice')}
          placeholder={t('filter_max_price')}
          min={0}
          className="input-dark"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          {/* Available toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <button
              type="button"
              onClick={toggle('available')}
              className={`w-10 h-5 rounded-full transition-colors relative focus:outline-none ${
                filters.available ? 'bg-yellow-500' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                  filters.available ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className="text-gray-400 text-sm">{t('filter_available')}</span>
          </label>

          {hasFilters && (
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 text-gray-500 hover:text-red-400 text-sm transition-colors"
            >
              <X size={13} />
              {t('clear')}
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={set('sort')}
          className="bg-gray-800 border border-gray-700 text-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-yellow-500/50 transition-colors"
        >
          <option value="newest">{t('sort_newest')}</option>
          <option value="price_asc">{t('sort_price_asc')}</option>
          <option value="price_desc">{t('sort_price_desc')}</option>
        </select>
      </div>
    </div>
  )
}
