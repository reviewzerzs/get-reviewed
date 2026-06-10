import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

Deno.serve(async (req) => {
  try {
    const event = await req.json();
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.client_reference_id || session.metadata?.order_id;
      if (orderId) {
        const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
        await supabase.from("orders").update({ status: "Paid", gateway_reference: session.id }).eq("id", orderId);
      }
    }
    return new Response(JSON.stringify({ received: true }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 400 });
  }
});