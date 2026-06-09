import { useEffect, useState } from "react";

export type Role = "company" | "reviewer";
export type User = { name: string; email: string; role: Role; createdAt: number };

const KEY = "rm_user";

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setUser(u: User | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(KEY, JSON.stringify(u));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("rm-auth-change"));
}

export function useUser(): User | null {
  const [u, setU] = useState<User | null>(null);
  useEffect(() => {
    setU(getUser());
    const fn = () => setU(getUser());
    window.addEventListener("rm-auth-change", fn);
    window.addEventListener("storage", fn);
    return () => {
      window.removeEventListener("rm-auth-change", fn);
      window.removeEventListener("storage", fn);
    };
  }, []);
  return u;
}