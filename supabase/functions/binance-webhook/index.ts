import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const dataStr = payload.data;
    const data = typeof dataStr === "string" ? JSON.parse(dataStr) : dataStr;
    if (payload.bizStatus === "PAY_SUCCESS" && data?.merchantTradeNo) {
      const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
      await supabase.from("orders").update({ status: "Paid", gateway_reference: data.transactionId || data.merchantTradeNo })
        .eq("gateway_reference", data.merchantTradeNo);
    }
    return new Response(JSON.stringify({ returnCode: "SUCCESS", returnMessage: null }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ returnCode: "FAIL", returnMessage: (e as Error).message }), { status: 400 });
  }
});