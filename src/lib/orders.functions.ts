import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const allowedGateways = ["stripe", "binance"] as const;

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      customer_email: z.string().email().max(254),
      amount: z.number().positive().max(100000),
      currency: z.string().min(3).max(8).default("USD"),
      gateway: z.enum(allowedGateways),
      platform: z.string().max(64).nullable().optional(),
      quantity: z.number().int().positive().max(10000).nullable().optional(),
      crypto_asset: z.string().max(16).nullable().optional(),
      description: z.string().max(500).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_email: data.customer_email,
        amount: data.amount,
        currency: data.currency,
        gateway: data.gateway,
        platform: data.platform ?? null,
        quantity: data.quantity ?? null,
        crypto_asset: data.crypto_asset ?? null,
        status: "pending",
        metadata: { description: data.description ?? "" },
      })
      .select("id")
      .single();
    if (error || !row) throw new Error(error?.message || "Failed to create order");
    return { id: row.id };
  });

export const submitOrderProof = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      orderId: z.string().uuid(),
      customerReference: z.string().min(4).max(200),
    }),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error: fetchErr } = await supabaseAdmin
      .from("orders")
      .select("id, status")
      .eq("id", data.orderId)
      .maybeSingle();
    if (fetchErr) throw new Error(fetchErr.message);
    if (!order) throw new Error("Order not found");
    if (order.status === "Paid" || order.status === "cancelled" || order.status === "failed") {
      throw new Error("Order is already finalized");
    }
    const { error } = await supabaseAdmin
      .from("orders")
      .update({
        customer_reference: data.customerReference,
        status: "awaiting_verification",
      })
      .eq("id", data.orderId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const listOrdersAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { orders: data ?? [] };
  });

export const approveOrderAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ orderId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status: "Paid", gateway_reference: `manual-confirm-${Date.now()}` })
      .eq("id", data.orderId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });