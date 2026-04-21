export default function TermsPage({ params: { locale } }: { params: { locale: string } }) {
  const th = locale === 'th'

  return (
    <div style={{ minHeight: '100vh', paddingTop: 110, background: 'transparent' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
        <div className="card-glass" style={{ padding: 40, marginBottom: 40 }}>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(32px,5vw,48px)', marginBottom: 20, color: '#111827', textAlign: 'center' }}>
            {th ? 'เงื่อนไขการใช้บริการ' : 'Terms of Service'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', marginBottom: 32 }}>
            {th ? 'อัปเดตล่าสุด: 20 เมษายน 2026' : 'Last updated: April 20, 2026'}
          </p>

          <div style={{ display: 'grid', gap: 24, color: '#374151', lineHeight: 1.7 }}>
            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                {th ? '1. การยอมรับเงื่อนไข' : '1. Acceptance of Terms'}
              </h2>
              <p>
                {th
                  ? 'การใช้บริการของเราแสดงว่าคุณยอมรับเงื่อนไขเหล่านี้ หากไม่เห็นด้วย กรุณาหยุดใช้บริการ'
                  : 'Using our services indicates your acceptance of these terms. If you disagree, please stop using the service.'
                }
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                {th ? '2. บริการที่ให้' : '2. Services Provided'}
              </h2>
              <p>
                {th
                  ? 'เราให้บริการเช่ารถยนต์และบริการเสริม เช่น ที่พักและติวเรียน ทุกบริการมีเงื่อนไขเฉพาะ'
                  : 'We provide car rental and additional services such as accommodation and tutoring. Each service has specific terms.'
                }
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                {th ? '3. การชำระเงิน' : '3. Payment'}
              </h2>
              <p>
                {th
                  ? 'การชำระเงินต้องเสร็จสิ้นก่อนใช้บริการ เรารับชำระผ่านช่องทางต่างๆ และไม่มีค่าธรรมเนียมซ่อนเร้น'
                  : 'Payment must be completed before service use. We accept various payment methods with no hidden fees.'
                }
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                {th ? '4. การยกเลิกและการคืนเงิน' : '4. Cancellation and Refunds'}
              </h2>
              <p>
                {th
                  ? 'การยกเลิกต้องแจ้งล่วงหน้า นโยบายการคืนเงินขึ้นกับระยะเวลาและเงื่อนไขเฉพาะ'
                  : 'Cancellations must be notified in advance. Refund policies depend on timing and specific conditions.'
                }
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                {th ? '5. ความรับผิดชอบ' : '5. Liability'}
              </h2>
              <p>
                {th
                  ? 'เราพยายามให้บริการที่ดีที่สุด แต่ไม่รับผิดชอบต่อความเสียหายที่เกิดจากปัจจัยภายนอก'
                  : 'We strive for the best service but are not liable for damages from external factors.'
                }
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                {th ? '6. การเปลี่ยนแปลง' : '6. Changes'}
              </h2>
              <p>
                {th
                  ? 'เราสงวนสิทธิ์เปลี่ยนแปลงเงื่อนไขได้ทุกเมื่อ การเปลี่ยนแปลงจะแจ้งให้ทราบล่วงหน้า'
                  : 'We reserve the right to change terms at any time. Changes will be notified in advance.'
                }
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}