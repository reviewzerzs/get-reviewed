import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, KeyRound } from "lucide-react";
import { savePaymentSettings, claimFirstAdmin } from "@/lib/payment-settings.functions";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Developer Settings — Payment Keys" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [stripe, setStripe] = useState("");
  const [ltcAddress, setLtcAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setAuthed(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

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
    try {
      await savePaymentSettings({ data: { stripe_public_key: stripe, ltc_wallet_address: ltcAddress } });
      toast.success("Settings saved");
    } catch (e: any) {
      toast.error(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (authed === false) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Admin sign-in required</h1>
          <p className="text-sm text-muted-foreground mb-6">You must be signed in with an admin account to change payment settings.</p>
          <Link to="/auth" className="inline-flex h-10 items-center px-5 rounded-md bg-primary text-primary-foreground font-semibold">Sign in</Link>
        </section>
      </SiteLayout>
    );
  }

  async function claimAdmin() {
    try {
      const res = await claimFirstAdmin();
      if (res.ok) toast.success(res.message);
      else toast.info(res.message);
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    }
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

        <div className="mt-6 rounded-lg border border-border bg-section p-5 text-sm">
          <h2 className="font-semibold text-foreground mb-2">First-time admin setup</h2>
          <p className="text-xs text-muted-foreground mb-3">
            If no admin exists yet, click below to claim the admin role for your currently signed-in account.
            Once an admin exists this button does nothing.
          </p>
          <button type="button" onClick={claimAdmin} className="inline-flex h-9 px-4 rounded-md border border-border text-xs font-semibold hover:border-primary">
            Claim admin role
          </button>
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