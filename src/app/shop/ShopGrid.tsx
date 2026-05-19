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

// Alternate aspect ratios for visual rhythm (madebysix style)
const ASPECT_RATIOS = ['3/4', '4/5', '3/4', '4/5', '4/5', '3/4', '4/5', '3/4']

interface Props {
  products: Product[]
}

export default function ShopGrid({ products }: Props) {
  const addItem = useCartStore((s) => s.addItem)

  return (
    <div className="grid grid-cols-2 gap-x-[1px] gap-y-[1px]">
      {products.map((product, i) => {
        const bgColor = CARD_COLORS[i % CARD_COLORS.length]
        const aspectRatio = ASPECT_RATIOS[i % ASPECT_RATIOS.length]

        return (
          <div key={product.id} className="group relative overflow-hidden" style={{ aspectRatio, backgroundColor: bgColor }}>
            {/* Scale on hover */}
            <div
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]"
              style={{ backgroundColor: bgColor }}
            />

            {/* Sold out */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-white/40 z-10" />
            )}

            {/* Dark hover overlay */}
            <div className="absolute inset-0 bg-[#0b0b0b] opacity-0 group-hover:opacity-[0.08] transition-opacity duration-300 z-20" />

            {/* Full-card link */}
            <Link href={`/shop/${product.id}`} className="absolute inset-0 z-20" />

            {/* Info — bottom left */}
            <div className="absolute bottom-0 left-0 right-0 px-5 py-5 z-30 pointer-events-none">
              <p className="text-[12px] font-bold tracking-[0.05em] uppercase text-[#0b0b0b] leading-[1.4]">
                {product.name}
              </p>
              <p className="text-[11px] tracking-[0.03em] text-[#0b0b0b]/50 mt-1">
                ₩{product.price.toLocaleString()}
              </p>
            </div>

            {/* Cart button — hover only */}
            <button
              onClick={() => product.stock > 0 && addItem(product)}
              disabled={product.stock === 0}
              className="absolute bottom-5 right-5 z-40 text-[10px] font-bold tracking-[0.08em] uppercase border border-[#0b0b0b] bg-white text-[#0b0b0b] px-3 py-1.5 hover:bg-[#0b0b0b] hover:text-white transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              {product.stock === 0 ? '품절' : '+ CART'}
            </button>
          </div>
        )
      })}
    </div>
  )
}
