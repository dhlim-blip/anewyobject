import { createClient } from '@/lib/supabase/server'
import { Product } from '@/types'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import ShopGrid from './ShopGrid'

interface Props {
  searchParams: Promise<{ category?: string; q?: string }>
}

const CATEGORY_LABELS: Record<string, string> = {
  indoor: '실내식물',
  outdoor: '실외식물',
  succulent: '다육식물',
}

export default async function ShopPage({ searchParams }: Props) {
  const { category, q } = await searchParams
  let products: Product[] = []

  try {
    const supabase = await createClient()
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (category && category !== 'all') query = query.eq('category', category)
    if (q) query = query.ilike('name', `%${q}%`)
    const { data } = await query
    const fetched = (data as Product[]) ?? []
    if (fetched.length > 0) {
      products = fetched
    } else {
      let mock = MOCK_PRODUCTS
      if (category && category !== 'all') mock = mock.filter((p) => p.category === category)
      if (q) mock = mock.filter((p) => p.name.includes(q))
      products = mock
    }
  } catch {
    let mock = MOCK_PRODUCTS
    if (category && category !== 'all') mock = mock.filter((p) => p.category === category)
    if (q) mock = mock.filter((p) => p.name.includes(q))
    products = mock
  }

  const currentLabel = category ? (CATEGORY_LABELS[category] ?? 'SHOP') : 'SHOP'

  return (
    <div className="min-h-screen">
      {/* Page title row */}
      <div className="flex items-baseline justify-between px-5 lg:px-10 pt-6 lg:pt-8 pb-6 lg:pb-8 border-b border-[#e5e5e5]">
        <h1 className="text-[13px] font-bold tracking-[0.06em] uppercase text-[#0b0b0b]">
          {currentLabel}
        </h1>
        <p className="text-[11px] tracking-[0.05em] uppercase text-[#aaa]">
          {products.length} ITEMS
        </p>
      </div>

      {/* Product grid */}
      {products.length === 0 ? (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-[11px] tracking-[0.06em] uppercase text-[#aaa]">
            상품이 없습니다.
          </p>
        </div>
      ) : (
        <ShopGrid products={products} />
      )}
    </div>
  )
}
