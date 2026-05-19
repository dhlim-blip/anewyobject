import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDate, ORDER_STATUS_LABEL } from "@/lib/utils";
import OrderStatusForm from "./OrderStatusForm";

export const metadata = { title: "주문 관리" };

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id, order_number, total_amount, status, created_at,
      shipping_address,
      order_items(product_name, quantity, price)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <h1 className="text-xl font-light text-stone-800 mb-8">주문 관리</h1>

      <div className="space-y-4">
        {orders?.map((order) => {
          const address = order.shipping_address as { name: string; phone: string };
          return (
            <div key={order.id} className="bg-white border border-stone-200 p-5">
              <div className="flex flex-wrap justify-between gap-4 mb-3">
                <div>
                  <p className="font-medium text-stone-800">{order.order_number}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusForm orderId={order.id} currentStatus={order.status} />
                </div>
              </div>

              <div className="text-xs text-stone-500 mb-2">
                {(order.order_items as Array<{ product_name: string; quantity: number; price: number }>)
                  .map((item) => `${item.product_name} × ${item.quantity}`)
                  .join(", ")}
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xs text-stone-400">
                  {address.name} / {address.phone}
                </p>
                <p className="text-sm font-medium text-stone-800">
                  {formatPrice(order.total_amount)}
                </p>
              </div>
            </div>
          );
        })}

        {(!orders || orders.length === 0) && (
          <div className="text-center py-20 text-stone-400 text-sm">
            주문이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
