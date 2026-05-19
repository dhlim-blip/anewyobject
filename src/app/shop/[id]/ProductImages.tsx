'use client'

import { useState, useRef, useCallback } from 'react'

interface Props {
  images: string[]
  name: string
}

export default function ProductImages({ images, name: _name }: Props) {
  const [current, setCurrent] = useState(0)
  const count = Math.max(images.length, 1)
  const touchStartX = useRef<number | null>(null)

  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), [])
  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, count - 1)), [count])

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStartX.current
    if (start === null) return
    const dx = e.changedTouches[0].clientX - start
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
    touchStartX.current = null
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <div
          className="relative bg-stone-200"
          style={{ aspectRatio: '4 / 5' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        />

        {count > 1 && (
          <div className="flex items-center gap-3 px-5 py-4">
            <button
              onClick={prev}
              disabled={current === 0}
              className="w-9 h-9 flex items-center justify-center border border-stone-300 disabled:opacity-25 hover:border-stone-800 transition-colors"
              aria-label="이전"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={next}
              disabled={current === count - 1}
              className="w-9 h-9 flex items-center justify-center border border-stone-300 disabled:opacity-25 hover:border-stone-800 transition-colors"
              aria-label="다음"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <span className="text-xs text-stone-400 ml-1">{current + 1} / {count}</span>
          </div>
        )}
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div
          className="relative bg-stone-200"
          style={{ aspectRatio: '4 / 5' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {count > 1 && (
            <>
              <button
                onClick={prev}
                disabled={current === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-sm disabled:opacity-0 transition-opacity"
                aria-label="이전"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={next}
                disabled={current === count - 1}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-sm disabled:opacity-0 transition-opacity"
                aria-label="다음"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              <div className="absolute bottom-3 right-3 text-xs text-stone-600 bg-white/70 px-2.5 py-1 rounded-full backdrop-blur-sm">
                {current + 1} / {count}
              </div>
            </>
          )}
        </div>

        {count > 1 && (
          <div className="flex justify-center gap-1.5 py-3">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? 20 : 6,
                  height: 6,
                  backgroundColor: i === current ? '#1c1917' : '#d6d3d1',
                }}
                aria-label={`이미지 ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
