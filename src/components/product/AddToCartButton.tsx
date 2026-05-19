'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/cart-store'
import { Product } from '@/types'

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    if (product.stock === 0) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleAdd}
        disabled={product.stock === 0}
        className="w-full py-4 bg-stone-900 text-white text-xs tracking-[0.2em] hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {product.stock === 0 ? '품절' : added ? '✓ 장바구니에 담았습니다' : '장바구니 담기'}
      </button>
      <Link
        href="/cart"
        className="block w-full py-4 border border-stone-900 text-stone-900 text-xs tracking-[0.2em] hover:bg-stone-50 transition-colors text-center"
      >
        장바구니 보기
      </Link>
    </div>
  )
}
