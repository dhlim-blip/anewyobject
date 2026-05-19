"use client";

import { useState } from "react";
import { ORDER_STATUS_LABEL } from "@/lib/utils";
import { useRouter } from "next/navigation";

const STATUSES = ["pending", "paid", "preparing", "shipping", "delivered", "cancelled"];

export default function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    const prev = status;
    setStatus(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("update failed");
      router.refresh();
    } catch {
      setStatus(prev);
      alert("상태 변경에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={saving}
      className="text-xs border border-stone-300 px-2 py-1.5 bg-white focus:outline-none focus:border-stone-600 disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS_LABEL[s] ?? s}
        </option>
      ))}
    </select>
  );
}
