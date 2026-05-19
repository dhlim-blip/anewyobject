import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import MobileHeader from '@/components/layout/MobileHeader'
import Footer from '@/components/layout/Footer'
import CartHydration from '@/components/CartHydration'

const roboto = Roboto({ subsets: ['latin'], weight: ['700'] })

export const metadata: Metadata = {
  title: {
    default: 'A NEW OBJECT',
    template: '%s | A NEW OBJECT',
  },
  description: '새로운 시각으로 바라본 식물과 화분. 당신의 공간에 생명을 더하세요.',
  keywords: ['화분', '식물', '다육식물', '실내식물', '인테리어 식물'],
  metadataBase: new URL('https://www.anewyobject.com'),
  openGraph: {
    title: 'A NEW OBJECT',
    description: '새로운 시각으로 바라본 식물과 화분',
    url: 'https://www.anewyobject.com',
    siteName: 'A NEW OBJECT',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={roboto.className}>
      <body className="min-h-screen bg-white text-[#0b0b0b] antialiased">
        <CartHydration />
        <MobileHeader />
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="pt-[52px] lg:pt-0 lg:ml-[300px] flex-1 flex flex-col min-w-0">
            {children}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  )
}
