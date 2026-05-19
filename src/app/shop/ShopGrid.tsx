'use client'

import Link from 'next/link'
import { Product } from '@/types'
import { useCartStore } from '@/lib/cart-store'

const COLORS = [
  '#d4cfc9', '#c5ccbb', '#cbbfb5', '#bbc6c6',
  '#d0c9b8', '#c0bbcc', '#c8c4bc', '#b8c4bc',
]

const CATEGORY_KR: Record<string, string> = {
  indoor: '실내식물',
  outdoor: '실외식물',
  succulent: '다육식물',
}

interface Props {
  products: Product[]
}

function CardImage({ color, href, wide = false }: { color: string; href: string; wide?: boolean }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ aspectRatio: wide ? '21/9' : '3/4' }}
    >
      <div
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
        style={{ backgroundColor: color }}
      />
      <Link href={href} className="absolute inset-0 z-10" />
    </div>
  )
}

function CardInfo({ product, padX = 10 }: { product: Product; padX?: number }) {
  const addItem = useCartStore((s) => s.addItem)
  const catLabel = CATEGORY_KR[product.category] ?? product.category

  return (
    <div className={`pt-3 pb-14 flex items-start justify-between`} style={{ paddingLeft: padX * 4, paddingRight: padX * 4 }}>
      <div>
        <Link href={`/shop/${product.id}`}>
          <p className="text-[14px] tracking-[-0.02em] text-[#0b0b0b] leading-[1.4]">
            {product.name}
          </p>
        </Link>
        <p className="text-[12px] text-[#aaa] mt-1 tracking-[-0.01em]">
          {catLabel} · ₩{product.price.toLocaleString()}
        </p>
      </div>

      <button
        onClick={() => product.stock > 0 && addItem(product)}
        disabled={product.stock === 0}
        className="text-[10px] font-bold tracking-[0.07em] uppercase border border-[#0b0b0b] px-3 py-1 bg-white text-[#0b0b0b] hover:bg-[#0b0b0b] hover:text-white transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 mt-0.5"
      >
        {product.stock === 0 ? '품절' : '+ CART'}
      </button>
    </div>
  )
}

export default function ShopGrid({ products }: Props) {
  if (products.length === 0) return null

  const [first, ...rest] = products

  // Pair remaining products into rows of 2
  const pairs: Product[][] = []
  for (let i = 0; i < rest.length; i += 2) {
    pairs.push(rest.slice(i, i + 2))
  }

  return (
    <div>
      {/* First product — full width, landscape */}
      <div className="group">
        <CardImage color={COLORS[0]} href={`/shop/${first.id}`} wide />
        <CardInfo product={first} padX={10} />
      </div>

      {/* Rest — 2-column grid */}
      {pairs.map((pair, rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-2 gap-x-[1px]">
          {pair.map((product, colIdx) => {
            const colorIdx = (rowIdx * 2 + colIdx + 1) % COLORS.length
            return (
              <div key={product.id} className="group">
                <CardImage
                  color={COLORS[colorIdx]}
                  href={`/shop/${product.id}`}
                />
                <CardInfo product={product} padX={5} />
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
