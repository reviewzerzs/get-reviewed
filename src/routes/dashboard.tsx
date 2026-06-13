import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useUser, setUser } from "@/lib/auth-store";
import { ShoppingBag, PenLine, Star, DollarSign, CheckCircle2, Clock, Plus, LogOut, TrendingUp } from "lucide-react";
import { Upload, ExternalLink } from "lucide-react";
import { CheckoutDialog } from "@/components/site/CheckoutDialog";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ReviewMarket" }] }),
  component: Dashboard,
});

function Dashboard() {
  const user = useUser();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    if (typeof window !== "undefined" && !localStorage.getItem("rm_user")) {
      navigate({ to: "/auth" });
    }
  }, [navigate]);

  if (!ready || !user) {
    return (
      <SiteLayout>
        <div className="py-20 text-center text-muted-foreground text-sm">Loading…</div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="bg-section border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              {user.role === "company" ? "Company dashboard" : "Reviewer dashboard"}
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-foreground">Welcome, {user.name} 👋</h1>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          </div>
          <button
            onClick={() => { setUser(null); navigate({ to: "/" }); }}
            className="inline-flex items-center gap-2 self-start rounded-md border border-border bg-background px-4 h-10 text-sm font-semibold hover:border-primary"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {user.role === "company" ? <CompanyView /> : <ReviewerView />}
      </section>
    </SiteLayout>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center text-primary mb-3">
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function CompanyView() {
  const [orders, setOrders] = useState<Array<{ id: string; platform: string; qty: number; status: string }>>([]);
  const [showForm, setShowForm] = useState(false);
  const [platform, setPlatform] = useState("Google");
  const [qty, setQty] = useState(5);
  const [checkout, setCheckout] = useState<null | { amount: number; platform: string; qty: number }>(null);
  const user = useUser();

  const place = (e: React.FormEvent) => {
    e.preventDefault();
    const pricePerReview = 8;
    setCheckout({ amount: pricePerReview * qty, platform, qty });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingBag} label="Active orders" value={String(orders.filter(o => o.status !== "Completed").length)} />
        <StatCard icon={CheckCircle2} label="Approved reviews" value={String(orders.filter(o => o.status === "Completed").reduce((s, o) => s + o.qty, 0))} />
        <StatCard icon={Star} label="Average rating" value={orders.length ? "5.0" : "—"} />
        <StatCard icon={DollarSign} label="Account balance" value={`$${orders.reduce((s, o) => s + o.qty * 8, 0)}`} />
      </div>

      <div className="rounded-xl border border-border bg-background">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-semibold text-foreground">Your campaigns</h2>
          <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground h-9 px-3 text-sm font-semibold hover:bg-primary-hover">
            <Plus className="h-4 w-4" /> New order
          </button>
        </div>
        {showForm && (
          <form onSubmit={place} className="p-5 border-b border-border grid sm:grid-cols-3 gap-3 bg-section">
            <label className="text-sm">
              <span className="block font-semibold mb-1.5 text-foreground">Platform</span>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                {["Google", "Yelp", "Facebook", "Trustpilot", "TripAdvisor", "Amazon"].map((p) => <option key={p}>{p}</option>)}
              </select>
            </label>
            <label className="text-sm">
              <span className="block font-semibold mb-1.5 text-foreground">Quantity</span>
              <input type="number" min={1} max={500} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" />
            </label>
            <div className="flex items-end">
              <button type="submit" className="w-full h-10 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary-hover">Pay & launch campaign</button>
            </div>
          </form>
        )}
        <div className="divide-y divide-border">
          {orders.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <div className="font-semibold text-foreground text-sm">{o.id} · {o.platform}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{o.qty} reviews</div>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${o.status === "Completed" ? "bg-success/10 text-success" : o.status === "Pending" ? "bg-accent text-primary" : "bg-accent text-primary"}`}>
                {o.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      {checkout && (
        <CheckoutDialog
          open={!!checkout}
          onClose={() => setCheckout(null)}
          input={{
            amount: checkout.amount,
            email: user?.email || "guest@example.com",
            description: `${checkout.qty} ${checkout.platform} reviews`,
            platform: checkout.platform,
            quantity: checkout.qty,
          }}
          onPaid={(orderId) => {
            setOrders([{ id: orderId.slice(0, 8).toUpperCase(), platform: checkout.platform, qty: checkout.qty, status: "In Progress" }, ...orders]);
            setShowForm(false);
            setCheckout(null);
          }}
        />
      )}
    </div>
  );
}

function ReviewerView() {
  const [jobs, setJobs] = useState([
    { id: "J-301", platform: "Google", business: "Bella Pizza NYC", payout: 8, words: "80+" },
    { id: "J-302", platform: "Trustpilot", business: "NorthGear Outdoors", payout: 12, words: "120+" },
    { id: "J-303", platform: "Yelp", business: "Sunrise Yoga Studio", payout: 10, words: "100+" },
    { id: "J-304", platform: "Facebook", business: "Loop Coffee Roasters", payout: 7, words: "80+" },
  ]);
  type JobState = "open" | "claimed" | "in_progress" | "submitted";
  const [states, setStates] = useState<Record<string, JobState>>({});
  const [submissions, setSubmissions] = useState<Record<string, { screenshot: string; note: string }>>({});
  const [activeJob, setActiveJob] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const user = useUser();
  const payoutKey = `rm_payout_${user?.email || "anon"}`;
  const [paypal, setPaypal] = useState("");
  const [payoneer, setPayoneer] = useState("");
  const [savedPayout, setSavedPayout] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(payoutKey);
      if (raw) {
        const p = JSON.parse(raw);
        setPaypal(p.paypal || "");
        setPayoneer(p.payoneer || "");
        setSavedPayout(!!(p.paypal || p.payoneer));
      }
    } catch {}
  }, [payoutKey]);
  const savePayout = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(payoutKey, JSON.stringify({ paypal, payoneer }));
    setSavedPayout(true);
  };

  const submittedJobs = jobs.filter((j) => states[j.id] === "submitted");
  const completedCount = submittedJobs.length;
  const pendingPayout = submittedJobs.reduce((s, j) => s + j.payout, 0);
  const totalEarned = pendingPayout; // becomes "paid" after company approves; placeholder same value

  const setState = (id: string, s: JobState) => setStates((m) => ({ ...m, [id]: s }));
  const claim = (id: string) => {
    if (!savedPayout) {
      alert("Please add your PayPal or Payoneer email first so we can pay you.");
      return;
    }
    setState(id, "claimed");
  };
  const startJob = (id: string, platform: string, business: string) => {
    setState(id, "in_progress");
    const url = `https://www.google.com/search?q=${encodeURIComponent(`${business} ${platform} review`)}`;
    if (typeof window !== "undefined") window.open(url, "_blank");
  };
  const openSubmit = (id: string) => {
    setActiveJob(id);
    setScreenshot(submissions[id]?.screenshot || "");
    setNote(submissions[id]?.note || "");
  };
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setScreenshot(String(r.result));
    r.readAsDataURL(f);
  };
  const submitProof = () => {
    if (!activeJob || !screenshot) return;
    setSubmissions((m) => ({ ...m, [activeJob]: { screenshot, note } }));
    setState(activeJob, "submitted");
    setActiveJob(null);
    setScreenshot("");
    setNote("");
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Total earned" value={`$${totalEarned}`} />
        <StatCard icon={Clock} label="Pending payout" value={`$${pendingPayout}`} />
        <StatCard icon={CheckCircle2} label="Completed jobs" value={String(completedCount)} />
        <StatCard icon={TrendingUp} label="Reviewer rating" value={completedCount ? "5.0" : "—"} />
      </div>

      <form onSubmit={savePayout} className="rounded-xl border border-border bg-background p-5 space-y-4">
        <div>
          <h2 className="font-semibold text-foreground">Payout details</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Add at least one payout email. You'll be paid here after each approved job.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="block font-semibold mb-1.5 text-foreground">PayPal email</span>
            <input type="email" value={paypal} onChange={(e) => setPaypal(e.target.value)} placeholder="you@paypal.com" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" />
          </label>
          <label className="block text-sm">
            <span className="block font-semibold mb-1.5 text-foreground">Payoneer email</span>
            <input type="email" value={payoneer} onChange={(e) => setPayoneer(e.target.value)} placeholder="you@payoneer.com" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" />
          </label>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={!paypal && !payoneer} className="h-10 rounded-md bg-primary text-primary-foreground px-4 text-sm font-semibold hover:bg-primary-hover disabled:opacity-50">Save payout details</button>
          {savedPayout && <span className="text-xs text-success font-semibold inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Saved</span>}
        </div>
      </form>

      <div className="rounded-xl border border-border bg-background">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-foreground">Open jobs near you</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Claim a job, submit your review, and get paid directly to your account.</p>
        </div>
        <div className="divide-y divide-border">
          {jobs.map((j) => {
            const st = states[j.id] || "open";
            return (
              <div key={j.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <div className="font-semibold text-foreground text-sm">{j.business}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{j.platform} · {j.words} words · {j.id}</div>
                  {submissions[j.id]?.screenshot && (
                    <img src={submissions[j.id].screenshot} alt="proof" className="mt-2 h-16 rounded border border-border" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">${j.payout}</span>
                  {st === "open" && (
                    <button onClick={() => claim(j.id)} className="h-9 rounded-md bg-primary text-primary-foreground px-3 text-sm font-semibold hover:bg-primary-hover">
                      Claim job
                    </button>
                  )}
                  {st === "claimed" && (
                    <button onClick={() => startJob(j.id, j.platform, j.business)} className="h-9 inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 text-sm font-semibold hover:bg-primary-hover">
                      <ExternalLink className="h-3.5 w-3.5" /> Do job
                    </button>
                  )}
                  {st === "in_progress" && (
                    <>
                      <button onClick={() => startJob(j.id, j.platform, j.business)} className="h-9 rounded-md border border-border bg-background px-3 text-sm font-semibold hover:border-primary">
                        Reopen
                      </button>
                      <button onClick={() => openSubmit(j.id)} className="h-9 inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 text-sm font-semibold hover:bg-primary-hover">
                        <Upload className="h-3.5 w-3.5" /> Submit proof
                      </button>
                    </>
                  )}
                  {st === "submitted" && (
                    <span className="text-xs font-semibold text-success inline-flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Submitted · awaiting review
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Need help getting started? Read the <Link to="/how-it-works" className="text-primary font-semibold">reviewer guide</Link>.
      </p>

      {activeJob && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setActiveJob(null)}>
          <div className="w-full max-w-md rounded-xl bg-background border border-border p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div>
              <h3 className="font-semibold text-foreground">Submit review proof</h3>
              <p className="text-xs text-muted-foreground mt-1">Upload a screenshot of your published review for job {activeJob}.</p>
            </div>
            <label className="block text-sm">
              <span className="block font-semibold mb-1.5 text-foreground">Screenshot</span>
              <input type="file" accept="image/*" onChange={onFile} className="block w-full text-sm" />
            </label>
            {screenshot && <img src={screenshot} alt="preview" className="max-h-48 rounded border border-border" />}
            <label className="block text-sm">
              <span className="block font-semibold mb-1.5 text-foreground">Notes (optional)</span>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Review URL or any context for the company…" />
            </label>
            <div className="flex justify-end gap-2">
              <button onClick={() => setActiveJob(null)} className="h-9 rounded-md border border-border bg-background px-3 text-sm font-semibold hover:border-primary">Cancel</button>
              <button onClick={submitProof} disabled={!screenshot} className="h-9 rounded-md bg-primary text-primary-foreground px-3 text-sm font-semibold hover:bg-primary-hover disabled:opacity-50">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}