"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, generateOrderNumber } from "@/lib/utils";
import { ShippingAddress } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ShippingAddress>({
    name: "",
    phone: "",
    address: "",
    detail_address: "",
    postal_code: "",
  });

  const shipping = totalPrice() >= 50000 ? 0 : 3000;
  const total = totalPrice() + shipping;

  if (items.length === 0) {
    router.replace("/cart");
    return null;
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.postal_code) return;

    setLoading(true);
    try {
      const orderNumber = generateOrderNumber();

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_number: orderNumber,
          items: items.map((i) => ({
            product_id: i.product.id,
            product_name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
          })),
          total_amount: total,
          shipping_address: form,
        }),
      });

      if (!res.ok) throw new Error("주문 생성 실패");

      const { id: orderId } = await res.json();

      const { loadTossPayments } = await import("@tosspayments/payment-sdk");
      const tossPayments = await loadTossPayments(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
      );

      await tossPayments.requestPayment("카드", {
        amount: total,
        orderId: orderNumber,
        orderName:
          items.length === 1
            ? items[0].product.name
            : `${items[0].product.name} 외 ${items.length - 1}건`,
        customerName: form.name,
        successUrl: `${window.location.origin}/checkout/success?dbOrderId=${orderId}`,
        failUrl: `${window.location.origin}/checkout/fail?dbOrderId=${orderId}`,
      });
    } catch (err) {
      console.error(err);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <p className="text-xs tracking-[0.3em] text-stone-400 mb-8">CHECKOUT</p>

      <form onSubmit={handlePay} className="flex flex-col lg:flex-row gap-10">
        {/* Shipping form */}
        <div className="flex-1">
          <h2 className="text-sm font-medium text-stone-800 mb-6">배송 정보</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-stone-500 mb-1.5">받는 분 *</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border border-stone-300 text-sm focus:outline-none focus:border-stone-600"
                placeholder="홍길동"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1.5">연락처 *</label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border border-stone-300 text-sm focus:outline-none focus:border-stone-600"
                placeholder="010-0000-0000"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1.5">우편번호 *</label>
              <input
                name="postal_code"
                value={form.postal_code}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border border-stone-300 text-sm focus:outline-none focus:border-stone-600"
                placeholder="12345"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1.5">주소 *</label>
              <input
                name="address"
                value={form.address}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border border-stone-300 text-sm focus:outline-none focus:border-stone-600"
                placeholder="서울시 강남구 테헤란로 123"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1.5">상세 주소</label>
              <input
                name="detail_address"
                value={form.detail_address}
                onChange={onChange}
                className="w-full px-4 py-3 border border-stone-300 text-sm focus:outline-none focus:border-stone-600"
                placeholder="101동 201호"
              />
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-stone-50 p-6">
            <p className="text-xs tracking-widest text-stone-400 mb-6">
              ORDER SUMMARY
            </p>

            <div className="space-y-3 mb-6">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm text-stone-600">
                  <span className="truncate flex-1 mr-2">
                    {product.name} × {quantity}
                  </span>
                  <span className="shrink-0">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-4 space-y-3 text-sm text-stone-600 mb-6">
              <div className="flex justify-between">
                <span>상품 합계</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between">
                <span>배송비</span>
                <span>{shipping === 0 ? "무료" : formatPrice(shipping)}</span>
              </div>
            </div>

            <div className="flex justify-between font-medium text-stone-800 border-t border-stone-200 pt-4 mb-6">
              <span>총 결제금액</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-stone-800 text-white text-xs tracking-[0.2em] hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "처리 중..." : `${formatPrice(total)} 결제하기`}
            </button>

            <p className="text-xs text-stone-400 text-center mt-4 leading-relaxed">
              토스페이먼츠를 통해 안전하게 결제됩니다
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
