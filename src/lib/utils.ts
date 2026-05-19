export function formatPrice(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

export function generateOrderNumber(): string {
  const date = new Date();
  const ymd =
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 90000) + 10000;
  return `ANO-${ymd}-${rand}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "결제 대기",
  paid: "결제 완료",
  preparing: "상품 준비 중",
  shipping: "배송 중",
  delivered: "배송 완료",
  cancelled: "취소됨",
};

export const CATEGORY_LABEL: Record<string, string> = {
  indoor: "실내",
  outdoor: "실외",
  succulent: "다육",
  all: "전체",
};
