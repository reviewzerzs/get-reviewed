import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useUser, setUser } from "@/lib/auth-store";
import { ShoppingBag, PenLine, Star, DollarSign, CheckCircle2, Clock, Plus, LogOut, TrendingUp } from "lucide-react";

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
  const [orders, setOrders] = useState<Array<{ id: string; platform: string; qty: number; status: string }>>([
    { id: "ORD-1042", platform: "Google", qty: 10, status: "In Progress" },
    { id: "ORD-1039", platform: "Trustpilot", qty: 5, status: "Completed" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [platform, setPlatform] = useState("Google");
  const [qty, setQty] = useState(5);

  const place = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `ORD-${1043 + orders.length}`;
    setOrders([{ id, platform, qty, status: "Pending" }, ...orders]);
    setShowForm(false);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingBag} label="Active orders" value={String(orders.filter(o => o.status !== "Completed").length)} />
        <StatCard icon={CheckCircle2} label="Approved reviews" value="23" />
        <StatCard icon={Star} label="Average rating" value="4.8" />
        <StatCard icon={DollarSign} label="Account balance" value="$420" />
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
  const [claimed, setClaimed] = useState<string[]>([]);

  const claim = (id: string) => setClaimed((c) => c.includes(id) ? c : [...c, id]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Total earned" value="$246" />
        <StatCard icon={Clock} label="Pending payout" value="$32" />
        <StatCard icon={CheckCircle2} label="Completed jobs" value="18" />
        <StatCard icon={TrendingUp} label="Reviewer rating" value="4.9" />
      </div>

      <div className="rounded-xl border border-border bg-background">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-foreground">Open jobs near you</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Claim a job, submit your review, and get paid directly to your account.</p>
        </div>
        <div className="divide-y divide-border">
          {jobs.map((j) => (
            <div key={j.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <div className="font-semibold text-foreground text-sm">{j.business}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{j.platform} · {j.words} words · {j.id}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-primary">${j.payout}</span>
                {claimed.includes(j.id) ? (
                  <span className="text-xs font-semibold text-success inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Claimed</span>
                ) : (
                  <button onClick={() => claim(j.id)} className="h-9 rounded-md bg-primary text-primary-foreground px-3 text-sm font-semibold hover:bg-primary-hover">
                    Claim job
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Need help getting started? Read the <Link to="/how-it-works" className="text-primary font-semibold">reviewer guide</Link>.
      </p>
    </div>
  );
}