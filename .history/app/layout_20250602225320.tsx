import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vaatwasstrips Vergelijker Nederland - Beste Prijzen 2024',
  description: 'Vergelijk vaatwasstrips van alle Nederlandse aanbieders. Bespaar tot 75% op je afwas met milieuvriendelijke alternatieven.',
  keywords: 'vaatwasstrips, vergelijken, nederland, prijs, milieuvriendelijk',
  openGraph: {
    title: 'Vaatwasstrips Vergelijker Nederland',
    description: 'De meest complete vergelijking van vaatwasstrips',
    images: ['/og-image.jpg']
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className={inter.className}>{children}</body>
    </html>
  )
}