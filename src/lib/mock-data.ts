import { Product } from '@/types'

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock-1',
    name: '몬스테라 델리시오사',
    description: `공간에 생명을 불어넣는 가장 쉬운 방법.

큰 잎이 만드는 그림자조차 아름다운 식물입니다.
창가의 간접광 아래 두면, 1주일에 한 번만 물을 주세요.

간접광 · 주 1회 물주기 · 반려동물 주의

#anewy #몬스테라 #플랜테리어 #실내식물`,
    price: 38000,
    stock: 8,
    category: 'indoor',
    images: [
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=900&q=85',
      'https://images.unsplash.com/photo-1637967886160-fd78dc3ce3f5?w=900&q=85',
    ],
    created_at: '2025-03-10T00:00:00Z',
    updated_at: '2025-03-10T00:00:00Z',
  },
  {
    id: 'mock-2',
    name: '스투키',
    description: `가장 바쁜 당신을 위한 식물.

한 달에 한 번 물만 주면 됩니다.
밤에 산소를 내뿜는 스투키는 침실의 조용한 동반자입니다.

저광 가능 · 월 1–2회 물주기 · 음이온 방출

#anewy #스투키 #산세베리아 #침실식물`,
    price: 22000,
    stock: 15,
    category: 'indoor',
    images: [
      'https://images.unsplash.com/photo-1545241047-6083a3684587?w=900&q=85',
    ],
    created_at: '2025-03-12T00:00:00Z',
    updated_at: '2025-03-12T00:00:00Z',
  },
  {
    id: 'mock-3',
    name: '포토스',
    description: `늘어지며 자라는 것에도 아름다움이 있습니다.

선반 끝에서 천천히 내려오는 포토스.
빛이 부족한 공간에서도 묵묵히 자랍니다.

간접광 · 주 1회 물주기 · 초보자 추천

#anewy #포토스 #행잉플랜트 #식물인테리어`,
    price: 18000,
    stock: 20,
    category: 'indoor',
    images: [
      'https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=900&q=85',
    ],
    created_at: '2025-03-14T00:00:00Z',
    updated_at: '2025-03-14T00:00:00Z',
  },
  {
    id: 'mock-4',
    name: '에케베리아 컬렉션',
    description: `하나씩 모으는 즐거움.

색도, 모양도, 질감도 다른 에케베리아 3종 세트.
작은 공간을 가장 감각적으로 채우는 방법입니다.

직사광선 · 2–3주에 1회 물주기 · 배수 중요

#anewy #에케베리아 #다육식물 #succulents`,
    price: 28000,
    stock: 10,
    category: 'succulent',
    images: [
      'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=900&q=85',
      'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=900&q=85',
    ],
    created_at: '2025-03-16T00:00:00Z',
    updated_at: '2025-03-16T00:00:00Z',
  },
  {
    id: 'mock-5',
    name: '금호 선인장',
    description: `말이 필요 없는 존재감.

둥글고 단단한 형태 자체가 오브제입니다.
일 년에 몇 번만 돌봐주면 수십 년을 함께합니다.

직사광선 · 월 1–2회 물주기 · 장수 식물

#anewy #선인장 #cactus #미니멀인테리어`,
    price: 15000,
    stock: 18,
    category: 'succulent',
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900&q=85',
    ],
    created_at: '2025-03-18T00:00:00Z',
    updated_at: '2025-03-18T00:00:00Z',
  },
  {
    id: 'mock-6',
    name: '하월시아',
    description: `빛이 없는 곳에서도 빛납니다.

반투명한 잎끝에 빛이 통과할 때,
그 순간을 한번 보면 잊을 수 없습니다.

저광 · 3–4주에 1회 물주기 · 책상 위 추천

#anewy #하월시아 #haworthia #다육이`,
    price: 24000,
    stock: 7,
    category: 'succulent',
    images: [
      'https://images.unsplash.com/photo-1587334274328-64186a80aeee?w=900&q=85',
    ],
    created_at: '2025-03-20T00:00:00Z',
    updated_at: '2025-03-20T00:00:00Z',
  },
  {
    id: 'mock-7',
    name: '올리브 나무',
    description: `지중해의 시간을 담아두었습니다.

은빛 잎이 바람에 흔들릴 때,
창밖이 다른 곳처럼 느껴집니다.

직사광선 · 주 1–2회 물주기 · 소형 (30–40cm)

#anewy #올리브나무 #올리브 #olivetree`,
    price: 55000,
    stock: 5,
    category: 'outdoor',
    images: [
      'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=900&q=85',
    ],
    created_at: '2025-03-22T00:00:00Z',
    updated_at: '2025-03-22T00:00:00Z',
  },
  {
    id: 'mock-8',
    name: '제라늄',
    description: `매일 아침, 창문을 열고 싶어지는 이유.

봄부터 가을까지 꽃을 피우는 제라늄.
발코니 한 켠에 두는 것만으로 충분합니다.

직사광선 · 주 2–3회 물주기 · 사계절 색상

#anewy #제라늄 #geranium #베란다정원`,
    price: 12000,
    stock: 25,
    category: 'outdoor',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=85',
    ],
    created_at: '2025-03-24T00:00:00Z',
    updated_at: '2025-03-24T00:00:00Z',
  },
]

export function getMockProduct(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id)
}
