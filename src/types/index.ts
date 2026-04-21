// ===== User Types =====
export interface UserPublic {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  phone?: string
  avatar?: string
  createdAt?: string
}

// ===== Car Types =====
export type CarType = 'sedan' | 'suv' | 'pickup' | 'van' | 'sport'
export type TransmissionType = 'auto' | 'manual'
export type FuelType = 'gasoline' | 'diesel' | 'electric' | 'hybrid'

export interface Car {
  id: number
  brand: string
  model: string
  year: number
  type: CarType
  seats: number
  transmission: TransmissionType
  fuel: FuelType
  pricePerDay: number
  images: string[]
  description: { th: string; en: string }
  features: string[]
  isAvailable: boolean
  plateNumber: string
  createdAt: string
}

// ===== Booking Types =====
export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed'

export interface Booking {
  id: number
  user: UserPublic | string
  car: Car | string
  pickupDate: string
  returnDate: string
  totalDays: number
  totalPrice: number
  status: BookingStatus
  slipImage: string
  adminNote?: string
  createdAt: string
}

// ===== API Response Types =====
export interface ApiResponse<T = unknown> {
  success?: boolean
  error?: string
  data?: T
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

// ===== Chat Types =====
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
