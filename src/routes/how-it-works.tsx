import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ShoppingBag, PenLine, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — ReviewMarket" },
      { name: "description", content: "Learn how companies buy reviews and reviewers earn money on ReviewMarket. Simple 4-step process for both sides." },
      { property: "og:title", content: "How It Works — ReviewMarket" },
      { property: "og:description", content: "Simple, transparent process for buying reviews or earning as a reviewer." },
    ],
  }),
  component: Page,
});

const companySteps = [
  { t: "Create your order", d: "Tell us your business, the platforms, number of reviews, tone, keywords, and deadline." },
  { t: "Fund the escrow", d: "Pay upfront. Funds are held safely and only released for reviews you approve." },
  { t: "Reviewers claim & deliver", d: "Verified reviewers pick your job and submit reviews with link + screenshot proof." },
  { t: "Approve or reject", d: "Review each submission. Approved reviews release escrow. Rejected ones don't cost you." },
];

const reviewerSteps = [
  { t: "Browse paid jobs", d: "See all available review opportunities matching your profile and country." },
  { t: "Claim a job", d: "One click to claim. You get a clear brief: platform, business, tone, keywords, deadline." },
  { t: "Submit your proof", d: "Post your review, then upload the live link and a screenshot to confirm." },
  { t: "Get paid", d: "Once the company approves, your earnings unlock from escrow. Cash out anytime." },
];

function Page() {
  const [tab, setTab] = useState<"company" | "reviewer">("company");
  const steps = tab === "company" ? companySteps : reviewerSteps;
  return (
    <SiteLayout>
      <section className="py-16 lg:py-20 bg-section border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">How ReviewMarket works</h1>
          <p className="mt-4 text-lg text-muted-foreground">A transparent, escrow-protected process for both sides of the marketplace.</p>
        </div>
      </section>
      <section className="py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1 rounded-lg bg-section border border-border">
              <button
                onClick={() => setTab("company")}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-colors ${tab === "company" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <ShoppingBag className="h-4 w-4" /> For Companies
              </button>
              <button
                onClick={() => setTab("reviewer")}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-colors ${tab === "reviewer" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <PenLine className="h-4 w-4" /> For Reviewers
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {steps.map((s, i) => (
              <div key={s.t} className="flex gap-5 rounded-xl border border-border p-6 hover:border-primary hover:shadow-card transition-all">
                <div className="h-11 w-11 shrink-0 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{s.t}</h3>
                  <p className="mt-1 text-muted-foreground">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-2xl bg-accent p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground">Ready to start?</h3>
            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/auth" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
                {tab === "company" ? "Join as Company" : "Join as Reviewer"}
              </Link>
              <Link to="/pricing" className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-background px-6 text-sm font-semibold text-foreground hover:border-primary">
                See Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-section">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6">
          {["Escrow-protected payments", "Verified reviewers only", "Full approve/reject control"].map((b) => (
            <div key={b} className="flex items-start gap-3 rounded-lg bg-background border border-border p-5">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="font-medium text-foreground">{b}</span>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}