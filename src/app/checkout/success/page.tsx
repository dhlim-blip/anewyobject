"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderNumber, setOrderNumber] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const rawAmount = searchParams.get("amount");
    const dbOrderId = searchParams.get("dbOrderId");

    if (!paymentKey || !orderId || !rawAmount) {
      setStatus("error");
      return;
    }

    fetch("/api/payment/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: parseInt(rawAmount),
        dbOrderId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          clearCart();
          setOrderNumber(data.orderNumber ?? orderId);
          setAmount(parseInt(rawAmount));
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [searchParams, clearCart]);

  if (status === "loading") {
    return (
      <div className="text-center">
        <p className="text-stone-500 text-sm">결제 확인 중...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center">
        <p className="text-red-500 text-sm mb-6">결제 확인에 실패했습니다.</p>
        <Link href="/cart" className="text-sm text-stone-600 underline">
          장바구니로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center mx-auto mb-6">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-xl font-light text-stone-800 mb-2">주문 완료</h1>
      <p className="text-sm text-stone-500 mb-8">주문해 주셔서 감사합니다.</p>

      <div className="bg-stone-50 p-6 text-left mb-8 max-w-xs mx-auto">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-stone-600">
            <span>주문 번호</span>
            <span className="font-medium text-stone-800">{orderNumber}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>결제 금액</span>
            <span className="font-medium text-stone-800">{formatPrice(amount)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/account/orders"
          className="inline-block px-8 py-3 bg-stone-800 text-white text-xs tracking-widest hover:bg-stone-700 transition-colors"
        >
          주문 내역 보기
        </Link>
        <Link
          href="/shop"
          className="inline-block px-8 py-3 border border-stone-300 text-stone-700 text-xs tracking-widest hover:border-stone-600 transition-colors"
        >
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20">
      <Suspense fallback={<p className="text-center text-sm text-stone-400">로딩 중...</p>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
