import Link from 'next/link'

const FRAMES = [
  {
    label: 'INDOOR',
    sub: '실내식물',
    href: '/shop?category=indoor',
    color: '#d4cfc9',
  },
  {
    label: 'OUTDOOR',
    sub: '실외식물',
    href: '/shop?category=outdoor',
    color: '#c5ccbb',
  },
  {
    label: 'SUCCULENT',
    sub: '다육식물',
    href: '/shop?category=succulent',
    color: '#cbbfb5',
  },
  {
    label: 'NEW ARRIVALS',
    sub: '신상품',
    href: '/shop',
    color: '#bbc6c6',
  },
]

export default function Home() {
  return (
    <div className="grid grid-cols-2">
      {/* Row 1 — 2 full-height frames */}
      {FRAMES.slice(0, 2).map((frame) => (
        <Link
          key={frame.href}
          href={frame.href}
          className="group relative block overflow-hidden"
          style={{ height: '100vh', backgroundColor: frame.color }}
        >
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[#0b0b0b] opacity-0 group-hover:opacity-[0.07] transition-opacity duration-300" />

          {/* Center placeholder label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-[13px] font-light tracking-[0.06em] uppercase text-[#0b0b0b]/30 select-none">
              {frame.label}
            </p>
          </div>

          {/* Bottom label */}
          <div className="absolute bottom-7 left-7">
            <p className="text-[11px] font-bold tracking-[0.07em] uppercase text-[#0b0b0b] leading-[1.6]">
              {frame.label}
            </p>
            <p className="text-[11px] tracking-[0.04em] text-[#0b0b0b]/50">
              {frame.sub}
            </p>
          </div>

          {/* Arrow on hover */}
          <div className="absolute top-7 right-7 text-[11px] font-bold tracking-[0.06em] uppercase text-[#0b0b0b] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            →
          </div>
        </Link>
      ))}

      {/* Row 2 — 2 full-height frames */}
      {FRAMES.slice(2, 4).map((frame) => (
        <Link
          key={frame.href}
          href={frame.href}
          className="group relative block overflow-hidden"
          style={{ height: '100vh', backgroundColor: frame.color }}
        >
          <div className="absolute inset-0 bg-[#0b0b0b] opacity-0 group-hover:opacity-[0.07] transition-opacity duration-300" />

          <div className="absolute bottom-7 left-7">
            <p className="text-[11px] font-bold tracking-[0.07em] uppercase text-[#0b0b0b] leading-[1.6]">
              {frame.label}
            </p>
            <p className="text-[11px] tracking-[0.04em] text-[#0b0b0b]/50">
              {frame.sub}
            </p>
          </div>

          <div className="absolute top-7 right-7 text-[11px] font-bold tracking-[0.06em] uppercase text-[#0b0b0b] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            →
          </div>
        </Link>
      ))}
    </div>
  )
}
