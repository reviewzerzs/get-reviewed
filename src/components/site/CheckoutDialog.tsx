import { useEffect, useState } from "react";
import { CreditCard, Smartphone, Bitcoin, Loader2, X, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Gateway = "stripe" | "paystack" | "binance";

declare global {
  interface Window { PaystackPop?: any }
}

const PAYSTACK_SCRIPT = "https://js.paystack.co/v1/inline.js";

function loadPaystack(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("SSR"));
    if (window.PaystackPop) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${PAYSTACK_SCRIPT}"]`);
    if (existing) { existing.addEventListener("load", () => resolve()); return; }
    const s = document.createElement("script");
    s.src = PAYSTACK_SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Paystack"));
    document.head.appendChild(s);
  });
}

export type CheckoutInput = {
  amount: number;
  currency?: string;
  email: string;
  description: string;
  platform?: string;
  quantity?: number;
};

export function CheckoutDialog({
  open, onClose, input, onPaid,
}: { open: boolean; onClose: () => void; input: CheckoutInput; onPaid?: (orderId: string) => void }) {
  const [gateway, setGateway] = useState<Gateway>("stripe");
  const [cryptoAsset, setCryptoAsset] = useState<"USDT" | "LTC">("USDT");
  const [loading, setLoading] = useState(false);
  const [paystackKey, setPaystackKey] = useState("pk_test_paystack");
  const [binanceQr, setBinanceQr] = useState<string | null>(null);
  const [paid, setPaid] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setBinanceQr(null); setPaid(null);
    supabase.from("payment_settings").select("paystack_public_key").eq("id", 1).maybeSingle()
      .then(({ data }) => { if (data?.paystack_public_key) setPaystackKey(data.paystack_public_key); });
    loadPaystack().catch(() => {});
  }, [open]);

  if (!open) return null;

  async function createOrder(g: Gateway, currency: string) {
    const { data, error } = await supabase.from("orders").insert({
      customer_email: input.email,
      amount: input.amount,
      currency,
      gateway: g,
      platform: input.platform ?? null,
      quantity: input.quantity ?? null,
      crypto_asset: g === "binance" ? cryptoAsset : null,
      metadata: { description: input.description },
    }).select("id").single();
    if (error || !data) throw new Error(error?.message || "Failed to create order");
    return data.id as string;
  }

  async function pay() {
    setLoading(true);
    try {
      if (gateway === "stripe") {
        const orderId = await createOrder("stripe", input.currency || "USD");
        const { data, error } = await supabase.functions.invoke("direct-stripe-checkout", {
          body: {
            orderId, amount: input.amount, currency: input.currency || "USD",
            email: input.email, description: input.description,
            successUrl: `${window.location.origin}/dashboard?paid=${orderId}`,
            cancelUrl: `${window.location.origin}/dashboard?cancelled=${orderId}`,
          },
        });
        if (error || !data?.url) throw new Error(error?.message || data?.error || "Stripe error");
        window.location.href = data.url;
      } else if (gateway === "paystack") {
        await loadPaystack();
        if (!window.PaystackPop) throw new Error("Paystack not loaded");
        const orderId = await createOrder("paystack", "KES");
        const amountKes = Math.round(input.amount * 130 * 100); // rough USD→KES kobo
        const handler = window.PaystackPop.setup({
          key: paystackKey,
          email: input.email,
          amount: amountKes,
          currency: "KES",
          ref: orderId,
          onClose: () => { setLoading(false); },
          callback: async (resp: any) => {
            await supabase.from("orders").update({ status: "Paid", gateway_reference: resp.reference }).eq("id", orderId);
            setPaid(orderId); onPaid?.(orderId);
            toast.success("Payment successful");
          },
        });
        handler.openIframe();
        return; // keep dialog open until callback
      } else {
        const orderId = await createOrder("binance", cryptoAsset);
        const { data, error } = await supabase.functions.invoke("binance-checkout", {
          body: { orderId, amount: input.amount, currency: cryptoAsset, description: input.description, email: input.email },
        });
        if (error || !data?.checkoutUrl) throw new Error(error?.message || data?.error || "Binance Pay error");
        setBinanceQr(data.qrcodeLink || data.checkoutUrl);
        window.open(data.checkoutUrl, "_blank");
      }
    } catch (e: any) {
      toast.error(e.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl border border-border shadow-xl max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        {paid ? (
          <div className="text-center py-6">
            <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-3" />
            <h3 className="text-lg font-bold">Payment received</h3>
            <p className="text-sm text-muted-foreground mt-1">Order {paid.slice(0, 8)} marked as Paid.</p>
            <button onClick={onClose} className="mt-4 h-10 px-4 rounded-md bg-primary text-primary-foreground font-semibold">Close</button>
          </div>
        ) : binanceQr ? (
          <div className="text-center py-2">
            <h3 className="text-lg font-bold mb-2">Scan to pay with Binance</h3>
            <p className="text-xs text-muted-foreground mb-4">Asset: {cryptoAsset} · ${input.amount}</p>
            <img src={binanceQr} alt="Binance Pay QR" className="mx-auto h-56 w-56 border border-border rounded-lg bg-white p-2" />
            <p className="mt-3 text-xs text-muted-foreground">A new tab also opened with the Binance checkout. Your order will update to Paid once the payment confirms.</p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-foreground">Select payment method</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{input.description} · ${input.amount.toFixed(2)}</p>
            <div className="mt-5 space-y-2">
              <Option icon={CreditCard} title="Credit Card (Stripe)" desc="Pay with Visa, Mastercard, Amex" selected={gateway === "stripe"} onClick={() => setGateway("stripe")} />
              <Option icon={Smartphone} title="M-Pesa / Local Card (Paystack)" desc="KES via Paystack" selected={gateway === "paystack"} onClick={() => setGateway("paystack")} />
              <Option icon={Bitcoin} title="Crypto (Binance Pay)" desc="USDT or LTC" selected={gateway === "binance"} onClick={() => setGateway("binance")} />
              {gateway === "binance" && (
                <div className="ml-7 flex gap-2 pt-1">
                  {(["USDT", "LTC"] as const).map((a) => (
                    <button key={a} type="button" onClick={() => setCryptoAsset(a)}
                      className={`px-3 h-8 rounded-md text-xs font-semibold border ${cryptoAsset === a ? "bg-primary text-primary-foreground border-primary" : "border-border bg-background"}`}>{a}</button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={pay} disabled={loading} className="mt-6 w-full h-11 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60 inline-flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} Pay ${input.amount.toFixed(2)}
            </button>
            <p className="mt-3 text-[11px] text-muted-foreground text-center">Test mode — no real charges. Funds go directly to your account on success.</p>
          </>
        )}
      </div>
    </div>
  );
}

function Option({ icon: Icon, title, desc, selected, onClick }: { icon: any; title: string; desc: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`w-full text-left flex items-center gap-3 rounded-lg border p-3 transition ${selected ? "border-primary bg-accent" : "border-border hover:border-primary/50"}`}>
      <span className={`h-8 w-8 rounded-md flex items-center justify-center ${selected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-foreground">{title}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </span>
      <span className={`h-4 w-4 rounded-full border-2 ${selected ? "border-primary bg-primary" : "border-border"}`} />
    </button>
  );
}