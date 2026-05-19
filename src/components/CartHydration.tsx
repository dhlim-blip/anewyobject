'use client'

import { useEffect } from 'react'
import { hydrateCartStore } from '@/lib/cart-store'

export default function CartHydration() {
  useEffect(() => {
    hydrateCartStore()
  }, [])
  return null
}
