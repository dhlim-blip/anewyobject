import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { order_number, items, total_amount, shipping_address } = body;

  if (!order_number || !items?.length || !total_amount || !shipping_address) {
    return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      order_number,
      total_amount,
      shipping_address,
      status: "pending",
    })
    .select()
    .single();

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

  const orderItems = items.map((item: {
    product_id: string; product_name: string; price: number; quantity: number;
  }) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    price: item.price,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });

  return NextResponse.json({ id: order.id, order_number }, { status: 201 });
}
