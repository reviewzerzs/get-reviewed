import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/getreviewzz-logo.png.asset.json";
import { useUser, setUser } from "@/lib/auth-store";

const nav = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/calculator", label: "Calculator" },
  { to: "/blog", label: "Blog" },
  { to: "/faq", label: "FAQ" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const user = useUser();
  const navigate = useNavigate();
  const signOut = () => { setUser(null); navigate({ to: "/" }); };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex flex-col items-start leading-none font-bold text-base sm:text-lg text-foreground shrink-0">
          <img src={logoAsset.url} alt="ReviewMarket logo" className="h-10 sm:h-12 w-auto" />
          <span className="mt-1">ReviewMarket</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-7">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-foreground hover:text-primary">Dashboard</Link>
              <button onClick={signOut} className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="text-sm font-medium text-foreground hover:text-primary">Sign in</Link>
              <Link to="/auth" className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          {user ? (
            <Link to="/dashboard" className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground">
              Dashboard
            </Link>
          ) : (
            <Link to="/auth" className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground">
              Get Started
            </Link>
          )}
          <button className="p-2 text-foreground" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="px-4 py-3 space-y-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-section"
              >
                {n.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="block px-3 py-2 mt-2 rounded-md text-sm font-semibold text-center bg-primary text-primary-foreground">
                  Open dashboard
                </Link>
                <button onClick={() => { setOpen(false); signOut(); }} className="block w-full px-3 py-2 mt-1 rounded-md text-sm font-semibold text-center border border-border">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setOpen(false)} className="block px-3 py-2 mt-2 rounded-md text-sm font-semibold text-center border border-border text-foreground">
                  Sign in
                </Link>
                <Link to="/auth" onClick={() => setOpen(false)} className="block px-3 py-2 mt-1 rounded-md text-sm font-semibold text-center bg-primary text-primary-foreground">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}