import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — ReviewMarket" },
      { name: "description", content: "Simple, transparent pricing for review packages. Pay only for approved reviews. No subscriptions." },
      { property: "og:title", content: "Pricing — ReviewMarket" },
      { property: "og:description", content: "Starter, Growth and Enterprise packages for every business size." },
    ],
  }),
  component: Page,
});

const tiers = [
  {
    name: "Starter",
    price: 99,
    reviews: 10,
    blurb: "Perfect for new local businesses testing the waters.",
    features: ["10 verified reviews", "1 platform of your choice", "Standard delivery (7 days)", "Approve/reject control", "Email support"],
  },
  {
    name: "Growth",
    price: 349,
    reviews: 50,
    blurb: "Most popular — for growing brands building reputation.",
    features: ["50 verified reviews", "Up to 3 platforms", "Priority delivery (4 days)", "Custom tone & keywords", "Priority chat support", "Reviewer targeting"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: 1299,
    reviews: 250,
    blurb: "For agencies and large brands at scale.",
    features: ["250+ verified reviews", "All platforms", "Express delivery (2 days)", "Dedicated account manager", "API access", "Custom contracts & invoicing"],
  },
];

function Page() {
  return (
    <SiteLayout>
      <section className="py-16 lg:py-20 bg-section border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Simple, transparent pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground">Pay upfront, approve each review. No hidden fees, no subscriptions.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div key={t.name} className={`relative rounded-2xl p-8 ${t.featured ? "bg-primary text-primary-foreground shadow-card scale-[1.02]" : "bg-background border border-border"}`}>
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
                  <Sparkles className="h-3 w-3" /> Most Popular
                </span>
              )}
              <h3 className={`text-xl font-bold ${t.featured ? "" : "text-foreground"}`}>{t.name}</h3>
              <p className={`mt-2 text-sm ${t.featured ? "opacity-90" : "text-muted-foreground"}`}>{t.blurb}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold">${t.price}</span>
                <span className={t.featured ? "opacity-80" : "text-muted-foreground"}>/ pack</span>
              </div>
              <div className={`mt-1 text-sm ${t.featured ? "opacity-80" : "text-muted-foreground"}`}>
                ${(t.price / t.reviews).toFixed(2)} per review
              </div>
              <ul className="mt-6 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${t.featured ? "" : "text-primary"}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/auth"
                className={`mt-8 block w-full text-center rounded-md py-2.5 text-sm font-semibold transition-colors ${t.featured ? "bg-background text-primary hover:opacity-90" : "bg-primary text-primary-foreground hover:bg-primary-hover"}`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>
      <section className="pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Need a custom volume or white-label deal? <Link to="/contact" className="text-primary font-semibold hover:underline">Talk to sales →</Link></p>
        </div>
      </section>
    </SiteLayout>
  );
}