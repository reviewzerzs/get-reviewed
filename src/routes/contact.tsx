import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ReviewMarket" },
      { name: "description", content: "Get in touch with the ReviewMarket team — sales, support, partnerships." },
      { property: "og:title", content: "Contact ReviewMarket" },
      { property: "og:description", content: "We're here to help." },
    ],
  }),
  component: Page,
});

function Page() {
  const [sent, setSent] = useState(false);
  return (
    <SiteLayout>
      <section className="py-16 bg-section border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Get in touch</h1>
          <p className="mt-4 text-lg text-muted-foreground">We typically reply within a few hours during business days.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_320px] gap-10">
          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="rounded-2xl border border-border bg-background p-8 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Name" required />
              <Input label="Email" type="email" required />
            </div>
            <Input label="Subject" required />
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Message</label>
              <textarea required rows={5} className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <button type="submit" className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
              {sent ? "Message sent ✓" : "Send message"}
            </button>
          </form>
          <aside className="space-y-4">
            {[
              { icon: Mail, t: "Email", v: "hello@reviewmarket.example" },
              { icon: MessageSquare, t: "Live chat", v: "Mon–Fri, 9am–6pm UTC" },
              { icon: MapPin, t: "Office", v: "Remote-first, global team" },
            ].map((c) => (
              <div key={c.t} className="rounded-xl border border-border p-5">
                <c.icon className="h-5 w-5 text-primary mb-2" />
                <div className="font-semibold text-foreground">{c.t}</div>
                <div className="text-sm text-muted-foreground mt-1">{c.v}</div>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}

function Input({ label, type = "text", required }: { label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-2">{label}</label>
      <input type={type} required={required} className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
    </div>
  );
}