'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/lib/cart-store'

const NAV = [
  { label: 'SHOP', href: '/shop' },
  { label: 'ABOUT', href: '/about' },
  { label: 'LOGIN', href: '/login' },
]

const CATEGORIES = [
  { label: '실내식물', href: '/shop?category=indoor' },
  { label: '실외식물', href: '/shop?category=outdoor' },
  { label: '다육식물', href: '/shop?category=succulent' },
]

export default function Sidebar() {
  const count = useCartStore((s) => s.totalCount())
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 h-full w-[300px] bg-white z-50 flex flex-col px-8 py-7">
      {/* Top nav */}
      <nav className="flex flex-col">
        {NAV.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`block text-[13px] font-bold tracking-[0.05em] leading-[2.4] uppercase transition-opacity duration-150 hover:opacity-40 ${
              pathname === href ? 'text-[#aaa]' : 'text-[#0b0b0b]'
            }`}
          >
            {label}
          </Link>
        ))}

      </nav>

      {/* Brand name — vertically centered */}
      <div className="flex-1 flex items-center">
        <Link
          href="/"
          className="text-[13px] tracking-[0.05em] uppercase leading-[1.8] text-[#ccc] hover:text-[#0b0b0b] transition-colors duration-200"
        >
          A NEW<br />OBJECT
        </Link>
      </div>

      {/* Bottom — CART / MY */}
      <div className="flex items-end justify-between">
        <Link
          href="/cart"
          className="text-[13px] font-bold tracking-[0.05em] uppercase text-[#0b0b0b] hover:opacity-40 transition-opacity duration-150"
        >
          CART ({count})
        </Link>
        <Link
          href="/account"
          className="text-[13px] font-bold tracking-[0.05em] uppercase text-[#0b0b0b] hover:opacity-40 transition-opacity duration-150"
        >
          MY
        </Link>
      </div>
    </aside>
  )
}
