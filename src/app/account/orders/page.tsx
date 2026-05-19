import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDate, ORDER_STATUS_LABEL } from "@/lib/utils";

export const metadata = { title: "주문 내역" };

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id, order_number, total_amount, status, created_at,
      order_items(product_name, quantity, price)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/account" className="text-xs text-stone-400 hover:text-stone-700">
          ← 계정
        </Link>
        <p className="text-xs tracking-[0.3em] text-stone-400">ORDER HISTORY</p>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-stone-400 text-sm mb-6">주문 내역이 없습니다.</p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-stone-800 text-white text-xs tracking-widest hover:bg-stone-700 transition-colors"
          >
            쇼핑하기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block border border-stone-200 p-5 hover:border-stone-400 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-medium text-stone-800">{order.order_number}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{formatDate(order.created_at)}</p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-stone-100 text-stone-600">
                  {ORDER_STATUS_LABEL[order.status] ?? order.status}
                </span>
              </div>
              <div className="text-xs text-stone-500 mb-2">
                {(order.order_items as Array<{product_name: string; quantity: number; price: number}>)
                  .map((item) => `${item.product_name} × ${item.quantity}`)
                  .join(", ")}
              </div>
              <p className="text-sm font-medium text-stone-800">
                {formatPrice(order.total_amount)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
