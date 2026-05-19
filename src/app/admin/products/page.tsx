import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatPrice, CATEGORY_LABEL } from "@/lib/utils";

export const metadata = { title: "상품 관리" };

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-light text-stone-800">상품 관리</h1>
        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 bg-stone-800 text-white text-xs tracking-widest hover:bg-stone-700 transition-colors"
        >
          + 새 상품
        </Link>
      </div>

      <div className="bg-white border border-stone-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              <th className="text-left px-4 py-3 text-xs text-stone-400 font-normal">상품명</th>
              <th className="text-left px-4 py-3 text-xs text-stone-400 font-normal">카테고리</th>
              <th className="text-right px-4 py-3 text-xs text-stone-400 font-normal">가격</th>
              <th className="text-right px-4 py-3 text-xs text-stone-400 font-normal">재고</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3 text-stone-800">{product.name}</td>
                <td className="px-4 py-3 text-stone-500">
                  {CATEGORY_LABEL[product.category] ?? product.category}
                </td>
                <td className="px-4 py-3 text-right text-stone-600">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={
                    product.stock === 0
                      ? "text-red-500"
                      : product.stock <= 5
                      ? "text-amber-600"
                      : "text-stone-600"
                  }>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-xs text-stone-500 hover:text-stone-800 underline"
                  >
                    편집
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!products || products.length === 0) && (
          <p className="text-center py-10 text-sm text-stone-400">
            등록된 상품이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
