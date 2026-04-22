import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catty Car Rental',
  description: 'Premium car rental service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>
        {children}
      </body>
    </html>
  )
}