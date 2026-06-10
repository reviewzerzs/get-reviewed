import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — ReviewMarket" },
      { name: "description", content: "Insights on online reputation, review marketing, and how to grow with authentic customer voice." },
      { property: "og:title", content: "Blog — ReviewMarket" },
      { property: "og:description", content: "Tips, guides and stories for businesses and reviewers." },
    ],
  }),
  component: Page,
});

const posts = [
  { slug: "why-reviews-matter-2026", title: "Why online reviews matter more than ever in 2026", excerpt: "93% of consumers read reviews before buying. Here's how to make every one work for you.", category: "Strategy", read: "6 min" },
  { slug: "google-review-best-practices", title: "10 best practices for Google review campaigns", excerpt: "From keyword density to posting cadence — what makes a Google review actually rank.", category: "Google", read: "8 min" },
  { slug: "reviewer-earnings-guide", title: "How top reviewers earn $1,000+ per month", excerpt: "A deep look at the habits, niches and platforms that pay reviewers the most.", category: "Reviewers", read: "5 min" },
  { slug: "payments-explained", title: "How payments and approvals protect both sides", excerpt: "A behind-the-scenes look at the trust mechanics that keep ReviewMarket fair.", category: "Trust", read: "4 min" },
  { slug: "local-seo-and-reviews", title: "The link between local SEO and review velocity", excerpt: "How often you get new reviews matters more than your average star rating.", category: "SEO", read: "7 min" },
  { slug: "writing-honest-reviews", title: "The art of writing an honest, useful review", excerpt: "What separates a review that converts from one that gets flagged or ignored.", category: "Reviewers", read: "5 min" },
];

function Page() {
  return (
    <SiteLayout>
      <section className="py-16 lg:py-20 bg-section border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">The ReviewMarket Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground">Insights for businesses growing their reputation and reviewers building their craft.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <article key={p.slug} className="group rounded-xl border border-border bg-background overflow-hidden hover:shadow-card hover:border-primary transition-all">
              <div className="aspect-[16/9] bg-gradient-to-br from-accent to-section flex items-center justify-center">
                <span className="text-5xl font-bold text-primary/30">{p.title.charAt(0)}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs">
                  <span className="inline-flex rounded-full bg-accent px-2.5 py-0.5 font-semibold text-primary">{p.category}</span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" />{p.read}</span>
                </div>
                <h2 className="mt-3 font-bold text-lg text-foreground group-hover:text-primary transition-colors leading-snug">{p.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
                <Link to="/blog" className="mt-4 inline-block text-sm font-semibold text-primary">Read more →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}