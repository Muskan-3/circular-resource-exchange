"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type NavbarUser = {
  name: string;
  role: string;
} | null;

export default function Navbar({ user }: { user: NavbarUser }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-emerald-100 bg-white/80 backdrop-blur sticky top-0 z-10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-emerald-700">
          <span aria-hidden>♻️</span>
          EcoLoop
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/listings" className="text-zinc-600 hover:text-emerald-700">
            Browse
          </Link>

          {user ? (
            <>
              <Link
                href="/listings/new"
                className="rounded-full bg-emerald-600 px-4 py-1.5 font-medium text-white hover:bg-emerald-700"
              >
                + New Listing
              </Link>
              <span className="hidden text-zinc-500 sm:inline">
                {user.name} <span className="text-zinc-400">· {user.role}</span>
              </span>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="text-zinc-500 hover:text-emerald-700 disabled:opacity-50"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-zinc-600 hover:text-emerald-700">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-emerald-600 px-4 py-1.5 font-medium text-white hover:bg-emerald-700"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
