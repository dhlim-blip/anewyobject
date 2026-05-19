"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "indoor",
    images: "",
  });

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const images = form.images
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: parseInt(form.price),
        stock: parseInt(form.stock),
        category: form.category,
        images,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "오류가 발생했습니다.");
      setLoading(false);
      return;
    }

    router.push("/admin/products");
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-xs text-stone-400 hover:text-stone-700">
          ← 상품 목록
        </Link>
        <h1 className="text-xl font-light text-stone-800">새 상품 등록</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 border border-stone-200">
        <div>
          <label className="block text-xs text-stone-500 mb-1.5">상품명 *</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            required
            className="w-full px-3 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-stone-600"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-500 mb-1.5">카테고리 *</label>
          <select
            name="category"
            value={form.category}
            onChange={onChange}
            className="w-full px-3 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-stone-600 bg-white"
          >
            <option value="indoor">실내</option>
            <option value="outdoor">실외</option>
            <option value="succulent">다육</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-stone-500 mb-1.5">가격 (원) *</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={onChange}
              required
              min={0}
              className="w-full px-3 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-stone-600"
              placeholder="25000"
            />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-1.5">재고 *</label>
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={onChange}
              required
              min={0}
              className="w-full px-3 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-stone-600"
              placeholder="10"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-stone-500 mb-1.5">설명</label>
          <textarea
            name="description"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-stone-600 resize-none"
            placeholder="상품 설명을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-500 mb-1.5">
            이미지 URL (한 줄에 하나씩)
          </label>
          <textarea
            name="images"
            value={form.images}
            onChange={(e) => setForm((prev) => ({ ...prev, images: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2.5 border border-stone-300 text-sm focus:outline-none focus:border-stone-600 resize-none font-mono"
            placeholder="https://..."
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-stone-800 text-white text-xs tracking-widest hover:bg-stone-700 transition-colors disabled:opacity-50"
          >
            {loading ? "저장 중..." : "저장"}
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-2.5 border border-stone-300 text-stone-600 text-xs hover:border-stone-600 transition-colors"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
