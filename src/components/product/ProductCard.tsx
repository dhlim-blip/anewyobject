'use client'

import Link from 'next/link'
import { Product } from '@/types'
import { useCartStore } from '@/lib/cart-store'

const CARD_COLORS = [
  '#d4cfc9',
  '#c5ccbb',
  '#cbbfb5',
  '#bbc6c6',
  '#d0c9b8',
  '#c0bbcc',
  '#c8c4bc',
  '#b8c4bc',
]

interface Props {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const bgColor = CARD_COLORS[index % CARD_COLORS.length]

  return (
    <div className="group relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
      {/* Solid color block */}
      <div
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]"
        style={{ backgroundColor: bgColor }}
      />

      {/* Sold out overlay */}
      {product.stock === 0 && (
        <div className="absolute inset-0 bg-white/50 z-10" />
      )}

      {/* Hover dark overlay */}
      <div className="absolute inset-0 bg-[#0b0b0b] opacity-0 group-hover:opacity-[0.08] transition-opacity duration-300 z-20" />

      {/* Clickable area */}
      <Link href={`/shop/${product.id}`} className="absolute inset-0 z-20" />

      {/* Info — always visible at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-30 pointer-events-none">
        <p className="text-[11px] font-bold tracking-[0.06em] uppercase text-[#0b0b0b] leading-[1.5]">
          {product.name}
        </p>
        <p className="text-[11px] tracking-[0.04em] text-[#0b0b0b]/50 mt-0.5">
          ₩{product.price.toLocaleString()}
        </p>
      </div>

      {/* Cart button — appears on hover */}
      <button
        onClick={() => product.stock > 0 && addItem(product)}
        disabled={product.stock === 0}
        className="absolute bottom-4 right-4 z-40 text-[10px] font-bold tracking-[0.08em] uppercase border border-[#0b0b0b] px-3 py-1 bg-white text-[#0b0b0b] hover:bg-[#0b0b0b] hover:text-white transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        {product.stock === 0 ? '품절' : '+ CART'}
      </button>
    </div>
  )
}
