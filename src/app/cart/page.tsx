"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, X } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-xs tracking-[0.3em] text-stone-400 mb-4">CART</p>
        <p className="text-stone-500 text-sm mb-8">장바구니가 비어있습니다.</p>
        <Link
          href="/shop"
          className="inline-block px-8 py-3 bg-stone-800 text-white text-xs tracking-widest hover:bg-stone-700 transition-colors"
        >
          쇼핑 계속하기
        </Link>
      </div>
    );
  }

  const shipping = totalPrice() >= 50000 ? 0 : 3000;
  const total = totalPrice() + shipping;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <p className="text-xs tracking-[0.3em] text-stone-400 mb-8">CART</p>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Items */}
        <div className="flex-1">
          <div className="border-t border-stone-200">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-4 py-6 border-b border-stone-100"
              >
                <div className="relative w-24 h-24 bg-stone-100 shrink-0 overflow-hidden">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs">
                      없음
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="text-sm text-stone-800 font-medium mb-1">
                        {product.name}
                      </p>
                      <p className="text-sm text-stone-500">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-stone-400 hover:text-stone-700 transition-colors shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      disabled={quantity <= 1}
                      className="w-7 h-7 border border-stone-300 flex items-center justify-center text-stone-600 hover:border-stone-600 transition-colors disabled:opacity-30"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm text-stone-800 w-4 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="w-7 h-7 border border-stone-300 flex items-center justify-center text-stone-600 hover:border-stone-600 transition-colors disabled:opacity-30"
                    >
                      <Plus size={12} />
                    </button>
                    <span className="ml-auto text-sm font-medium text-stone-800">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-stone-50 p-6">
            <p className="text-xs tracking-widest text-stone-400 mb-6">
              ORDER SUMMARY
            </p>
            <div className="space-y-3 text-sm text-stone-600 mb-6">
              <div className="flex justify-between">
                <span>상품 합계</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between">
                <span>배송비</span>
                <span>{shipping === 0 ? "무료" : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-stone-400">
                  {formatPrice(50000 - totalPrice())} 더 담으면 무료배송
                </p>
              )}
            </div>
            <div className="flex justify-between font-medium text-stone-800 pt-4 border-t border-stone-200 mb-6">
              <span>합계</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              className="block w-full text-center py-4 bg-stone-800 text-white text-xs tracking-[0.2em] hover:bg-stone-700 transition-colors"
            >
              주문하기
            </Link>
            <Link
              href="/shop"
              className="block w-full text-center py-3 text-xs text-stone-500 hover:text-stone-800 transition-colors mt-3"
            >
              쇼핑 계속하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
