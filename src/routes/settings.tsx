import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, KeyRound } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Developer Settings — Payment Keys" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [stripe, setStripe] = useState("");
  const [ltcAddress, setLtcAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("payment_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => {
      if (data) {
        setStripe(data.stripe_public_key || "");
        setLtcAddress(data.ltc_wallet_address || "");
      }
      setLoading(false);
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("payment_settings").upsert({
      id: 1, stripe_public_key: stripe, ltc_wallet_address: ltcAddress,
    });
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Settings saved");
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg bg-accent text-primary flex items-center justify-center"><KeyRound className="h-5 w-5" /></div>
          <h1 className="text-2xl font-bold">Developer Payment Settings</h1>
        </div>
        <p className="text-sm text-muted-foreground">Publishable / public keys only. Secret keys are stored as backend secrets and never exposed to the browser.</p>

        {loading ? <p className="mt-8 text-sm text-muted-foreground">Loading…</p> : (
          <form onSubmit={save} className="mt-8 space-y-5">
            <Field label="Stripe publishable key" placeholder="pk_test_..." value={stripe} onChange={setStripe} hint="Get from Stripe dashboard → Developers → API keys." />
            <Field label="Binance LTC wallet address" placeholder="ltc1q... or L... / M..." value={ltcAddress} onChange={setLtcAddress} hint="Binance app → Wallet → Deposit → Litecoin (LTC) → copy your deposit address. Shown to crypto customers at checkout." />
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 h-10 px-5 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60">
              <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save settings"}
            </button>
          </form>
        )}

        <div className="mt-10 rounded-lg border border-border bg-section p-5 text-sm">
          <h2 className="font-semibold text-foreground mb-2">Backend secrets (required)</h2>
          <p className="text-muted-foreground text-xs mb-3">These must be set as edge function secrets, not entered here:</p>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li><code className="text-foreground">STRIPE_SECRET_KEY</code> — sk_test_… for the Stripe Checkout edge function</li>
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, placeholder, value, onChange, hint }: { label: string; placeholder: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-foreground mb-1.5">{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm font-mono" />
      {hint && <span className="block text-xs text-muted-foreground mt-1">{hint}</span>}
    </label>
  );
}