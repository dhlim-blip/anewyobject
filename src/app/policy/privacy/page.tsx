export const metadata = { title: "개인정보처리방침" };

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <p className="text-xs tracking-[0.3em] text-stone-400 mb-2">POLICY</p>
      <h1 className="text-xl font-light text-stone-800 mb-10">개인정보처리방침</h1>

      <div className="space-y-8 text-stone-600 leading-relaxed">
        <section>
          <h2 className="text-sm font-medium text-stone-800 mb-3">수집하는 개인정보</h2>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>이메일 주소 (회원가입 및 로그인)</li>
            <li>이름, 연락처, 주소 (주문 및 배송)</li>
            <li>결제 정보 (토스페이먼츠를 통해 안전하게 처리)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-medium text-stone-800 mb-3">개인정보 이용 목적</h2>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>주문 처리 및 배송</li>
            <li>고객 서비스 제공</li>
            <li>서비스 개선 및 신상품 안내 (동의한 경우)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-medium text-stone-800 mb-3">개인정보 보유 기간</h2>
          <p className="text-sm">
            회원 탈퇴 시 즉시 삭제하며, 전자상거래법에 의한 거래 기록은 5년간 보관합니다.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium text-stone-800 mb-3">제3자 제공</h2>
          <p className="text-sm">
            배송을 위해 배송업체에 이름, 연락처, 주소를 제공합니다. 그 외에는 이용자 동의 없이
            개인정보를 제3자에게 제공하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium text-stone-800 mb-3">문의</h2>
          <p className="text-sm">
            개인정보 관련 문의: hello@anewyobject.com
          </p>
        </section>
      </div>
    </div>
  );
}
