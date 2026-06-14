import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefreshCw, CheckCircle2, ShieldCheck } from "lucide-react";
import { listOrdersAdmin, approveOrderAdmin } from "@/lib/orders.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Orders & Payments" }] }),
  component: AdminPage,
});

type Order = {
  id: string;
  customer_email: string;
  amount: number;
  currency: string;
  gateway: string;
  status: string;
  gateway_reference: string | null;
  customer_reference: string | null;
  platform: string | null;
  quantity: number | null;
  crypto_asset: string | null;
  created_at: string;
};

function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setAuthed(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    if (!authed) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await listOrdersAdmin();
      setOrders((res.orders as Order[]) || []);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [authed]);

  useEffect(() => { load(); }, [load]);

  async function markPaid(id: string) {
    setConfirming(id);
    try {
      await approveOrderAdmin({ data: { orderId: id } });
    } catch (e: any) {
      setConfirming(null);
      toast.error(e?.message || "Failed to approve");
      return;
    }
    setConfirming(null);
    toast.success("Payment confirmed — order marked as Paid");
    load();
  }

  const gatewayLabel = (o: Order) =>
    o.gateway === "stripe" ? "Card (Stripe)" : o.gateway === "binance" ? `Crypto (${o.crypto_asset || "LTC"})` : o.gateway;

  if (authed === false) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-md px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Admin sign-in required</h1>
          <p className="text-sm text-muted-foreground mb-6">You must be signed in with an admin account to view orders.</p>
          <Link to="/auth" className="inline-flex h-10 items-center px-5 rounded-md bg-primary text-primary-foreground font-semibold">Sign in</Link>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent text-primary flex items-center justify-center"><ShieldCheck className="h-5 w-5" /></div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Orders & Payments</h1>
              <p className="text-sm text-muted-foreground">Review orders and manually confirm crypto payments.</p>
            </div>
          </div>
          <button onClick={load} className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-border text-sm font-semibold hover:border-primary">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        <div className="rounded-xl border border-border bg-background overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="p-3 font-semibold">Order</th>
                <th className="p-3 font-semibold">Customer</th>
                <th className="p-3 font-semibold">Method</th>
                <th className="p-3 font-semibold">Amount</th>
                <th className="p-3 font-semibold">Customer-submitted ref</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && orders.length === 0 ? (
                <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Loading…</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No orders yet.</td></tr>
              ) : orders.map((o) => (
                <tr key={o.id}>
                  <td className="p-3">
                    <div className="font-semibold text-foreground">{o.id.slice(0, 8).toUpperCase()}</div>
                    <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</div>
                  </td>
                  <td className="p-3 text-foreground">{o.customer_email}</td>
                  <td className="p-3">{gatewayLabel(o)}</td>
                  <td className="p-3 font-semibold text-foreground">${Number(o.amount).toFixed(2)} <span className="text-xs text-muted-foreground">{o.currency}</span></td>
                  <td className="p-3 max-w-[180px] text-xs">
                    {o.customer_reference ? (
                      <code className="text-foreground break-all" title={o.customer_reference}>{o.customer_reference}</code>
                    ) : <span className="text-muted-foreground">—</span>}
                    {o.gateway_reference && (
                      <div className="text-[10px] text-muted-foreground mt-0.5 truncate" title={o.gateway_reference}>sys: {o.gateway_reference}</div>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${o.status === "Paid" ? "bg-success/10 text-success" : o.status === "failed" || o.status === "cancelled" ? "bg-destructive/10 text-destructive" : "bg-accent text-primary"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {o.status !== "Paid" && o.status !== "failed" && o.status !== "cancelled" && (
                      <button
                        onClick={() => markPaid(o.id)}
                        disabled={confirming === o.id}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-60"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> {confirming === o.id ? "Approving…" : "Approve"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Customers paste their Stripe payment ID or LTC transaction hash after paying — orders move to <strong>awaiting_verification</strong>. Verify the payment in Stripe / your Binance wallet, then click <strong>Approve</strong>.
        </p>
      </section>
    </SiteLayout>
  );
}