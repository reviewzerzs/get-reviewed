import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — ReviewMarket" },
      { name: "description", content: "The terms of service governing your use of the ReviewMarket platform." },
      { property: "og:title", content: "Terms & Conditions — ReviewMarket" },
      { property: "og:description", content: "Our platform terms." },
    ],
  }),
  component: Page,
});

const sections: [string, string][] = [
  ["1. Acceptance of Terms", "By accessing or using ReviewMarket you agree to be bound by these Terms. If you do not agree, do not use the platform."],
  ["2. Eligibility", "You must be at least 18 years old and legally able to enter contracts in your jurisdiction to use ReviewMarket."],
  ["3. Accounts", "You are responsible for keeping your credentials confidential and for all activity on your account. You must provide accurate information and update it when it changes."],
  ["4. Advertiser Obligations", "Advertisers fund orders upfront. Funds are held in escrow and released only for reviews the advertiser explicitly approves. Advertisers must not request false claims, defamatory content, or violations of any platform's terms of service."],
  ["5. Reviewer Obligations", "Reviewers must submit reviews based on genuine experience or research and must comply with the destination platform's policies. Submitting fraudulent links or screenshots will result in account termination and forfeiture of pending earnings."],
  ["6. Payments and Fees", "ReviewMarket charges a service fee on each transaction, disclosed at order checkout. Withdrawals are processed within 3–5 business days subject to identity verification."],
  ["7. Prohibited Conduct", "You may not use ReviewMarket to engage in unlawful activity, harass other users, scrape the platform, or circumvent the escrow or payment systems."],
  ["8. Limitation of Liability", "ReviewMarket is provided 'as is' without warranties. Our maximum liability to you is limited to the fees paid by you in the 12 months preceding any claim."],
  ["9. Termination", "We may suspend or terminate accounts that violate these Terms. You may close your account at any time from the dashboard."],
  ["10. Changes to Terms", "We may update these Terms from time to time. Continued use after changes constitutes acceptance of the revised Terms."],
];

function Page() {
  return (
    <SiteLayout>
      <section className="py-16 bg-section border-b border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground">Terms & Conditions</h1>
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