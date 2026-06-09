import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ShoppingBag, PenLine, Star } from "lucide-react";
import { setUser } from "@/lib/auth-store";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In or Join — ReviewMarket" },
      { name: "description", content: "Join ReviewMarket as a company buying reviews or a reviewer earning from honest opinions." },
      { property: "og:title", content: "Join ReviewMarket" },
      { property: "og:description", content: "Choose your account type and get started." },
    ],
  }),
  component: Page,
});

function Page() {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [role, setRole] = useState<"company" | "reviewer">("company");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    if (mode === "signup" && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    setUser({
      name: name.trim() || email.split("@")[0],
      email,
      role,
      createdAt: Date.now(),
    });
    navigate({ to: "/dashboard" });
  };

  return (
    <SiteLayout>
      <section className="py-16 bg-section min-h-[calc(100vh-200px)]">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <div className="rounded-2xl border border-border bg-background p-8 shadow-card">
            <div className="text-center mb-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-3">
                <Star className="h-5 w-5 fill-current" />
              </span>
              <h1 className="text-2xl font-bold text-foreground">{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{mode === "signup" ? "Pick your account type to start." : "Sign in to your dashboard."}</p>
            </div>
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-2 mb-5">
                <button onClick={() => setRole("company")} className={`rounded-lg border p-4 text-left transition-colors ${role === "company" ? "border-primary bg-accent" : "border-border hover:border-primary"}`}>
                  <ShoppingBag className={`h-5 w-5 mb-1.5 ${role === "company" ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="font-semibold text-sm text-foreground">Company</div>
                  <div className="text-xs text-muted-foreground">Buy reviews</div>
                </button>
                <button onClick={() => setRole("reviewer")} className={`rounded-lg border p-4 text-left transition-colors ${role === "reviewer" ? "border-primary bg-accent" : "border-border hover:border-primary"}`}>
                  <PenLine className={`h-5 w-5 mb-1.5 ${role === "reviewer" ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="font-semibold text-sm text-foreground">Reviewer</div>
                  <div className="text-xs text-muted-foreground">Earn writing</div>
                </button>
              </div>
            )}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <form className="space-y-4" onSubmit={submit}>
              {mode === "signup" && (
                <Field label="Full name" value={name} onChange={setName} />
              )}
              <Field label="Email" type="email" value={email} onChange={setEmail} />
              <Field label="Password" type="password" value={password} onChange={setPassword} />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button type="submit" className="w-full h-11 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary-hover">
                {mode === "signup" ? `Create ${role} account` : "Sign in"}
              </button>
            </form>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-background px-2 text-xs text-muted-foreground">or continue with</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="h-10 rounded-md border border-border text-sm font-semibold hover:border-primary">Google</button>
              <button className="h-10 rounded-md border border-border text-sm font-semibold hover:border-primary">Apple</button>
            </div>
            <p className="mt-5 text-center text-sm text-muted-foreground">
              {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
              <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="text-primary font-semibold hover:underline">
                {mode === "signup" ? "Sign in" : "Sign up"}
              </button>
            </p>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              By continuing you agree to our <Link to="/terms" className="hover:text-primary">Terms</Link> and <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, type = "text", value, onChange }: { label: string; type?: string; value?: string; onChange?: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}