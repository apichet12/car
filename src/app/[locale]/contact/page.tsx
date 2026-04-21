import Link from 'next/link'

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  const th = locale === 'th'
  const contacts = [
    { icon: '💚', label: 'LINE Official', value: '@cattycar', href: 'https://line.me/R/ti/p/@cattycar', color: '#22C55E' },
    { icon: '💙', label: 'Facebook', value: 'CattyCarRental', href: 'https://facebook.com', color: '#3B82F6' },
    { icon: '📞', label: th ? 'โทรศัพท์' : 'Phone', value: '081-234-5678', href: 'tel:0812345678', color: '#D4AF37' },
    { icon: '📍', label: th ? 'ที่ตั้ง' : 'Location', value: th ? 'ภูเก็ต, ไทย' : 'Phuket, Thailand', href: 'https://maps.google.com/?q=Phuket+Thailand', color: '#EF4444' },
    { icon: '🕐', label: th ? 'เวลาทำการ' : 'Hours', value: th ? 'ทุกวัน 07:00–22:00' : 'Daily 07:00–22:00', href: null, color: '#8B5CF6' },
  ]
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', paddingTop: 90, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48, paddingTop: 20 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(10,191,188,0.1)', border: '1px solid rgba(10,191,188,0.25)', padding: '5px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#0ABFBC', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 }}>
            📞 {th ? 'ติดต่อเรา' : 'Contact Us'}
          </div>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(28px,5vw,48px)', fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            {th ? 'พร้อมช่วยเหลือ' : 'Here to Help'}
            <span style={{ display: 'block', background: 'linear-gradient(135deg,#FF6B9D,#D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {th ? 'ตลอด 24 ชั่วโมง' : '24 Hours a Day'}
            </span>
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 40 }}>
          {contacts.map(c => (
            <div key={c.label} className="bg-[#16162A] border border-white/7 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-opacity-40" style={{ borderColor: `${c.color}40` }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${c.color}15`, border: `1px solid ${c.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>{c.icon}</div>
              <div style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{c.label}</div>
              {c.href ? (
                <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ color: c.color, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>{c.value}</a>
              ) : (
                <div style={{ color: c.color, fontWeight: 600, fontSize: 14 }}>{c.value}</div>
              )}
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={{ background: '#16162A', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 20, padding: 28, display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Link href={`/${locale}/cars`} className="btn-gold" style={{ textDecoration: 'none' }}>🚗 {th ? 'ดูรถทั้งหมด' : 'Browse Cars'}</Link>
          <Link href={`/${locale}/services`} className="btn-teal" style={{ textDecoration: 'none' }}>✨ {th ? 'บริการเสริม' : 'Services'}</Link>
          <Link href={`/${locale}/auth/register`} className="btn-outline" style={{ textDecoration: 'none' }}>👤 {th ? 'สมัครสมาชิก' : 'Register'}</Link>
        </div>

        {/* Map */}
        <div style={{ marginTop: 32, background: '#16162A', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>📍 {th ? 'แผนที่' : 'Map'}</div>
          </div>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125363.4!2d98.2764!3d7.8804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30502da67cf05c37%3A0x6d0c58e7c4bae3f!2sPhuket!5e0!3m2!1sen!2sth!4v1"
            width="100%" height="300" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)', display: 'block' }}
            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map" />
        </div>
      </div>
    </div>
  )
}
