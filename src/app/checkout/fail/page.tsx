"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function FailContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") ?? "결제에 실패했습니다.";
  const code = searchParams.get("code");

  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-xl font-light text-stone-800 mb-2">결제 실패</h1>
      <p className="text-sm text-stone-500 mb-2">{message}</p>
      {code && <p className="text-xs text-stone-400 mb-8">오류 코드: {code}</p>}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/checkout"
          className="inline-block px-8 py-3 bg-stone-800 text-white text-xs tracking-widest hover:bg-stone-700 transition-colors"
        >
          다시 시도하기
        </Link>
        <Link
          href="/cart"
          className="inline-block px-8 py-3 border border-stone-300 text-stone-700 text-xs tracking-widest hover:border-stone-600 transition-colors"
        >
          장바구니로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutFailPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20">
      <Suspense fallback={<p className="text-center text-sm text-stone-400">로딩 중...</p>}>
        <FailContent />
      </Suspense>
    </div>
  );
}
