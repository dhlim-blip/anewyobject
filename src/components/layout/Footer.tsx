import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="px-10 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-stone-500">
        <div>
          <p className="font-bold text-black tracking-widest mb-3">anewy</p>
          <p className="leading-relaxed">새로운 시각으로 바라본 식물과 화분</p>
          <p className="mt-1">www.anewyobject.com</p>
        </div>
        <div>
          <p className="font-semibold text-black mb-3">고객센터</p>
          <p>hello@anewyobject.com</p>
          <p className="mt-1">평일 10:00 – 18:00</p>
        </div>
        <div>
          <p className="font-semibold text-black mb-3">정보</p>
          <div className="space-y-1.5">
            <Link href="/policy/terms" className="block hover:text-black transition-colors">이용약관</Link>
            <Link href="/policy/privacy" className="block hover:text-black transition-colors">개인정보처리방침</Link>
            <Link href="/policy/refund" className="block hover:text-black transition-colors">환불정책</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-stone-100 text-center py-4 text-xs text-stone-300">
        © 2026 anewy. All rights reserved.
      </div>
    </footer>
  )
}
