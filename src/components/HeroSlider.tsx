'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface Slide {
  id: string
  title: string
  subtitle?: string
  href: string
  bgColor?: string
  bgImage?: string
}

const FALLBACK_SLIDES: Slide[] = [
  {
    id: 'f1',
    title: '실내 식물 컬렉션',
    subtitle: '2025.05.01(목) — 상시 운영',
    href: '/shop?category=indoor',
    bgColor: '#d6d3d1',
  },
  {
    id: 'f2',
    title: '다육식물 & 선인장',
    subtitle: '2025.05.01(목) — 상시 운영',
    href: '/shop?category=succulent',
    bgColor: '#e7e5e4',
  },
  {
    id: 'f3',
    title: '실외 정원 식물',
    subtitle: '2025.05.01(목) — 상시 운영',
    href: '/shop?category=outdoor',
    bgColor: '#c7c3c0',
  },
]

interface Props {
  slides?: Slide[]
}

export default function HeroSlider({ slides }: Props) {
  const items = slides?.length ? slides : FALLBACK_SLIDES
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const go = useCallback(
    (index: number) => {
      if (transitioning) return
      setTransitioning(true)
      setCurrent((index + items.length) % items.length)
      setTimeout(() => setTransitioning(false), 500)
    },
    [items.length, transitioning]
  )

  useEffect(() => {
    const timer = setInterval(() => go(current + 1), 5000)
    return () => clearInterval(timer)
  }, [current, go])

  const slide = items[current]

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Background */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ backgroundColor: slide.bgColor ?? '#d6d3d1' }}
      />
      {slide.bgImage && (
        <Image
          src={slide.bgImage}
          alt={slide.title}
          fill
          className="object-cover transition-opacity duration-700"
          style={{ opacity: transitioning ? 0 : 0.55 }}
          sizes="100vw"
          priority={current === 0}
        />
      )}

      {/* Text overlay */}
      <div
        className="absolute bottom-16 left-0 right-0 text-center z-10 px-6 transition-opacity duration-400"
        style={{ opacity: transitioning ? 0 : 1 }}
      >
        <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-2 text-stone-800">
          <Link href={slide.href} className="hover:underline">
            {slide.title}
          </Link>
        </h2>
        {slide.subtitle && (
          <p className="text-sm text-stone-500 tracking-wider">{slide.subtitle}</p>
        )}
      </div>

      {/* Arrows */}
      <button
        onClick={() => go(current - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors"
        aria-label="이전"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={() => go(current + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors"
        aria-label="다음"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className="h-0.5 transition-all duration-300"
            style={{
              width: i === current ? 28 : 20,
              backgroundColor: i === current ? '#78716c' : '#d6d3d1',
            }}
            aria-label={`슬라이드 ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
