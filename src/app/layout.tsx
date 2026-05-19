import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartHydration from '@/components/CartHydration'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'anewy',
    template: '%s | anewy',
  },
  description: '새로운 시각으로 바라본 식물과 화분. 당신의 공간에 생명을 더하세요.',
  keywords: ['화분', '식물', '다육식물', '실내식물', '인테리어 식물'],
  metadataBase: new URL('https://www.anewyobject.com'),
  openGraph: {
    title: 'anewy',
    description: '새로운 시각으로 바라본 식물과 화분',
    url: 'https://www.anewyobject.com',
    siteName: 'anewy',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={geist.variable}>
      <body className="min-h-screen flex flex-col bg-white text-stone-900 antialiased">
        <CartHydration />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
