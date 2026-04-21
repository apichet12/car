export default function PrivacyPage({ params: { locale } }: { params: { locale: string } }) {
  const th = locale === 'th'

  return (
    <div style={{ minHeight: '100vh', paddingTop: 110, background: 'transparent' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px' }}>
        <div className="card-glass" style={{ padding: 40, marginBottom: 40 }}>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(32px,5vw,48px)', marginBottom: 20, color: '#111827', textAlign: 'center' }}>
            {th ? 'นโยบายความเป็นส่วนตัว' : 'Privacy Policy'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', marginBottom: 32 }}>
            {th ? 'อัปเดตล่าสุด: 20 เมษายน 2026' : 'Last updated: April 20, 2026'}
          </p>

          <div style={{ display: 'grid', gap: 24, color: '#374151', lineHeight: 1.7 }}>
            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                {th ? '1. ข้อมูลที่เราเก็บรวบรวม' : '1. Information We Collect'}
              </h2>
              <p>
                {th
                  ? 'เราเก็บรวบรวมข้อมูลส่วนบุคคลที่คุณให้แก่เราเมื่อใช้บริการ เช่น ชื่อ ที่อยู่ อีเมล และข้อมูลการชำระเงิน เพื่อให้บริการเช่ารถและบริการเสริมได้อย่างมีประสิทธิภาพ'
                  : 'We collect personal information you provide when using our services, such as name, address, email, and payment details, to efficiently provide car rental and additional services.'
                }
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                {th ? '2. วิธีการใช้ข้อมูล' : '2. How We Use Your Information'}
              </h2>
              <p>
                {th
                  ? 'ข้อมูลของคุณใช้เพื่อยืนยันการจอง จัดเตรียมบริการ และปรับปรุงประสบการณ์การใช้งาน เราจะไม่ขายหรือแบ่งปันข้อมูลกับบุคคลที่สามโดยไม่ได้รับอนุญาต'
                  : 'Your information is used to confirm bookings, prepare services, and improve user experience. We will not sell or share data with third parties without permission.'
                }
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                {th ? '3. ความปลอดภัยของข้อมูล' : '3. Data Security'}
              </h2>
              <p>
                {th
                  ? 'เราใช้มาตรการรักษาความปลอดภัยขั้นสูงเพื่อปกป้องข้อมูลของคุณ รวมถึงการเข้ารหัสและการควบคุมการเข้าถึง'
                  : 'We use advanced security measures to protect your data, including encryption and access controls.'
                }
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                {th ? '4. สิทธิ์ของคุณ' : '4. Your Rights'}
              </h2>
              <p>
                {th
                  ? 'คุณมีสิทธิ์เข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของคุณ หากมีคำถาม กรุณาติดต่อเรา'
                  : 'You have the right to access, modify, or delete your personal data. If you have questions, please contact us.'
                }
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                {th ? '5. การเปลี่ยนแปลงนโยบาย' : '5. Policy Changes'}
              </h2>
              <p>
                {th
                  ? 'เราอาจปรับปรุงนโยบายนี้เป็นครั้งคราว การเปลี่ยนแปลงจะประกาศบนเว็บไซต์ของเรา'
                  : 'We may update this policy from time to time. Changes will be announced on our website.'
                }
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}