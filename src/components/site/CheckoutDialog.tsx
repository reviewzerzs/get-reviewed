import { useEffect, useState } from "react";
import { CreditCard, Bitcoin, Loader2, X, Copy, Check, AlertCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Gateway = "stripe" | "binance";

export type CheckoutInput = {
  amount: number;
  currency?: string;
  email: string;
  description: string;
  platform?: string;
  quantity?: number;
};

type CryptoOrder = {
  orderId: string;
  ltcAmount: string;
  address: string;
};

type StripeFollowup = { orderId: string };

export function CheckoutDialog({
  open, onClose, input, onPaid,
}: { open: boolean; onClose: () => void; input: CheckoutInput; onPaid?: (orderId: string) => void }) {
  const [gateway, setGateway] = useState<Gateway>("stripe");
  const [loading, setLoading] = useState(false);
  const [ltcAddress, setLtcAddress] = useState<string>("");
  const [cryptoOrder, setCryptoOrder] = useState<CryptoOrder | null>(null);
  const [stripeFollowup, setStripeFollowup] = useState<StripeFollowup | null>(null);
  const [copied, setCopied] = useState<"address" | "amount" | null>(null);
  const [txRef, setTxRef] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCryptoOrder(null);
    setStripeFollowup(null);
    setTxRef("");
    setCopied(null);
    supabase.from("payment_settings").select("ltc_wallet_address").eq("id", 1).maybeSingle()
      .then(({ data }) => { if (data?.ltc_wallet_address) setLtcAddress(data.ltc_wallet_address); });
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
      crypto_asset: g === "binance" ? "LTC" : null,
      metadata: { description: input.description },
    }).select("id").single();
    if (error || !data) throw new Error(error?.message || "Failed to create order");
    return data.id as string;
  }

  async function getLtcUsdPrice(): Promise<number> {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd");
    if (!res.ok) throw new Error("Could not fetch the live LTC price. Please try again.");
    const json = await res.json();
    const price = json?.litecoin?.usd;
    if (!price || price <= 0) throw new Error("Invalid LTC price received.");
    return price;
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
        // Open Stripe in a new tab so the dialog stays open for the user to paste their Stripe payment ID.
        window.open(data.url, "_blank", "noopener,noreferrer");
        setStripeFollowup({ orderId });
      } else {
        if (!ltcAddress) throw new Error("Crypto payments aren't configured yet. The LTC wallet address is missing — add it in Developer Settings.");
        const price = await getLtcUsdPrice();
        const ltcAmount = (input.amount / price).toFixed(6);
        const orderId = await createOrder("binance", "LTC");
        setCryptoOrder({ orderId, ltcAmount, address: ltcAddress });
      }
    } catch (e: any) {
      toast.error(e.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  async function submitProof(orderId: string, gatewayName: "stripe" | "binance") {
    if (!txRef.trim()) {
      toast.error(gatewayName === "stripe" ? "Paste your Stripe payment ID first." : "Paste your LTC transaction hash first.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("orders").update({
      customer_reference: txRef.trim(),
      status: "awaiting_verification",
    }).eq("id", orderId);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Submitted — we'll verify and approve your order shortly.");
    onPaid?.(orderId);
    onClose();
  }

  function copy(text: string, which: "address" | "amount") {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl border border-border shadow-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        {stripeFollowup ? (
          <div className="py-2">
            <h3 className="text-lg font-bold text-foreground text-center">Confirm your Stripe payment</h3>
            <p className="text-sm text-muted-foreground text-center mt-1">
              We opened Stripe Checkout in a new tab. After paying, paste your <strong className="text-foreground">Stripe payment ID</strong> (starts with <code>pi_</code> or <code>cs_</code>) below.
            </p>
            <div className="mt-4 rounded-md border border-border bg-section p-3 text-xs">
              <div className="font-semibold uppercase tracking-wide text-muted-foreground mb-1">Order reference</div>
              <code className="text-foreground">{stripeFollowup.orderId}</code>
            </div>
            <label className="block mt-4 text-sm">
              <span className="block font-semibold text-foreground mb-1.5">Stripe payment ID</span>
              <input
                type="text"
                value={txRef}
                onChange={(e) => setTxRef(e.target.value)}
                placeholder="pi_3Nx... or cs_test_..."
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm font-mono"
              />
            </label>
            <div className="mt-4 flex items-start gap-2 rounded-md bg-accent p-3 text-xs text-foreground">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
              <span>Your access will be activated as soon as we verify the payment (usually within minutes).</span>
            </div>
            <button
              onClick={() => submitProof(stripeFollowup.orderId, "stripe")}
              disabled={submitting}
              className="mt-4 w-full h-11 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Submit for verification
            </button>
          </div>
        ) : cryptoOrder ? (
          <div className="py-2">
            <h3 className="text-lg font-bold text-foreground text-center">Pay with Litecoin</h3>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Send <span className="font-bold text-foreground">exactly {cryptoOrder.ltcAmount} LTC</span> to this address
            </p>
            <div className="mt-4 flex justify-center">
              <div className="rounded-lg border border-border bg-white p-3">
                <QRCodeSVG
                  value={`litecoin:${cryptoOrder.address}?amount=${cryptoOrder.ltcAmount}&label=Order-${cryptoOrder.orderId.slice(0, 8)}`}
                  size={192}
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="rounded-md border border-border bg-section p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">LTC address (Binance wallet)</div>
                <div className="flex items-center gap-2">
                  <code className="text-xs break-all flex-1 text-foreground">{cryptoOrder.address}</code>
                  <button onClick={() => copy(cryptoOrder.address, "address")} className="shrink-0 h-8 w-8 rounded-md border border-border flex items-center justify-center hover:border-primary" aria-label="Copy address">
                    {copied === "address" ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
              <div className="rounded-md border border-border bg-section p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Amount</div>
                <div className="flex items-center gap-2">
                  <code className="text-xs flex-1 text-foreground">{cryptoOrder.ltcAmount} LTC <span className="text-muted-foreground">(≈ ${input.amount.toFixed(2)} USD)</span></code>
                  <button onClick={() => copy(cryptoOrder.ltcAmount, "amount")} className="shrink-0 h-8 w-8 rounded-md border border-border flex items-center justify-center hover:border-primary" aria-label="Copy amount">
                    {copied === "amount" ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
              <div className="rounded-md border border-border bg-section p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Order reference</div>
                <code className="text-xs text-foreground">{cryptoOrder.orderId}</code>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-md bg-accent p-3 text-xs text-foreground">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
              <span>Send only <strong>LTC</strong> on the Litecoin network. Payment will be <strong>manually confirmed</strong> — your order activates as soon as we verify the transfer (usually within a few hours).</span>
            </div>
            <label className="block mt-4 text-sm">
              <span className="block font-semibold text-foreground mb-1.5">LTC transaction hash (TxID)</span>
              <input
                type="text"
                value={txRef}
                onChange={(e) => setTxRef(e.target.value)}
                placeholder="e.g. 6f1a4b...c92e"
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm font-mono"
              />
              <span className="block mt-1 text-[11px] text-muted-foreground">Find this in your wallet's transaction history after sending.</span>
            </label>
            <button
              onClick={() => submitProof(cryptoOrder.orderId, "binance")}
              disabled={submitting}
              className="mt-4 w-full h-11 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />} I've sent the payment — submit TxID
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-foreground">Select payment method</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{input.description} · ${input.amount.toFixed(2)}</p>
            <div className="mt-5 space-y-2">
              <Option icon={CreditCard} title="Pay with Card (Stripe)" desc="Visa, Mastercard, Amex, Apple Pay" selected={gateway === "stripe"} onClick={() => setGateway("stripe")} />
              <Option icon={Bitcoin} title="Pay with Crypto (LTC)" desc="Litecoin — sent to our Binance wallet" selected={gateway === "binance"} onClick={() => setGateway("binance")} />
            </div>
            <button onClick={pay} disabled={loading} className="mt-6 w-full h-11 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60 inline-flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} {gateway === "stripe" ? `Pay $${input.amount.toFixed(2)}` : "Continue to crypto payment"}
            </button>
            <p className="mt-3 text-[11px] text-muted-foreground text-center">Stripe is in test mode — no real card charges. Crypto payments are confirmed manually.</p>
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