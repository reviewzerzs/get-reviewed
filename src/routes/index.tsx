import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Star, CheckCircle2, ShoppingBag, PenLine, ShieldCheck, Zap, Globe, Users, TrendingUp, Quote } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReviewMarket — Buy Reviews & Get Paid to Write Reviews" },
      { name: "description", content: "The trusted marketplace where businesses buy authentic reviews and reviewers earn money writing them. Google, Yelp, Facebook & more." },
      { property: "og:title", content: "ReviewMarket — The Trusted Review Marketplace" },
      { property: "og:description", content: "Buy real reviews for your business or get paid to write reviews. Join thousands worldwide." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary mb-6">
              <Zap className="h-3.5 w-3.5" /> Trusted by 12,000+ businesses worldwide
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              The Marketplace for{" "}
              <span className="text-primary">Authentic Reviews</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Businesses buy genuine reviews from real users. Reviewers earn money sharing honest experiences. One trusted platform for both.
            </p>
            <div className="mt-10 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <Link to="/auth" className="group relative rounded-xl bg-primary p-6 text-left text-primary-foreground hover:bg-primary-hover transition-all shadow-card">
                <ShoppingBag className="h-8 w-8 mb-3" />
                <div className="font-bold text-lg">Buy Google Reviews</div>
                <div className="text-sm opacity-90 mt-1">For businesses & advertisers</div>
                <div className="mt-4 text-sm font-semibold inline-flex items-center gap-1">
                  Join as Company →
                </div>
              </Link>
              <Link to="/auth" className="group relative rounded-xl bg-foreground p-6 text-left text-background hover:opacity-90 transition-all shadow-card">
                <PenLine className="h-8 w-8 mb-3" />
                <div className="font-bold text-lg">Write Reviews</div>
                <div className="text-sm opacity-80 mt-1">Get paid for honest reviews</div>
                <div className="mt-4 text-sm font-semibold inline-flex items-center gap-1">
                  Join as Reviewer →
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "250K+", label: "Reviews Delivered" },
            { value: "12K+", label: "Active Businesses" },
            { value: "45K+", label: "Verified Reviewers" },
            { value: "98%", label: "Approval Rate" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Platforms */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Reviews on every major platform</h2>
            <p className="mt-3 text-muted-foreground">Google, Yelp, Facebook, Trustpilot, TripAdvisor, Amazon and more.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Google", color: "#4285F4" },
              { name: "Yelp", color: "#D32323" },
              { name: "Facebook", color: "#1877F2" },
              { name: "Trustpilot", color: "#00B67A" },
              { name: "TripAdvisor", color: "#34E0A1" },
              { name: "Amazon", color: "#FF9900" },
            ].map((p) => (
              <Link
                key={p.name}
                to="/auth"
                className="rounded-lg border-2 bg-background p-5 text-center font-semibold transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ borderColor: p.color, color: p.color }}
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Two paths */}
      <section className="py-20 bg-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-center mb-14">One platform, two ways to win</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <PathCard
              icon={<ShoppingBag className="h-6 w-6" />}
              title="For Companies"
              desc="Place an order, pay upfront, and approve reviews as they arrive. Boost your ratings with real, verified users."
              bullets={["Multi-platform targeting", "Set tone, keywords & deadline", "Pay only for approved reviews"]}
              cta="Buy Reviews"
            />
            <PathCard
              icon={<PenLine className="h-6 w-6" />}
              title="For Reviewers"
              desc="Browse open jobs, claim what fits, submit your proof and get paid. Cash out anytime."
              bullets={["Choose jobs that match you", "Fast direct payouts", "Build reviewer reputation"]}
              cta="Start Earning"
              variant="dark"
            />
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Secure payments", desc: "Card payments processed safely. Funds go straight to your account." },
            { icon: Globe, title: "Global reviewer network", desc: "Real users in 120+ countries, ready to review." },
            { icon: TrendingUp, title: "Verified quality", desc: "Every reviewer is vetted. Every submission audited." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-border p-6 hover:shadow-card transition-shadow">
              <div className="h-11 w-11 rounded-lg bg-accent flex items-center justify-center text-primary mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-center mb-14">Loved by businesses and reviewers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "Our Google rating jumped from 3.4 to 4.7 in three months. The reviews actually convert.", name: "Sarah Chen", role: "Restaurant Owner" },
              { quote: "I earn an extra $800/month writing thoughtful reviews on weekends. Payouts are always on time.", name: "Marcus Lee", role: "Verified Reviewer" },
              { quote: "Payments are simple and direct — no middlemen, no waiting. It just works for our agency clients.", name: "Priya Patel", role: "Marketing Director" },
            ].map((t) => (
              <div key={t.name} className="rounded-xl bg-background border border-border p-6">
                <Quote className="h-6 w-6 text-primary mb-3" />
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground">{t.quote}</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="font-semibold text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-hover p-10 lg:p-14 text-center text-primary-foreground shadow-card">
            <Users className="h-10 w-10 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl lg:text-4xl font-bold">Ready to get started?</h2>
            <p className="mt-3 opacity-90 max-w-xl mx-auto">Join thousands using ReviewMarket to grow their business or earn from honest reviews.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/auth" className="inline-flex h-11 items-center justify-center rounded-md bg-background px-6 text-sm font-semibold text-primary hover:opacity-90">
                Join as Company
              </Link>
              <Link to="/auth" className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-6 text-sm font-semibold text-background hover:opacity-90">
                Join as Reviewer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function PathCard({ icon, title, desc, bullets, cta, variant = "light" }: { icon: React.ReactNode; title: string; desc: string; bullets: string[]; cta: string; variant?: "light" | "dark" }) {
  const dark = variant === "dark";
  return (
    <div className={`rounded-2xl p-8 ${dark ? "bg-foreground text-background" : "bg-background border border-border"} shadow-soft`}>
      <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-5 ${dark ? "bg-background/10 text-background" : "bg-accent text-primary"}`}>
        {icon}
      </div>
      <h3 className={`text-2xl font-bold ${dark ? "text-background" : "text-foreground"}`}>{title}</h3>
      <p className={`mt-2 ${dark ? "text-background/80" : "text-muted-foreground"}`}>{desc}</p>
      <ul className="mt-5 space-y-2.5">
        {bullets.map((b) => (
          <li key={b} className={`flex items-start gap-2 text-sm ${dark ? "text-background/90" : "text-foreground"}`}>
            <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${dark ? "text-background" : "text-primary"}`} />
            {b}
          </li>
        ))}
      </ul>
      <Link to="/auth" className={`mt-7 inline-flex h-10 items-center rounded-md px-5 text-sm font-semibold ${dark ? "bg-background text-foreground hover:opacity-90" : "bg-primary text-primary-foreground hover:bg-primary-hover"} transition-colors`}>
        {cta} →
      </Link>
    </div>
  );
}
