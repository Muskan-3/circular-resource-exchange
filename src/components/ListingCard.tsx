import Link from "next/link";
import Image from "next/image";
import { categoryLabel, conditionLabel } from "@/lib/constants";
import type { ListingDTO } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  exchanged: "bg-zinc-200 text-zinc-600",
};

export default function ListingCard({ listing }: { listing: ListingDTO }) {
  return (
    <Link
      href={`/listings/${listing._id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        {listing.photoUrl ? (
          <Image
            src={listing.photoUrl}
            alt={listing.description}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">📦</div>
        )}
        <span
          className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[listing.status] ?? "bg-zinc-200 text-zinc-700"}`}
        >
          {listing.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-emerald-700">
          {categoryLabel(listing.category)}
        </span>
        <p className="line-clamp-2 flex-1 text-sm text-zinc-700">{listing.description}</p>
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>
            {listing.quantity} {listing.unit} · {conditionLabel(listing.condition)}
          </span>
        </div>
        <span className="truncate text-xs text-zinc-400">📍 {listing.location.address}</span>
      </div>
    </Link>
  );
}
