import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/product/ProductCard'
import HeroSlider, { type Slide } from '@/components/HeroSlider'
import { Product } from '@/types'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

const NAV_ITEMS = [
  { label: 'MAIN', href: '/' },
  { label: 'SHOP', href: '/shop' },
  { label: 'ABOUT', href: '/about' },
  { label: 'BOARD', href: '/board' },
]

const CATEGORIES = [
  { label: '실내식물', href: '/shop?category=indoor' },
  { label: '실외식물', href: '/shop?category=outdoor' },
  { label: '다육식물', href: '/shop?category=succulent' },
]

const SLIDE_COLORS = ['#d6d3d1', '#e7e5e4', '#c7c3c0']

export default async function Home() {
  let products: Product[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .gt('stock', 0)
      .order('created_at', { ascending: false })
      .limit(3)
    products = (data as Product[]) ?? []
  } catch {
    products = MOCK_PRODUCTS.slice(0, 3)
  }

  const slides: Slide[] = products.slice(0, 3).map((p, i) => ({
    id: p.id,
    title: p.name,
    subtitle: `₩${p.price.toLocaleString()}`,
    href: `/shop/${p.id}`,
    bgColor: SLIDE_COLORS[i % SLIDE_COLORS.length],
    bgImage: p.images[0],
  }))

  return (
    <div className="flex" style={{ minHeight: 'calc(100vh - 56px)' }}>
      {/* ── Left sidebar ── */}
      <aside className="w-44 shrink-0 border-r border-stone-200 bg-white">
        <nav className="py-8 px-6 space-y-5">
          {NAV_ITEMS.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                className="block text-sm font-semibold tracking-widest text-black hover:text-stone-500 transition-colors"
              >
                {item.label}
              </Link>
            </div>
          ))}

          <div className="pt-4 border-t border-stone-100 space-y-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="block text-xs text-stone-500 hover:text-black transition-colors tracking-wide"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Hero */}
        <div style={{ height: 'calc(100vh - 56px)', minHeight: 480, maxHeight: 720 }}>
          <HeroSlider slides={slides} />
        </div>

        {/* SHOP section */}
        <section className="px-10 py-14">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-widest text-black mb-1">SHOP</h2>
            <p className="text-sm text-stone-500">새로 입고된 식물과 화분을 소개합니다.</p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 text-stone-400 text-sm border border-dashed border-stone-200">
              상품을 준비 중입니다.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/shop"
              className="inline-block border border-black px-8 py-2.5 text-xs tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              VIEW ALL
            </Link>
          </div>
        </section>

        {/* ABOUT section */}
        <section className="border-t border-stone-100 px-10 py-14 bg-stone-50">
          <h2 className="text-2xl font-bold tracking-widest text-black mb-1">ABOUT</h2>
          <p className="text-sm text-stone-500 mb-8">anewy에 대해 소개합니다.</p>
          <p className="max-w-xl text-sm text-stone-600 leading-relaxed">
            anewy는 새로운 시각으로 바라본 식물과 화분을 소개하는 공간입니다.
            일상 속 작은 자연을 통해 당신의 공간에 생명과 이야기를 더합니다.
          </p>
          <Link
            href="/about"
            className="inline-block mt-6 text-xs tracking-widest border-b border-black pb-0.5 hover:text-stone-500 hover:border-stone-500 transition-colors"
          >
            MORE →
          </Link>
        </section>
      </div>
    </div>
  )
}
