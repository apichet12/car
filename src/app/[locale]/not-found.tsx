import Link from 'next/link'

export default function NotFound({
  params,
}: {
  params?: { locale?: string }
}) {
  const locale = params?.locale || 'th'

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🐱</div>
        <h1 className="text-6xl font-bold text-yellow-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-2">
          {locale === 'th' ? 'ไม่พบหน้าที่ต้องการ' : 'Page Not Found'}
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          {locale === 'th'
            ? 'หน้าที่คุณกำลังมองหาอาจถูกลบ เปลี่ยนชื่อ หรือไม่มีอยู่จริง'
            : "The page you're looking for might have been removed, renamed, or doesn't exist."}
        </p>
        <Link
          href={`/${locale}`}
          className="btn-gold inline-block"
        >
          {locale === 'th' ? '← กลับหน้าแรก' : '← Back to Home'}
        </Link>
      </div>
    </div>
  )
}
