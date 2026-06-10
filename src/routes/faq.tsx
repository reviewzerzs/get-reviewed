import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — ReviewMarket" },
      { name: "description", content: "Answers to the most common questions about buying reviews, earning as a reviewer, payments, and trust." },
      { property: "og:title", content: "FAQ — ReviewMarket" },
      { property: "og:description", content: "Everything you need to know before getting started." },
    ],
  }),
  component: Page,
});

const faqs = [
  { q: "Are the reviews from real people?", a: "Yes. Every reviewer is verified with ID and a real account history. We never use bots or fake profiles." },
  { q: "How do payments work?", a: "When you place an order, you pay upfront via secure card checkout. Payment goes directly to ReviewMarket and your campaign launches immediately. If a review is rejected, it's replaced free of charge." },
  { q: "Which platforms are supported?", a: "Google, Yelp, Facebook, Trustpilot, TripAdvisor, Amazon, G2, Capterra and several niche directories. You can target one or many in a single order." },
  { q: "How fast are reviews delivered?", a: "Standard delivery is 7 days. Priority (4 days) and Express (2 days) options are available on every package." },
  { q: "Can I specify tone, keywords or wording?", a: "Yes. You can set tone (enthusiastic, neutral, detailed), suggest keywords, and provide instructions. Reviewers write the actual copy in their own voice." },
  { q: "How do reviewers get paid?", a: "Earnings accumulate in your reviewer wallet as orders are approved. You can withdraw to PayPal, Wise or bank transfer once you reach the $25 minimum." },
  { q: "Is this allowed by Google / Yelp / Facebook?", a: "Platforms have varying policies on incentivized reviews. ReviewMarket connects you with real users sharing genuine experiences — you remain responsible for compliance with each platform's terms." },
  { q: "Can I get a refund?", a: "If we can't deliver an approved review for your order, the unfulfilled portion is refunded back to your original payment method." },
  { q: "Do you offer white-label or API access?", a: "Yes, on the Enterprise plan. Contact sales for custom contracts and reseller terms." },
];

function Page() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <SiteLayout>
      <section className="py-16 lg:py-20 bg-section border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Frequently asked questions</h1>
          <p className="mt-4 text-lg text-muted-foreground">Can't find what you're looking for? <Link to="/contact" className="text-primary font-semibold hover:underline">Get in touch</Link>.</p>
        </div>
      </section>
      <section className="py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="rounded-xl border border-border bg-background overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-section"
              >
                <span className="font-semibold text-foreground">{f.q}</span>
                <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-muted-foreground">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}