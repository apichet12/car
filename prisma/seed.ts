import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Admin
  const adminPw = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@catty.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@catty.com',
      password: adminPw,
      phone: '0812345678',
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin:', admin.email)

  // User
  const userPw = await bcrypt.hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@catty.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'user@catty.com',
      password: userPw,
      phone: '0898765432',
      role: 'USER',
    },
  })

  console.log('✅ User:', user.email)

  // Cars
  const sampleCars = [
    {
      brand: 'Toyota',
      model: 'Camry',
      year: 2023,
      type: 'sedan',
      seats: 5,
      transmission: 'auto',
      fuel: 'gasoline',
      pricePerDay: 1200,
      plateNumber: 'กก 1234',
      isAvailable: true,
      features: '["GPS","Bluetooth","Reverse Camera","Sunroof"]',
      description: '{"text": "Toyota Camry luxury sedan"}',
      images: '["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"]',
    },
    {
      brand: 'Honda',
      model: 'CR-V',
      year: 2023,
      type: 'suv',
      seats: 7,
      transmission: 'auto',
      fuel: 'gasoline',
      pricePerDay: 1800,
      plateNumber: 'ขข 5678',
      isAvailable: true,
      features: '["GPS","Bluetooth","7 Seats","Android Auto"]',
      description: '{"text": "Honda CR-V family SUV"}',
      images: '["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"]',
    },
    {
      brand: 'Ford',
      model: 'Ranger',
      year: 2023,
      type: 'pickup',
      seats: 5,
      transmission: 'auto',
      fuel: 'diesel',
      pricePerDay: 1500,
      plateNumber: 'คค 9012',
      isAvailable: true,
      features: '["4WD","GPS","Towing Package"]',
      description: '{"text": "Ford Ranger 4WD pickup"}',
      images: '["https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800"]',
    },
  ]

  for (const car of sampleCars) {
    await prisma.car.upsert({
      where: { plateNumber: car.plateNumber },
      update: {},
      create: car,
    })
  }

  console.log('✅ Seed complete!')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })