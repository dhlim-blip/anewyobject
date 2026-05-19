import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = { title: "관리자 대시보드" };

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: productCount },
    { count: orderCount },
    { data: recentOrders },
    { data: lowStock },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id, order_number, total_amount, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("products")
      .select("id, name, stock")
      .lte("stock", 5)
      .order("stock"),
  ]);

  const stats = [
    { label: "전체 상품", value: productCount ?? 0, href: "/admin/products" },
    { label: "전체 주문", value: orderCount ?? 0, href: "/admin/orders" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-xl font-light text-stone-800 mb-8">대시보드</h1>

      <div className="grid grid-cols-2 gap-4 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white p-6 border border-stone-200 hover:border-stone-400 transition-colors">
            <p className="text-3xl font-light text-stone-800">{stat.value}</p>
            <p className="text-xs text-stone-400 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent orders */}
        <div>
          <div className="flex justify-between mb-4">
            <p className="text-xs tracking-widest text-stone-400">최근 주문</p>
            <Link href="/admin/orders" className="text-xs text-stone-500 hover:text-stone-800">
              전체 보기
            </Link>
          </div>
          <div className="bg-white border border-stone-200">
            {recentOrders?.map((order) => (
              <div key={order.id} className="flex justify-between px-4 py-3 border-b border-stone-100 last:border-0 text-sm">
                <span className="text-stone-600">{order.order_number}</span>
                <span className="text-stone-500">{order.total_amount.toLocaleString()}원</span>
                <span className="text-xs text-stone-400">{order.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div>
          <div className="flex justify-between mb-4">
            <p className="text-xs tracking-widest text-stone-400">재고 부족</p>
            <Link href="/admin/products" className="text-xs text-stone-500 hover:text-stone-800">
              전체 보기
            </Link>
          </div>
          <div className="bg-white border border-stone-200">
            {lowStock && lowStock.length > 0 ? (
              lowStock.map((p) => (
                <div key={p.id} className="flex justify-between px-4 py-3 border-b border-stone-100 last:border-0 text-sm">
                  <span className="text-stone-600">{p.name}</span>
                  <span className={`font-medium ${p.stock === 0 ? "text-red-500" : "text-amber-600"}`}>
                    {p.stock === 0 ? "품절" : `${p.stock}개`}
                  </span>
                </div>
              ))
            ) : (
              <p className="px-4 py-6 text-sm text-stone-400 text-center">재고 부족 상품 없음</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
