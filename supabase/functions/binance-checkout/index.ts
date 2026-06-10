// Creates a Binance Pay merchant order and returns checkoutUrl + qrCode.
// Body: { orderId, amount, currency: "LTC" | "USDT", description, email }
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { crypto as stdCrypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function hex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmacSha512(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return hex(sig).toUpperCase();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  try {
    const { orderId, amount, currency = "USDT", description, email } = await req.json();
    if (!orderId || !amount || !["LTC", "USDT"].includes(currency)) {
      return new Response(JSON.stringify({ error: "Invalid input. currency must be LTC or USDT." }), { status: 400, headers: { ...CORS, "Content-Type": "application/json" } });
    }
    const apiKey = Deno.env.get("BINANCE_PAY_API_KEY");
    const apiSecret = Deno.env.get("BINANCE_PAY_API_SECRET");
    if (!apiKey || !apiSecret) {
      return new Response(JSON.stringify({ error: "Binance Pay credentials not configured" }), { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    const merchantTradeNo = orderId.replace(/-/g, "").slice(0, 32);
    const payload = {
      env: { terminalType: "WEB" },
      merchantTradeNo,
      orderAmount: Number(amount).toFixed(currency === "LTC" ? 8 : 2),
      currency,
      goods: {
        goodsType: "02",
        goodsCategory: "Z000",
        referenceGoodsId: orderId,
        goodsName: description || `Order ${orderId}`,
      },
      buyer: email ? { buyerEmail: email } : undefined,
    };
    const bodyStr = JSON.stringify(payload);
    const timestamp = Date.now().toString();
    const nonce = crypto.randomUUID().replace(/-/g, "").slice(0, 32);
    const signaturePayload = `${timestamp}\n${nonce}\n${bodyStr}\n`;
    const signature = await hmacSha512(apiSecret, signaturePayload);

    const resp = await fetch("https://bpay.binanceapi.com/binancepay/openapi/v2/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "BinancePay-Timestamp": timestamp,
        "BinancePay-Nonce": nonce,
        "BinancePay-Certificate-SN": apiKey,
        "BinancePay-Signature": signature,
      },
      body: bodyStr,
    });
    const data = await resp.json();
    if (!resp.ok || data.status !== "SUCCESS") {
      return new Response(JSON.stringify({ error: data.errorMessage || "Binance Pay error", details: data }), { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    await supabase.from("orders").update({ gateway_reference: data.data.prepayId, crypto_asset: currency }).eq("id", orderId);

    return new Response(JSON.stringify({
      checkoutUrl: data.data.checkoutUrl,
      qrcodeLink: data.data.qrcodeLink,
      qrContent: data.data.qrContent,
      deeplink: data.data.deeplink,
      prepayId: data.data.prepayId,
    }), { headers: { ...CORS, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
  }
});