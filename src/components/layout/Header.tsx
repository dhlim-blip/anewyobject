'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { useState } from 'react'

export default function Header() {
  const count = useCartStore((s) => s.totalCount())
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      setSearchOpen(false)
      setQuery('')
      // full navigation so shop page re-fetches with new query
      window.location.assign(`/shop?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
      <div className="px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-base font-bold tracking-[0.12em] text-black"
        >
          anewy
        </Link>

        <div className="flex items-center gap-5 text-xs tracking-widest text-stone-700">
          <Link href="/login" className="hover:text-black transition-colors">
            LOGIN
          </Link>
          <Link href="/cart" className="relative hover:text-black transition-colors">
            CART
            {count > 0 && (
              <span className="absolute -top-2 -right-3 text-[10px] font-bold text-black">
                {count}
              </span>
            )}
          </Link>
          <Link href="/account" className="hover:text-black transition-colors">
            MY
          </Link>

          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-1">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-36 border-b border-stone-400 text-xs focus:outline-none focus:border-black px-1 py-0.5"
                placeholder="검색어 입력"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-stone-400 hover:text-black text-xs ml-1"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="text-stone-700 hover:text-black transition-colors"
            >
              <Search size={15} />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
