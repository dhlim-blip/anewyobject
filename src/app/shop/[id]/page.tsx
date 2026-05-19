import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getMockProduct, MOCK_PRODUCTS } from '@/lib/mock-data'
import { Product } from '@/types'
import { formatPrice, CATEGORY_LABEL } from '@/lib/utils'
import AddToCartButton from '@/components/product/AddToCartButton'
import ProductImages from './ProductImages'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const product = await fetchProduct(id)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description?.slice(0, 120),
  }
}

async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('products').select('*').eq('id', id).single()
    if (data) return data as Product
  } catch {}
  return getMockProduct(id) ?? null
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const product = await fetchProduct(id)
  if (!product) notFound()

  return (
    <>
      {/* ── Two-column layout: images flush left, info right ── */}
      <div className="lg:grid lg:grid-cols-[55fr_45fr]" style={{ minHeight: 'calc(100vh - 56px)' }}>

        {/* LEFT: image gallery — no outer padding, touches viewport edge */}
        <div>
          <ProductImages images={product.images} name={product.name} />
        </div>

        {/* RIGHT: info panel */}
        <div className="lg:sticky lg:top-14 lg:h-[calc(100vh-56px)] lg:overflow-y-auto border-t border-stone-100 lg:border-t-0 lg:border-l">

          {/* Content area */}
          <div className="px-6 pt-8 pb-4 lg:px-10 lg:pt-9">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-stone-400 mb-7">
              <Link href="/shop" className="hover:text-stone-700 transition-colors">쇼핑하기</Link>
              <span>›</span>
              <Link
                href={`/shop?category=${product.category}`}
                className="hover:text-stone-700 transition-colors"
              >
                {CATEGORY_LABEL[product.category] ?? product.category}
              </Link>
            </nav>

            {/* Product name */}
            <h1 className="text-2xl font-light text-stone-900 leading-snug mb-2">
              {product.name}
            </h1>

            {/* Tags */}
            <div className="flex gap-2 mb-5">
              <span className="text-xs text-stone-500 border border-stone-200 px-2.5 py-1">
                {CATEGORY_LABEL[product.category] ?? product.category}
              </span>
            </div>

            {/* Price */}
            <p className="text-lg font-medium text-stone-900 mb-6">
              {formatPrice(product.price)}
            </p>

            {/* Short description (first line) */}
            {product.description && (
              <p className="text-sm text-stone-600 leading-relaxed mb-8">
                {product.description.split('\n')[0]}
              </p>
            )}

            {/* Stock indicator */}
            <div className="flex items-center gap-2 mb-6">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  product.stock > 5
                    ? 'bg-green-500'
                    : product.stock > 0
                    ? 'bg-amber-400'
                    : 'bg-red-400'
                }`}
              />
              <span className="text-xs text-stone-500">
                {product.stock > 5
                  ? '재고 있음'
                  : product.stock > 0
                  ? `잔여 ${product.stock}개`
                  : '품절'}
              </span>
            </div>

            {/* Full description */}
            {product.description && product.description.includes('\n') && (
              <details className="group mb-6">
                <summary className="flex items-center justify-between cursor-pointer text-xs tracking-widest text-stone-400 py-3 border-t border-stone-100 select-none">
                  <span>DESCRIPTION</span>
                  <svg
                    className="w-4 h-4 transition-transform group-open:rotate-180"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="text-sm text-stone-500 leading-loose whitespace-pre-wrap pt-3 pb-2">
                  {product.description}
                </p>
              </details>
            )}

            {/* Delivery accordion */}
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer text-xs tracking-widest text-stone-400 py-3 border-t border-stone-100 select-none">
                <span>DELIVERY</span>
                <svg
                  className="w-4 h-4 transition-transform group-open:rotate-180"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <ul className="pt-3 pb-2 space-y-2 text-xs text-stone-500">
                <li>— 5만원 이상 무료배송</li>
                <li>— 결제 후 1–3 영업일 내 발송</li>
                <li>— 수령 후 24시간 내 불량 교환</li>
              </ul>
            </details>

          </div>

          {/* CTA */}
          <div className="px-6 py-6 border-t border-stone-100 lg:px-10">
            <AddToCartButton product={product} />
          </div>

        </div>
      </div>

      {/* ── Related products ── */}
      <RelatedSection currentId={product.id} category={product.category} />
    </>
  )
}

async function RelatedSection({
  currentId,
  category,
}: {
  currentId: string
  category: string
}) {
  let related: Product[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .neq('id', currentId)
      .limit(4)
    related = (data as Product[]) ?? []
  } catch {
    related = MOCK_PRODUCTS.filter(
      (p) => p.category === category && p.id !== currentId
    ).slice(0, 4)
  }

  if (!related.length) return null

  return (
    <section className="px-10 py-14 border-t border-stone-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xs tracking-[0.3em] text-stone-400">YOU MAY ALSO LIKE</h2>
        <Link
          href={`/shop?category=${category}`}
          className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
        >
          전체 보기 →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((p) => (
          <Link key={p.id} href={`/shop/${p.id}`} className="group">
            <div className="relative aspect-square bg-stone-50 overflow-hidden mb-3">
              {p.images[0] ? (
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs">
                  이미지 없음
                </div>
              )}
            </div>
            <p className="text-sm text-stone-800 group-hover:text-stone-500 transition-colors">{p.name}</p>
            <p className="text-sm text-stone-400 mt-0.5">{formatPrice(p.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
