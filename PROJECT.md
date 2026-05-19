# A NEW OBJECT

식물(indoor / outdoor / succulent) 카테고리를 다루는 Next.js 기반 이커머스 프로젝트.

> ⚠️ [AGENTS.md](AGENTS.md) — 이 Next.js는 학습 데이터와 다른 breaking changes 버전이라 코드 작성 전 `node_modules/next/dist/docs/`의 가이드를 먼저 확인할 것.

---

## 1. 기술 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js `16.2.4` (App Router) |
| UI | React `19.2.4`, Tailwind CSS `^4` |
| 상태관리 | Zustand `^5.0.13` (장바구니 persist) |
| 인증/DB | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) |
| 결제 | TossPayments (`@tosspayments/payment-sdk`) |
| 아이콘 | lucide-react |
| 언어/도구 | TypeScript `^5`, ESLint `^9` |

---

## 2. 시작하기

### 환경 변수
[.env.local.example](.env.local.example)을 `.env.local`로 복사 후 채우기.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=
```

### 명령어
```bash
npm run dev     # 개발 서버 (http://localhost:3000)
npm run build   # 프로덕션 빌드
npm run start   # 프로덕션 서버
npm run lint    # ESLint
```

### DB 초기화
Supabase 프로젝트의 SQL Editor에서 [supabase/schema.sql](supabase/schema.sql) 실행.

---

## 3. 디렉토리 구조

```
anewyobject/
├── src/
│   ├── app/                          # App Router
│   │   ├── layout.tsx                # 루트 레이아웃
│   │   ├── page.tsx                  # 홈 (히어로 슬라이더 + 상품)
│   │   ├── globals.css
│   │   ├── shop/
│   │   │   ├── page.tsx              # 상품 리스트
│   │   │   └── [id]/                 # 상품 상세
│   │   │       ├── page.tsx
│   │   │       ├── ProductImages.tsx
│   │   │       └── error.tsx
│   │   ├── cart/page.tsx             # 장바구니
│   │   ├── checkout/
│   │   │   ├── page.tsx              # 결제
│   │   │   ├── success/page.tsx
│   │   │   └── fail/page.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── account/
│   │   │   ├── page.tsx              # 내 정보
│   │   │   ├── orders/page.tsx       # 주문 내역
│   │   │   └── reset-password/page.tsx
│   │   ├── admin/                    # 관리자 (role=admin 필요)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── products/page.tsx
│   │   │   └── orders/
│   │   │       ├── page.tsx
│   │   │       └── OrderStatusForm.tsx
│   │   ├── policy/
│   │   │   ├── privacy/page.tsx
│   │   │   └── terms/page.tsx
│   │   ├── auth/callback/route.ts    # Supabase 콜백
│   │   └── api/
│   │       ├── products/route.ts
│   │       └── orders/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   └── AddToCartButton.tsx
│   │   ├── HeroSlider.tsx
│   │   └── CartHydration.tsx
│   ├── lib/
│   │   ├── cart-store.ts             # Zustand 장바구니 (localStorage persist)
│   │   ├── mock-data.ts
│   │   ├── utils.ts
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── server.ts
│   ├── types/index.ts                # Product, CartItem, Order, User 등
│   └── proxy.ts                      # 라우트 보호 (account/checkout/admin)
├── supabase/
│   └── schema.sql                    # 테이블 + RLS + 트리거
├── public/                           # 정적 자산
├── package.json
└── ...
```

---

## 4. 데이터 모델 (Supabase)

| 테이블 | 주요 컬럼 | 설명 |
|---|---|---|
| `products` | id, name, description, price, stock, category(`indoor`/`outdoor`/`succulent`), images[] | 상품 |
| `profiles` | id (auth.users 참조), name, role(`user`/`admin`) | 회원 프로필 — 가입 시 트리거로 자동 생성 |
| `orders` | id, user_id, order_number, total_amount, status, shipping_address, payment_key | 주문 |
| `order_items` | id, order_id, product_id, product_name, price, quantity | 주문 항목 |

**RLS 정책 요약**
- 상품: 누구나 읽기, admin만 쓰기
- 프로필: 본인만 읽기/수정
- 주문/주문항목: 본인 것만 조회, admin은 전체 관리

**보조 함수**
- `handle_new_user()` — 가입 시 profiles 자동 생성
- `decrement_stock(p_product_id, p_quantity)` — 안전한 재고 감소
- `update_updated_at_column()` — updated_at 자동 갱신

---

## 5. 핵심 흐름

### 인증 & 라우트 보호
[src/proxy.ts](src/proxy.ts)에서 처리:
- `/account/**`, `/checkout/**` — 로그인 필요 (미로그인 시 `/login?redirect=`)
- `/admin/**` — 로그인 + `profiles.role === 'admin'` 필요

### 장바구니
- [src/lib/cart-store.ts](src/lib/cart-store.ts) — Zustand + persist (`localStorage` key: `anewyobject-cart`)
- `skipHydration: true`로 SSR 미스매치 방지 → [CartHydration.tsx](src/components/CartHydration.tsx)에서 클라이언트 마운트 후 수동 hydrate

### 주문 & 결제
1. `/checkout` 진입 → 배송지 입력
2. TossPayments SDK로 결제창 호출
3. 성공 시 `/checkout/success`, 실패 시 `/checkout/fail`
4. `payment_key`를 `orders`에 저장, `decrement_stock`으로 재고 차감

---

## 6. 관리자 기능
- [/admin](src/app/admin/page.tsx) — 대시보드
- [/admin/products](src/app/admin/products/page.tsx) — 상품 관리
- [/admin/orders](src/app/admin/orders/page.tsx) — 주문 상태 변경 (`pending` → `paid` → `preparing` → `shipping` → `delivered` / `cancelled`)

관리자로 만들려면 Supabase에서 직접:
```sql
update profiles set role = 'admin' where id = '<user-uuid>';
```

---

## 7. 작업 시 주의사항

- **Next.js 16.2.4는 학습 데이터와 다름** — API/규약이 다를 수 있으니 [node_modules/next/dist/docs/](node_modules/next/dist/docs/)를 먼저 참고할 것.
- **proxy.ts** — 일반 Next.js의 `middleware.ts`가 아닌 `proxy.ts` 이름과 `proxy` 함수 export를 사용함.
- **장바구니 hydration** — `useCartStore`를 사용하는 컴포넌트는 첫 렌더에서 빈 배열을 받음. `CartHydration`이 마운트되어야 실제 데이터로 채워짐.
- **RLS** — 클라이언트에서 직접 쿼리할 때 정책에 막힐 수 있음. 권한이 필요한 작업은 서버 컴포넌트/route handler에서.
