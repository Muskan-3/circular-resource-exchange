import Link from "next/link";
import { getSessionUser } from "@/lib/session";

export default async function Home() {
  const session = await getSessionUser();

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 py-24 text-center sm:px-6">
      <span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-800">
        AI-powered circular economy
      </span>
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
        Give your waste a second life.
      </h1>
      <p className="max-w-2xl text-lg text-zinc-600">
        EcoLoop connects individuals and businesses so reusable materials — fabric scraps, wood
        offcuts, packaging, surplus inventory — find someone who can use them instead of the
        landfill. Semantic search finds the right match even when nobody uses the same words.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/listings"
          className="rounded-full bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
        >
          Browse listings
        </Link>
        {!session && (
          <Link
            href="/register"
            className="rounded-full border border-emerald-600 px-6 py-3 font-medium text-emerald-700 hover:bg-emerald-50"
          >
            Create an account
          </Link>
        )}
      </div>

      <div className="mt-12 grid w-full gap-4 sm:grid-cols-3">
        <Feature emoji="🔎" title="Semantic matching" desc="Find listings by meaning, not just keywords." />
        <Feature emoji="🏷️" title="AI photo tagging" desc="Snap a photo, get material and condition suggested." />
        <Feature emoji="🌍" title="Impact score" desc="Track waste diverted and CO2 saved over time." />
      </div>
    </div>
  );
}

function Feature({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 text-left">
      <div className="mb-2 text-2xl">{emoji}</div>
      <h3 className="font-semibold text-zinc-900">{title}</h3>
      <p className="text-sm text-zinc-600">{desc}</p>
    </div>
  );
}
