import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types";
import { CATEGORY_LABEL } from "@/lib/utils";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

interface Props {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ShopPage({ searchParams }: Props) {
  const { category, q } = await searchParams;
  let products: Product[] = [];

  try {
    const supabase = await createClient();
    let query = supabase.from("products").select("*").order("created_at", { ascending: false });
    if (category && category !== "all") query = query.eq("category", category);
    if (q) query = query.ilike("name", `%${q}%`);
    const { data } = await query;
    products = (data as Product[]) ?? [];
  } catch {
    let mock = MOCK_PRODUCTS
    if (category && category !== "all") mock = mock.filter((p) => p.category === category)
    if (q) mock = mock.filter((p) => p.name.includes(q))
    products = mock
  }

  const categories = ["all", "indoor", "outdoor", "succulent"];

  const currentLabel = category ? CATEGORY_LABEL[category] ?? "전체" : "전체";

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-xs tracking-[0.3em] text-stone-400 mb-2">SHOP</h1>
        <p className="text-stone-800 text-lg font-light">{currentLabel}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar filter */}
        <aside className="md:w-44 shrink-0">
          <p className="text-xs tracking-widest text-stone-400 mb-4">FILTER</p>
          <ul className="space-y-2">
            {categories.map((cat) => {
              const isActive = (!category && cat === "all") || category === cat;
              return (
                <li key={cat}>
                  <a
                    href={cat === "all" ? "/shop" : `/shop?category=${cat}`}
                    className={`block text-sm py-1 transition-colors ${
                      isActive
                        ? "text-stone-900 font-medium"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    {CATEGORY_LABEL[cat]}
                  </a>
                </li>
              );
            })}
          </ul>

          <form className="mt-8">
            <p className="text-xs tracking-widest text-stone-400 mb-3">SEARCH</p>
            <div className="flex gap-1">
              <input
                name="q"
                defaultValue={q}
                placeholder="검색"
                className="flex-1 px-3 py-2 text-xs border border-stone-300 focus:outline-none focus:border-stone-600 w-full"
              />
            </div>
            {category && (
              <input type="hidden" name="category" value={category} />
            )}
            <button
              type="submit"
              className="mt-2 w-full py-2 text-xs bg-stone-800 text-white hover:bg-stone-700 transition-colors"
            >
              검색
            </button>
          </form>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-20 text-stone-400 text-sm">
              상품이 없습니다.
            </div>
          ) : (
            <>
              <p className="text-xs text-stone-400 mb-6">
                총 {products.length}개
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
