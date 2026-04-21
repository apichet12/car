export default function FaqPage({ params: { locale } }: { params: { locale: string } }) {
  const th = locale === 'th'

  const faqs = [
    {
      question: th ? 'ฉันจองรถได้อย่างไร?' : 'How do I book a car?',
      answer: th ? 'เข้าสู่ระบบ เลือกวันที่และรถที่ต้องการ แล้วยืนยันการจอง การชำระเงินจะเสร็จสิ้นผ่านระบบ' : 'Log in, select dates and desired car, then confirm booking. Payment completes through the system.'
    },
    {
      question: th ? 'มีบริการรับส่งหรือไม่?' : 'Is pickup service available?',
      answer: th ? 'ใช่ เรามีบริการรับส่งถึงโรงแรม สนามบิน หรือสถานที่ที่คุณต้องการ เพิ่มเติมเล็กน้อย' : 'Yes, we offer pickup at hotels, airports, or your location for a small additional fee.'
    },
    {
      question: th ? 'รถมีประกันหรือไม่?' : 'Are cars insured?',
      answer: th ? 'ทุกคันมีประกันชั้น 1 รวมอยู่ในราคา แต่คุณอาจต้องรับผิดชอบค่าเสียหายส่วนแรก' : 'All cars include comprehensive insurance in the price, but you may be responsible for the first damage amount.'
    },
    {
      question: th ? 'ฉันเปลี่ยนวันจองได้ไหม?' : 'Can I change my booking dates?',
      answer: th ? 'ได้ แต่ต้องแจ้งล่วงหน้า อาจมีค่าธรรมเนียมขึ้นกับระยะเวลา' : 'Yes, but notify in advance. There may be fees depending on timing.'
    },
    {
      question: th ? 'มีบริการเสริมอะไรบ้าง?' : 'What additional services are available?',
      answer: th ? 'ที่นั่งเด็ก GPS ที่พัก และติวเรียน สามารถเลือกเพิ่มตอนจอง' : 'Child seats, GPS, accommodation, and tutoring can be added during booking.'
    },
    {
      question: th ? 'จ่ายเงินได้อย่างไร?' : 'How can I pay?',
      answer: th ? 'โอนเงินผ่านธนาคาร บัตรเครดิต หรือจ่ายสดที่จุดรับรถ' : 'Bank transfer, credit card, or cash at pickup location.'
    },
    {
      question: th ? 'มีโปรโมชั่นอะไรบ้าง?' : 'What promotions are available?',
      answer: th ? 'จองวันนี้ลด 20% จองล่วงหน้า 7 วันรับส่วนลดพิเศษ และโปรอื่นๆ อีกมาก' : 'Book today for 20% off, 7-day advance for special discounts, and more promotions.'
    },
    {
      question: th ? 'ติดต่อเราได้อย่างไร?' : 'How can I contact you?',
      answer: th ? 'โทรศัพท์ อีเมล หรือแชทบนเว็บไซต์ ทีมงานพร้อมช่วยตลอด 24/7' : 'Call, email, or chat on the website. Our team is available 24/7.'
    }
  ]

  return (
    <div style={{ minHeight: '100vh', paddingTop: 110, background: 'transparent' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
        <div className="card-glass" style={{ padding: 40, marginBottom: 40 }}>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(32px,5vw,48px)', marginBottom: 20, color: '#111827', textAlign: 'center' }}>
            {th ? 'คำถามที่พบบ่อย' : 'Frequently Asked Questions'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', marginBottom: 32 }}>
            {th ? 'คำตอบสำหรับคำถามทั่วไปเกี่ยวกับบริการของเรา' : 'Answers to common questions about our services'}
          </p>

          <div style={{ display: 'grid', gap: 16 }}>
            {faqs.map((faq, index) => (
              <div key={index} className="card-glass" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                  {faq.question}
                </h3>
                <p style={{ color: '#374151', lineHeight: 1.6 }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}