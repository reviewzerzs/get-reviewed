import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Calculator as CalcIcon } from "lucide-react";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Reviews Calculator — ReviewMarket" },
      { name: "description", content: "Estimate the cost of your review campaign instantly. Adjust quantity, platforms, tone and delivery speed." },
      { property: "og:title", content: "Reviews Calculator — ReviewMarket" },
      { property: "og:description", content: "Get an instant estimate for your review order." },
    ],
  }),
  component: Page,
});

function Page() {
  const [qty, setQty] = useState(25);
  const [platforms, setPlatforms] = useState(1);
  const [speed, setSpeed] = useState<"standard" | "priority" | "express">("standard");
  const [tone, setTone] = useState<"basic" | "custom">("basic");

  const total = useMemo(() => {
    const base = qty * 9.5;
    const platformFee = (platforms - 1) * qty * 1.5;
    const speedMult = speed === "express" ? 1.4 : speed === "priority" ? 1.15 : 1;
    const toneFee = tone === "custom" ? qty * 1.25 : 0;
    return Math.round((base + platformFee + toneFee) * speedMult);
  }, [qty, platforms, speed, tone]);

  return (
    <SiteLayout>
      <section className="py-16 lg:py-20 bg-section border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary mb-4">
            <CalcIcon className="h-3.5 w-3.5" /> Instant estimate
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Reviews Calculator</h1>
          <p className="mt-4 text-lg text-muted-foreground">Adjust the sliders to see your estimated campaign cost in real time.</p>
        </div>
      </section>
      <section className="py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-7 rounded-2xl border border-border bg-background p-8">
            <Field label="Number of reviews" value={qty}>
              <input type="range" min={5} max={500} step={5} value={qty} onChange={(e) => setQty(+e.target.value)} className="w-full accent-[color:var(--primary)]" />
              <div className="text-xs text-muted-foreground mt-1">Min 5 — Max 500</div>
            </Field>
            <Field label="Number of platforms" value={`${platforms} platform${platforms > 1 ? "s" : ""}`}>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setPlatforms(n)} className={`flex-1 py-2 rounded-md text-sm font-semibold border ${platforms === n ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary"}`}>{n}</button>
                ))}
              </div>
            </Field>
            <Field label="Delivery speed">
              <div className="grid grid-cols-3 gap-2">
                {([["standard", "7 days"], ["priority", "4 days"], ["express", "2 days"]] as const).map(([k, l]) => (
                  <button key={k} onClick={() => setSpeed(k)} className={`py-2.5 rounded-md text-sm font-semibold border capitalize ${speed === k ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary"}`}>
                    <div>{k}</div>
                    <div className={`text-xs font-normal ${speed === k ? "opacity-90" : "text-muted-foreground"}`}>{l}</div>
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Content tone">
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setTone("basic")} className={`py-2.5 rounded-md text-sm font-semibold border ${tone === "basic" ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary"}`}>Basic</button>
                <button onClick={() => setTone("custom")} className={`py-2.5 rounded-md text-sm font-semibold border ${tone === "custom" ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary"}`}>Custom (+$1.25)</button>
              </div>
            </Field>
          </div>
          <aside className="rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-primary-foreground p-8 h-fit sticky top-20 shadow-card">
            <div className="text-sm opacity-90">Estimated total</div>
            <div className="text-5xl font-bold mt-2">${total.toLocaleString()}</div>
            <div className="mt-1 text-sm opacity-90">≈ ${(total / qty).toFixed(2)} per review</div>
            <div className="mt-6 space-y-2 text-sm opacity-95 border-t border-white/20 pt-5">
              <Row k="Reviews" v={qty.toString()} />
              <Row k="Platforms" v={platforms.toString()} />
              <Row k="Speed" v={speed} />
              <Row k="Tone" v={tone} />
            </div>
            <Link to="/auth" className="mt-7 block text-center rounded-md bg-background text-primary py-2.5 text-sm font-semibold hover:opacity-90">
              Place this order
            </Link>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, value, children }: { label: string; value?: string | number; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <label className="font-semibold text-foreground">{label}</label>
        {value !== undefined && <span className="text-sm font-semibold text-primary">{value}</span>}
      </div>
      {children}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between capitalize"><span>{k}</span><span className="font-semibold">{v}</span></div>;
}