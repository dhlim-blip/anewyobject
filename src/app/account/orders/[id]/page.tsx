import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDate, ORDER_STATUS_LABEL } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(*)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!order) notFound();

  const address = order.shipping_address as {
    name: string; phone: string; address: string;
    detail_address: string; postal_code: string;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/account/orders" className="text-xs text-stone-400 hover:text-stone-700">
          ← 주문 내역
        </Link>
        <p className="text-xs tracking-[0.3em] text-stone-400">ORDER DETAIL</p>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="font-medium text-stone-800">{order.order_number}</p>
          <p className="text-xs text-stone-400 mt-1">{formatDate(order.created_at)}</p>
        </div>
        <span className="text-xs px-3 py-1.5 bg-stone-100 text-stone-600">
          {ORDER_STATUS_LABEL[order.status] ?? order.status}
        </span>
      </div>

      {/* Items */}
      <div className="border-t border-stone-200 mb-6">
        {(order.order_items as Array<{
          id: string; product_name: string; price: number; quantity: number;
        }>).map((item) => (
          <div key={item.id} className="flex justify-between py-4 border-b border-stone-100 text-sm">
            <div>
              <p className="text-stone-800">{item.product_name}</p>
              <p className="text-stone-400 text-xs mt-0.5">
                {formatPrice(item.price)} × {item.quantity}
              </p>
            </div>
            <p className="text-stone-800 font-medium">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="bg-stone-50 p-5 mb-6">
        <div className="flex justify-between text-sm font-medium text-stone-800">
          <span>총 결제금액</span>
          <span>{formatPrice(order.total_amount)}</span>
        </div>
      </div>

      {/* Shipping */}
      <div>
        <p className="text-xs tracking-widest text-stone-400 mb-3">SHIPPING</p>
        <div className="text-sm text-stone-600 space-y-1.5">
          <p><span className="text-stone-400">받는 분</span> {address.name}</p>
          <p><span className="text-stone-400">연락처</span> {address.phone}</p>
          <p>
            <span className="text-stone-400">주소</span>{" "}
            ({address.postal_code}) {address.address} {address.detail_address}
          </p>
        </div>
      </div>
    </div>
  );
}
