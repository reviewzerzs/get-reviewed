import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Heart, Target, Users, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — ReviewMarket" },
      { name: "description", content: "We're building a fair, transparent marketplace where businesses and reviewers create real value for each other." },
      { property: "og:title", content: "About ReviewMarket" },
      { property: "og:description", content: "Our story, mission, and the people behind the platform." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <SiteLayout>
      <section className="py-16 lg:py-24 bg-section border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">A fairer way to do reviews</h1>
          <p className="mt-5 text-lg text-muted-foreground">ReviewMarket was founded in 2022 to fix a broken system: businesses paying for fake bot reviews, and real users with no way to earn from honest opinions. We connect both sides, escrow every transaction, and verify every reviewer.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Our mission</h2>
            <p className="mt-4 text-muted-foreground">To create the most trusted review economy on the internet — one where every transaction is protected, every reviewer is real, and every business gets the boost it's earned.</p>
            <p className="mt-3 text-muted-foreground">Today, we serve over 12,000 businesses and 45,000 verified reviewers across 120+ countries.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Heart, label: "Built for honesty" },
              { icon: ShieldCheck, label: "Escrow on every order" },
              { icon: Target, label: "Real, measurable growth" },
              { icon: Users, label: "Global verified network" },
            ].map((v) => (
              <div key={v.label} className="rounded-xl border border-border bg-background p-5">
                <v.icon className="h-6 w-6 text-primary mb-3" />
                <div className="font-semibold text-sm text-foreground">{v.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-section">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground">By the numbers</h2>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[["250K+", "Reviews delivered"], ["120+", "Countries served"], ["98%", "Approval rate"], ["$4.2M", "Paid to reviewers"]].map(([v, l]) => (
              <div key={l}>
                <div className="text-4xl font-bold text-primary">{v}</div>
                <div className="text-sm text-muted-foreground mt-1">{l}</div>
              </div>
            ))}
          </div>
          <Link to="/auth" className="mt-12 inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
            Join the community
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}