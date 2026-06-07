import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ReviewMarket" },
      { name: "description", content: "How ReviewMarket collects, uses, and protects your personal data." },
      { property: "og:title", content: "Privacy Policy — ReviewMarket" },
      { property: "og:description", content: "Our commitment to your privacy." },
    ],
  }),
  component: Page,
});

const sections: [string, string][] = [
  ["Information we collect", "We collect information you provide directly (name, email, payment details, identity verification documents for reviewers), and information collected automatically (device, browser, IP, usage analytics)."],
  ["How we use information", "To operate the platform, process payments and payouts, verify reviewer identity, prevent fraud, communicate updates, and improve our services."],
  ["Sharing of information", "We share data with payment processors, identity verification providers, and hosting/analytics services strictly as needed to deliver the service. We do not sell your personal data."],
  ["Cookies", "We use cookies for authentication, preferences, and analytics. You can control cookies through your browser settings."],
  ["Data retention", "We retain account data for as long as your account is active and as required by law. Transactional records are retained for 7 years for tax and compliance reasons."],
  ["Your rights", "Depending on your jurisdiction, you may have rights to access, correct, delete, or export your personal data. Contact privacy@reviewmarket.example to make a request."],
  ["Security", "We use industry-standard encryption in transit and at rest, restricted internal access, and regular security audits."],
  ["International transfers", "Your information may be processed in countries other than your own. We use standard contractual clauses where required."],
  ["Contact", "Questions about this policy? Email privacy@reviewmarket.example."],
];

function Page() {
  return (
    <SiteLayout>
      <section className="py-16 bg-section border-b border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
          <p className="mt-3 text-muted-foreground">Last updated: January 1, 2026</p>
        </div>
      </section>
      <section className="py-14">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
          {sections.map(([h, p]) => (
            <section key={h}>
              <h2 className="text-xl font-bold text-foreground">{h}</h2>
              <p className="mt-2 text-muted-foreground leading-relaxed">{p}</p>
            </section>
          ))}
        </article>
      </section>
    </SiteLayout>
  );
}