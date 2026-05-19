export const metadata = { title: "환불정책" };

export default function RefundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <p className="text-xs tracking-[0.3em] text-stone-400 mb-2">POLICY</p>
      <h1 className="text-xl font-light text-stone-800 mb-10">환불정책</h1>

      <div className="space-y-8 text-stone-600 leading-relaxed">
        <section>
          <h2 className="text-sm font-medium text-stone-800 mb-3">교환/환불 가능 조건</h2>
          <ul className="text-sm space-y-2 list-disc list-inside">
            <li>상품 수령 후 24시간 이내 불량품 또는 오배송 시</li>
            <li>배송 중 파손된 경우 (사진 증빙 필요)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-medium text-stone-800 mb-3">교환/환불 불가 조건</h2>
          <ul className="text-sm space-y-2 list-disc list-inside">
            <li>단순 변심에 의한 반품 (식물 특성상 반품 불가)</li>
            <li>고객 부주의로 인한 상품 훼손</li>
            <li>수령 후 24시간이 경과한 경우</li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-medium text-stone-800 mb-3">교환/환불 절차</h2>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>이메일(hello@anewyobject.com)로 사진과 함께 문의</li>
            <li>담당자 확인 후 처리 방법 안내 (1 영업일 이내)</li>
            <li>교환/환불 완료 (영업일 기준 3-5일)</li>
          </ol>
        </section>

        <section>
          <h2 className="text-sm font-medium text-stone-800 mb-3">환불 방법</h2>
          <p className="text-sm">
            결제하신 동일한 수단으로 환불 처리됩니다. 카드 결제의 경우 카드사 정책에 따라
            영업일 기준 3-7일 내에 처리됩니다.
          </p>
        </section>
      </div>
    </div>
  );
}
