// Creates a Stripe Checkout Session (test mode) and returns the hosted URL.
// Frontend posts { orderId, amount, currency, email, description, successUrl, cancelUrl }.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  try {
    const { orderId, amount, currency = "USD", email, description, successUrl, cancelUrl } = await req.json();
    if (!orderId || !amount || !email) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { ...CORS, "Content-Type": "application/json" } });
    }
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) return new Response(JSON.stringify({ error: "STRIPE_SECRET_KEY not configured" }), { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });

    const body = new URLSearchParams();
    body.append("mode", "payment");
    body.append("success_url", successUrl || "https://example.com/success?session_id={CHECKOUT_SESSION_ID}");
    body.append("cancel_url", cancelUrl || "https://example.com/cancel");
    body.append("customer_email", email);
    body.append("client_reference_id", orderId);
    body.append("metadata[order_id]", orderId);
    body.append("line_items[0][quantity]", "1");
    body.append("line_items[0][price_data][currency]", String(currency).toLowerCase());
    body.append("line_items[0][price_data][unit_amount]", String(Math.round(Number(amount) * 100)));
    body.append("line_items[0][price_data][product_data][name]", description || `Order ${orderId}`);

    const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${stripeKey}`, "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = await resp.json();
    if (!resp.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || "Stripe error", details: data }), { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    // Persist session id on the order
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    await supabase.from("orders").update({ gateway_reference: data.id }).eq("id", orderId);

    return new Response(JSON.stringify({ url: data.url, sessionId: data.id }), { headers: { ...CORS, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
  }
});