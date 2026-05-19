'use client'

import Link from 'next/link'
import { Product } from '@/types'
import { useCartStore } from '@/lib/cart-store'

const COLORS = [
  '#d4cfc9', '#c5ccbb', '#cbbfb5', '#bbc6c6',
  '#d0c9b8', '#c0bbcc', '#c8c4bc', '#b8c4bc',
  '#cac4ba', '#b8c8b8', '#c4bcc0', '#d0ccc0',
]

const CATEGORY_KR: Record<string, string> = {
  indoor: '실내식물',
  outdoor: '실외식물',
  succulent: '다육식물',
}

type Pattern = 'full' | 'two-equal' | 'left-wide' | 'right-wide' | 'three-col'

const PATTERNS: { type: Pattern; count: number }[] = [
  { type: 'full',       count: 1 },
  { type: 'two-equal',  count: 2 },
  { type: 'left-wide',  count: 2 },
  { type: 'two-equal',  count: 2 },
  { type: 'full',       count: 1 },
  { type: 'right-wide', count: 2 },
  { type: 'three-col',  count: 3 },
  { type: 'two-equal',  count: 2 },
  { type: 'right-wide', count: 2 },
  { type: 'full',       count: 1 },
  { type: 'three-col',  count: 3 },
  { type: 'left-wide',  count: 2 },
]

const RATIOS: Record<string, string> = {
  full:   '16/7',
  wide:   '16/9',
  narrow: '3/4',
  equal:  '4/5',
  small:  '4/5',
}

interface CardProps {
  product: Product
  color: string
  ratio: string
  mobile?: boolean
  onAddToCart: () => void
}

function Card({ product, color, ratio, mobile, onAddToCart }: CardProps) {
  return (
    <div className="group">
      <div className="relative overflow-hidden" style={{ aspectRatio: mobile ? '4/3' : ratio }}>
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          style={{ backgroundColor: color }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-[5]">
          <p
            className="text-center px-8 leading-[1.2] font-light tracking-[-0.02em] select-none"
            style={{
              fontSize: mobile ? '16px' : 'clamp(13px, 2vw, 24px)',
              color: 'rgba(0,0,0,0.22)',
            }}
          >
            {product.name}
          </p>
          <p
            className="mt-2 tracking-[0.04em] select-none"
            style={{ fontSize: mobile ? '12px' : 'clamp(11px, 1vw, 12px)', color: 'rgba(0,0,0,0.15)' }}
          >
            ₩{product.price.toLocaleString()}
          </p>
        </div>
        <Link href={`/shop/${product.id}`} className="absolute inset-0 z-10" />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/40 z-20 pointer-events-none" />
        )}
      </div>

      {/* Text below frame */}
      {mobile ? (
        <div className="pt-4 pb-10 px-1">
          <Link href={`/shop/${product.id}`}>
            <p className="text-[18px] font-bold leading-[1.2] text-[#0b0b0b] tracking-[-0.02em]">
              {product.name}
            </p>
          </Link>
          <p className="text-[12px] text-[#aaa] mt-2 tracking-[0.01em]">
            {CATEGORY_KR[product.category] ?? product.category}
          </p>
          <p className="text-[13px] text-[#0b0b0b] mt-1 font-bold">
            ₩{product.price.toLocaleString()}
          </p>
        </div>
      ) : (
        <div className="pt-4 pb-14 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href={`/shop/${product.id}`}>
              <p className="text-[13px] tracking-[-0.01em] text-[#0b0b0b] leading-[1.4]">
                {product.name}
              </p>
            </Link>
            <p className="text-[11px] text-[#bbb] mt-1 tracking-[0.01em]">
              {CATEGORY_KR[product.category] ?? product.category} · ₩{product.price.toLocaleString()}
            </p>
          </div>

          <button
            onClick={onAddToCart}
            disabled={product.stock === 0}
            className="shrink-0 text-[10px] font-bold tracking-[0.07em] uppercase border border-[#0b0b0b] bg-white text-[#0b0b0b] px-3 py-1 mt-0.5 hover:bg-[#0b0b0b] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ opacity: 0, transition: 'opacity 0.2s, background-color 0.15s, color 0.15s' }}
            ref={(el) => {
              if (!el) return
              const card = el.closest('.group')
              if (!card) return
              const show = () => { el.style.opacity = '1' }
              const hide = () => { el.style.opacity = '0' }
              card.addEventListener('mouseenter', show)
              card.addEventListener('mouseleave', hide)
            }}
          >
            {product.stock === 0 ? '품절' : '+ CART'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function ShopGrid({ products }: { products: Product[] }) {
  const addItem = useCartStore((s) => s.addItem)

  const blocks: { pattern: Pattern; slice: Product[]; offset: number }[] = []
  let offset = 0
  let pi = 0

  while (offset < products.length) {
    const { type, count } = PATTERNS[pi % PATTERNS.length]
    const slice = products.slice(offset, offset + count)
    if (slice.length === 0) break
    blocks.push({ pattern: type, slice, offset })
    offset += slice.length
    pi++
  }

  const col = (i: number, baseOffset: number) => COLORS[(baseOffset + i) % COLORS.length]

  return (
    <>
      {/* Mobile: single column full-width */}
      <div className="lg:hidden px-5 pt-6">
        {products.map((p, i) => (
          <Card
            key={p.id}
            product={p}
            color={col(i, 0)}
            ratio="4/3"
            mobile
            onAddToCart={() => p.stock > 0 && addItem(p)}
          />
        ))}
      </div>

      {/* Desktop: pattern grid */}
      <div className="hidden lg:block px-10 pt-10">
        {blocks.map((block, bi) => {
          const card = (p: Product, i: number, ratio: string) => (
            <Card
              key={p.id}
              product={p}
              color={col(i, block.offset)}
              ratio={ratio}
              onAddToCart={() => p.stock > 0 && addItem(p)}
            />
          )

          switch (block.pattern) {
            case 'full':
              return <div key={bi}>{card(block.slice[0], 0, RATIOS.full)}</div>

            case 'two-equal':
              return (
                <div key={bi} className="grid grid-cols-2 gap-x-8">
                  {block.slice.map((p, i) => <div key={p.id}>{card(p, i, RATIOS.equal)}</div>)}
                </div>
              )

            case 'left-wide':
              return (
                <div key={bi} className="grid grid-cols-3 gap-x-8">
                  <div className="col-span-2">{card(block.slice[0], 0, RATIOS.wide)}</div>
                  {block.slice[1] && <div className="col-span-1">{card(block.slice[1], 1, RATIOS.narrow)}</div>}
                </div>
              )

            case 'right-wide':
              return (
                <div key={bi} className="grid grid-cols-3 gap-x-8">
                  {block.slice[0] && <div className="col-span-1">{card(block.slice[0], 0, RATIOS.narrow)}</div>}
                  {block.slice[1] && <div className="col-span-2">{card(block.slice[1], 1, RATIOS.wide)}</div>}
                </div>
              )

            case 'three-col':
              return (
                <div key={bi} className="grid grid-cols-3 gap-x-8">
                  {block.slice.map((p, i) => <div key={p.id}>{card(p, i, RATIOS.small)}</div>)}
                </div>
              )

            default:
              return null
          }
        })}
      </div>
    </>
  )
}
