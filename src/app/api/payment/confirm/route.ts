import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { paymentKey, orderId, amount, dbOrderId } = await request.json();

  if (!paymentKey || !orderId || !amount || !dbOrderId) {
    return NextResponse.json({ ok: false, error: "Invalid parameters" }, { status: 400 });
  }

  // Confirm payment with TossPayments
  const tossRes = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.TOSS_SECRET_KEY}:`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const tossData = await tossRes.json();

  if (!tossRes.ok) {
    return NextResponse.json(
      { ok: false, error: tossData.message ?? "결제 확인 실패" },
      { status: 400 }
    );
  }

  // Update order status in database
  const supabase = await createClient();
  await supabase
    .from("orders")
    .update({
      status: "paid",
      payment_key: paymentKey,
    })
    .eq("id", dbOrderId);

  // Reduce stock for each order item
  const { data: orderItems } = await supabase
    .from("order_items")
    .select("product_id, quantity")
    .eq("order_id", dbOrderId);

  if (orderItems) {
    for (const item of orderItems) {
      await supabase.rpc("decrement_stock", {
        p_product_id: item.product_id,
        p_quantity: item.quantity,
      });
    }
  }

  const { data: order } = await supabase
    .from("orders")
    .select("order_number")
    .eq("id", dbOrderId)
    .single();

  return NextResponse.json({ ok: true, orderNumber: order?.order_number });
}
