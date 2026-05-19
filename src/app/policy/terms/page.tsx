export const metadata = { title: "이용약관" };

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <p className="text-xs tracking-[0.3em] text-stone-400 mb-2">POLICY</p>
      <h1 className="text-xl font-light text-stone-800 mb-10">이용약관</h1>

      <div className="prose prose-stone prose-sm max-w-none space-y-8 text-stone-600 leading-relaxed">
        <section>
          <h2 className="text-sm font-medium text-stone-800 mb-3">제1조 (목적)</h2>
          <p className="text-sm">
            이 약관은 anewy(이하 &ldquo;회사&rdquo;)가 운영하는 온라인 쇼핑몰
            www.anewyobject.com에서 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의 권리,
            의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium text-stone-800 mb-3">제2조 (서비스 이용)</h2>
          <p className="text-sm">
            회원가입 후 서비스를 이용할 수 있으며, 회원은 본 약관 및 관련 법령을 준수해야 합니다.
            상품 주문 시 정확한 정보를 입력해야 하며, 허위 정보 입력으로 인한 불이익은 회원 본인이
            부담합니다.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium text-stone-800 mb-3">제3조 (주문 및 결제)</h2>
          <p className="text-sm">
            주문은 상품 선택 후 결제 완료 시 확정됩니다. 결제는 토스페이먼츠를 통해 처리되며
            신용카드, 체크카드 등 다양한 결제 수단을 지원합니다.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium text-stone-800 mb-3">제4조 (배송)</h2>
          <p className="text-sm">
            결제 완료 후 1-3 영업일 내에 배송이 시작됩니다. 5만원 이상 주문 시 무료배송이며,
            미만 시 배송비 3,000원이 부과됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium text-stone-800 mb-3">제5조 (면책조항)</h2>
          <p className="text-sm">
            천재지변, 불가항력적 사유로 인한 서비스 중단에 대해 회사는 책임을 지지 않습니다.
            식물의 특성상 사진과 실제 상품이 다소 다를 수 있습니다.
          </p>
        </section>
      </div>
    </div>
  );
}
