import { Link } from "@tanstack/react-router";
import { Star, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Star className="h-4 w-4 fill-current" />
              </span>
              ReviewMarket
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              The trusted marketplace connecting businesses with authentic reviewers worldwide.
            </p>
            <div className="flex gap-3 mt-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <FooterCol title="Product" links={[
            { to: "/how-it-works", label: "How It Works" },
            { to: "/pricing", label: "Pricing" },
            { to: "/calculator", label: "Calculator" },
            { to: "/faq", label: "FAQ" },
          ]} />
          <FooterCol title="Company" links={[
            { to: "/about", label: "About Us" },
            { to: "/blog", label: "Blog" },
            { to: "/contact", label: "Contact" },
          ]} />
          <FooterCol title="Legal" links={[
            { to: "/terms", label: "Terms & Conditions" },
            { to: "/privacy", label: "Privacy Policy" },
          ]} />
        </div>
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-3 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ReviewMarket. All rights reserved.</p>
          <p>Built for businesses and reviewers worldwide.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="font-semibold text-foreground mb-4 text-sm">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}