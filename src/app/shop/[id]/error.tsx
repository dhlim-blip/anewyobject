'use client'

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <p className="text-xs tracking-[0.3em] text-stone-400 mb-4">오류</p>
      <p className="text-sm text-stone-600 mb-6">상품 페이지를 불러오지 못했습니다.</p>
      {process.env.NODE_ENV === 'development' && (
        <pre className="text-left text-xs bg-red-50 border border-red-100 p-4 rounded mb-6 overflow-auto text-red-700">
          {error.message}
          {error.stack && '\n\n' + error.stack}
        </pre>
      )}
      <button
        onClick={reset}
        className="px-6 py-3 bg-stone-800 text-white text-xs tracking-widest hover:bg-stone-700 transition-colors"
      >
        다시 시도
      </button>
    </div>
  )
}
