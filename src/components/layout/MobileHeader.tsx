'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/lib/cart-store'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { label: 'HOME', href: '/' },
  { label: 'SHOP', href: '/shop' },
  { label: 'ABOUT', href: '/about' },
  { label: 'LOGIN', href: '/login' },
]

export default function MobileHeader() {
  const [open, setOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const count = useCartStore((s) => s.totalCount())
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white flex items-center justify-between px-6 h-[52px] border-b border-[#f0f0f0]">
        <button
          onClick={() => setOpen(true)}
          className="text-[11px] font-bold tracking-[0.07em] uppercase text-[#0b0b0b]"
        >
          MENU
        </button>
        <Link
          href="/"
          className="text-[12px] tracking-[0.06em] uppercase text-[#0b0b0b] font-bold"
        >
          A NEW OBJECT
        </Link>
        {loggedIn ? (
          <Link
            href="/cart"
            className="text-[11px] font-bold tracking-[0.06em] uppercase text-[#0b0b0b]"
          >
            CART ({count})
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-[11px] font-bold tracking-[0.06em] uppercase text-[#0b0b0b]"
          >
            LOGIN
          </Link>
        )}
      </header>

      {/* Drawer overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-[60] bg-black/20"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-[260px] bg-white z-[70] flex flex-col px-8 py-7 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          onClick={() => setOpen(false)}
          className="self-end text-[11px] font-bold tracking-[0.07em] uppercase text-[#0b0b0b] mb-8"
        >
          CLOSE
        </button>
        <nav className="flex flex-col">
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`block text-[13px] font-bold tracking-[0.05em] leading-[2.6] uppercase transition-opacity duration-150 hover:opacity-40 ${
                pathname === href ? 'text-[#aaa]' : 'text-[#0b0b0b]'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex-1 flex items-end pb-4">
          {loggedIn ? (
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="text-[13px] font-bold tracking-[0.05em] uppercase text-[#0b0b0b] hover:opacity-40 transition-opacity duration-150"
            >
              CART ({count})
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="text-[13px] font-bold tracking-[0.05em] uppercase text-[#0b0b0b] hover:opacity-40 transition-opacity duration-150"
            >
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
