// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── USERS ──────────────────────────────────────────────
  const adminPw = await bcrypt.hash('admin123', 12)
  const userPw = await bcrypt.hash('user123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@catty.com' },
    update: {},
    create: {
      name: 'Admin Catty',
      email: 'admin@catty.com',
      password: adminPw,
      phone: '081-000-0000',
      role: 'ADMIN',
      bio: 'ผู้ดูแลระบบ Catty Car Rental',
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@catty.com' },
    update: {},
    create: {
      name: 'สมชาย ใจดี',
      email: 'user@catty.com',
      password: userPw,
      phone: '081-111-1111',
      role: 'USER',
      bio: 'ลูกค้าประจำ Catty Car Rental',
    },
  })

  console.log('✅ Users created')

  // ── CARS ───────────────────────────────────────────────
  const carsData = [
    { brand: 'Toyota', model: 'Camry', year: 2023, type: 'sedan', seats: 5, transmission: 'auto', fuel: 'gasoline', pricePerDay: 1200, plateNumber: 'กก 1234', images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80'], features: ['GPS','Bluetooth','Reverse Camera'], descTh: 'โตโยต้า แคมรี่ รถเก๋งหรู สะดวกสบาย', descEn: 'Toyota Camry luxury sedan, comfortable for any occasion' },
    { brand: 'Honda', model: 'CR-V', year: 2023, type: 'suv', seats: 7, transmission: 'auto', fuel: 'gasoline', pricePerDay: 1800, plateNumber: 'ขข 5678', images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80'], features: ['GPS','Bluetooth','7 Seats','Android Auto'], descTh: 'ฮอนด้า CR-V SUV 7 ที่นั่ง เหมาะสำหรับครอบครัว', descEn: 'Honda CR-V 7-seater SUV, perfect for families' },
    { brand: 'BMW', model: '3 Series', year: 2022, type: 'sedan', seats: 5, transmission: 'auto', fuel: 'gasoline', pricePerDay: 3500, plateNumber: 'คค 9012', images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80'], features: ['GPS','Premium Sound','Heated Seats','Panoramic Roof'], descTh: 'BMW 3 Series รถหรูระดับพรีเมียม ขับขี่สนุก', descEn: 'BMW 3 Series premium luxury with thrilling drive' },
    { brand: 'Ford', model: 'Ranger', year: 2023, type: 'pickup', seats: 5, transmission: 'auto', fuel: 'diesel', pricePerDay: 1500, plateNumber: 'งง 3456', images: ['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80'], features: ['4WD','GPS','Towing Package'], descTh: 'ฟอร์ด เรนเจอร์ กระบะขับเคลื่อน 4 ล้อ', descEn: 'Ford Ranger 4WD pickup, tough and capable', isAvailable: false },
    { brand: 'Toyota', model: 'HiAce', year: 2022, type: 'van', seats: 12, transmission: 'manual', fuel: 'diesel', pricePerDay: 2200, plateNumber: 'จจ 7890', images: ['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80'], features: ['12 Seats','A/C','GPS'], descTh: 'โตโยต้า ไฮเอซ 12 ที่นั่ง เหมาะสำหรับกรุ๊ปทัวร์', descEn: 'Toyota HiAce 12-seater van for group tours' },
    { brand: 'MG', model: 'ZS EV', year: 2023, type: 'suv', seats: 5, transmission: 'auto', fuel: 'electric', pricePerDay: 1600, plateNumber: 'ฉฉ 2345', images: ['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80'], features: ['EV','Fast Charge','ADAS','GPS'], descTh: 'MG ZS EV รถยนต์ไฟฟ้า 100% ประหยัด', descEn: 'MG ZS EV 100% electric, eco-friendly' },
    { brand: 'Mercedes', model: 'GLE', year: 2023, type: 'suv', seats: 5, transmission: 'auto', fuel: 'gasoline', pricePerDay: 4500, plateNumber: 'ชช 6789', images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80'], features: ['AMG Package','Burmester Sound','Head-Up Display'], descTh: 'Mercedes GLE SUV หรูหราระดับสูง', descEn: 'Mercedes GLE luxury SUV, top-tier experience' },
    { brand: 'Lamborghini', model: 'Huracan', year: 2022, type: 'sport', seats: 2, transmission: 'auto', fuel: 'gasoline', pricePerDay: 15000, plateNumber: 'ญญ 0001', images: ['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80'], features: ['V10 Engine','Carbon Fiber','Track Mode'], descTh: 'ลัมโบร์กีนี่ ฮูราคัน สปอร์ตคาร์สุดหรู', descEn: 'Lamborghini Huracan ultimate sports car experience' },
  ]

  for (const car of carsData) {
    await prisma.car.upsert({
      where: { plateNumber: car.plateNumber },
      update: {},
      create: {
        brand: car.brand, model: car.model, year: car.year,
        type: car.type, seats: car.seats, transmission: car.transmission,
        fuel: car.fuel, pricePerDay: car.pricePerDay,
        plateNumber: car.plateNumber, images: car.images,
        features: car.features, descTh: car.descTh, descEn: car.descEn,
        isAvailable: car.isAvailable !== false,
      },
    })
  }
  console.log('✅ Cars created:', carsData.length)

  // ── SERVICES ───────────────────────────────────────────
  const services = [
    // ที่พัก
    { category: 'ACCOMMODATION', name: 'Budget Room', nameTh: 'ห้องพักราคาประหยัด', description: 'Air-conditioned room, WiFi, daily cleaning', descTh: 'ห้องแอร์ วาย-ไฟ ทำความสะอาดทุกวัน', price: 500, unit: 'คืน', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=70' },
    { category: 'ACCOMMODATION', name: 'Superior Room', nameTh: 'ห้องซูพีเรียร์', description: 'Sea view, king bed, balcony', descTh: 'วิวทะเล เตียงคู่ ระเบียง', price: 1200, unit: 'คืน', image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&q=70' },
    { category: 'ACCOMMODATION', name: 'Pool Villa', nameTh: 'วิลล่าส่วนตัว (สระว่ายน้ำ)', description: 'Private pool, 2 bedrooms, full facilities', descTh: 'สระว่ายน้ำส่วนตัว 2 ห้องนอน สิ่งอำนวยความสะดวกครบ', price: 3500, unit: 'คืน', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&q=70' },
    // สักปาก / เสริมสวย
    { category: 'BEAUTY', name: 'Lip Tattoo', nameTh: 'สักปาก (Semi-permanent)', description: 'Natural lip color, lasts 1-2 years', descTh: 'ออกแบบสีปากธรรมชาติ ติดทนนาน 1-2 ปี', price: 2500, unit: 'ครั้ง', image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&q=70' },
    { category: 'BEAUTY', name: 'Eyebrow Tattoo', nameTh: 'สักคิ้ว (6D Nano)', description: '6D nano blade technique, natural look', descTh: 'เทคนิค 6D นาโน ดูเป็นธรรมชาติ', price: 3000, unit: 'ครั้ง', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=70' },
    { category: 'BEAUTY', name: 'Eyelash Extension', nameTh: 'ต่อขนตา', description: 'Silk lash extension, full set', descTh: 'ต่อขนตาไหม เต็มเส้น ดูเป็นธรรมชาติ', price: 800, unit: 'ครั้ง', image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&q=70' },
    { category: 'BEAUTY', name: 'Hair Treatment', nameTh: 'ทำผม (Keratin)', description: 'Keratin treatment, smooth & shiny', descTh: 'เคราตินทำให้ผมนุ่มลื่นเงางาม', price: 1500, unit: 'ครั้ง', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=70' },
    // ติวเรียน
    { category: 'TUTORING', name: 'Chemistry Tutoring', nameTh: 'ติวเคมี', description: 'High school chemistry, all levels', descTh: 'ติวเคมีระดับ ม.ต้น - ม.ปลาย ทุกระดับ', price: 400, unit: 'ชั่วโมง', image: 'https://images.unsplash.com/photo-1532094349884-543559ac98ac?w=400&q=70' },
    { category: 'TUTORING', name: 'Mathematics Tutoring', nameTh: 'ติวคณิตศาสตร์', description: 'Math, calculus, statistics', descTh: 'คณิตศาสตร์ แคลคูลัส สถิติ ม.ต้น - ม.ปลาย', price: 400, unit: 'ชั่วโมง', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=70' },
    { category: 'TUTORING', name: 'Physics Tutoring', nameTh: 'ติวฟิสิกส์', description: 'Mechanics, electricity, waves', descTh: 'กลศาสตร์ ไฟฟ้า คลื่น ฟิสิกส์ทุกเรื่อง', price: 450, unit: 'ชั่วโมง', image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&q=70' },
    { category: 'TUTORING', name: 'Science Tutoring', nameTh: 'ติววิทยาศาสตร์', description: 'Biology, Earth science, environment', descTh: 'ชีววิทยา วิทยาศาสตร์โลก สิ่งแวดล้อม', price: 380, unit: 'ชั่วโมง', image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&q=70' },
    { category: 'TUTORING', name: 'ONET/GAT/PAT Package', nameTh: 'แพ็กเกจ ONET/GAT/PAT', description: 'Complete exam prep package', descTh: 'ติวครบทุกวิชา เตรียมสอบ ONET GAT PAT', price: 8000, unit: 'แพ็กเกจ', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=70' },
  ]

  for (const s of services) {
    await prisma.service.create({ data: { ...s, category: s.category } }).catch(() => {})
  }
  console.log('✅ Services created:', services.length)

  // ── SAMPLE BOOKING ─────────────────────────────────────
  const firstCar = await prisma.car.findFirst()
  if (firstCar) {
    await prisma.booking.create({
      data: {
        userId: user.id, carId: firstCar.id,
        pickupDate: new Date('2025-05-01'), returnDate: new Date('2025-05-04'),
        totalDays: 3, totalPrice: firstCar.pricePerDay * 3,
        status: 'APPROVED', paymentMethod: 'PROMPTPAY', paymentStatus: 'PAID',
        slipImage: null,
      },
    }).catch(() => {})
  }

  console.log('\n✅ Seed complete!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Admin: admin@catty.com / admin123')
  console.log('User:  user@catty.com  / user123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
