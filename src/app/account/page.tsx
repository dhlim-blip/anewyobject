import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, ORDER_STATUS_LABEL } from "@/lib/utils";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, total_amount, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <p className="text-xs tracking-[0.3em] text-stone-400 mb-8">MY ACCOUNT</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile */}
        <div className="md:col-span-1">
          <div className="bg-stone-50 p-6">
            <p className="text-xs tracking-widest text-stone-400 mb-4">PROFILE</p>
            <p className="text-sm font-medium text-stone-800">
              {profile?.name ?? user.user_metadata?.name ?? "이름 없음"}
            </p>
            <p className="text-xs text-stone-500 mt-1">{user.email}</p>

            <div className="mt-6 space-y-2">
              <Link
                href="/account/orders"
                className="block text-xs text-stone-600 hover:text-stone-900 py-2 border-b border-stone-200 transition-colors"
              >
                주문 내역 →
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-xs text-stone-400 hover:text-stone-700 py-2 transition-colors"
                >
                  로그아웃
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Recent orders */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs tracking-widest text-stone-400">RECENT ORDERS</p>
            <Link href="/account/orders" className="text-xs text-stone-500 hover:text-stone-800">
              전체 보기
            </Link>
          </div>

          {!orders || orders.length === 0 ? (
            <div className="bg-stone-50 p-8 text-center text-sm text-stone-400">
              주문 내역이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="block bg-stone-50 p-4 hover:bg-stone-100 transition-colors"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-stone-800">{order.order_number}</span>
                    <span className="text-stone-500">
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-stone-400 mt-1">
                    <span>
                      {new Date(order.created_at).toLocaleDateString("ko-KR")}
                    </span>
                    <span>{ORDER_STATUS_LABEL[order.status] ?? order.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
