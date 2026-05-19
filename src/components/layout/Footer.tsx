import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[#e5e5e5] px-8 py-5 flex items-center justify-between mt-auto">
      <p className="text-[10px] tracking-[0.06em] uppercase text-[#bbb]">
        © 2026 A NEW OBJECT
      </p>
      <div className="flex gap-5">
        {[
          { label: '이용약관', href: '/policy/terms' },
          { label: '개인정보처리방침', href: '/policy/privacy' },
          { label: '환불정책', href: '/policy/refund' },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="text-[10px] tracking-[0.04em] uppercase text-[#bbb] hover:text-[#0b0b0b] transition-colors duration-150"
          >
            {label}
          </Link>
        ))}
      </div>
    </footer>
  )
}
