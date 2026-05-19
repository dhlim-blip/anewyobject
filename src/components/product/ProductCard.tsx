'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'
import { useCartStore } from '@/lib/cart-store'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem)

  return (
    <div className="group">
      <Link href={`/shop/${product.id}`}>
        <div className="relative aspect-square bg-stone-100 overflow-hidden mb-3">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-stone-200" />
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-stone-500 text-sm font-medium">품절</span>
            </div>
          )}
        </div>
        <p className="text-sm text-stone-800 font-medium">{product.name}</p>
        <p className="text-sm text-stone-500 mt-0.5">{product.price.toLocaleString()}원</p>
      </Link>
      <button
        onClick={() => product.stock > 0 && addItem(product)}
        disabled={product.stock === 0}
        className="mt-2 w-full text-xs py-2 border border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {product.stock === 0 ? '품절' : '장바구니 담기'}
      </button>
    </div>
  )
}
