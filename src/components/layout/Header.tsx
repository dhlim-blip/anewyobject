'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/cart-store'

const NAV = [
  { label: 'ABOUT', href: '/about' },
  { label: 'SHOP', href: '/shop' },
  { label: 'LOGIN', href: '/login' },
  { label: 'CART', href: '/cart' },
  { label: 'MY', href: '/account' },
]

export default function Header() {
  const count = useCartStore((s) => s.totalCount())

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-[#0b0b0b] h-[52px] flex items-center justify-between px-10">
      <Link
        href="/"
        className="text-[15px] font-normal tracking-[-0.03em] text-[#0b0b0b] leading-none hover:opacity-40 transition-opacity duration-200"
      >
        anewy
      </Link>

      <nav className="flex items-center gap-[22px]">
        {NAV.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="text-[13px] tracking-[-0.02em] text-[#0b0b0b] leading-none hover:opacity-40 transition-opacity duration-200"
          >
            {label === 'CART' && count > 0 ? `CART (${count})` : label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
