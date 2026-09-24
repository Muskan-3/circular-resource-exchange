import { notFound } from "next/navigation";
import Image from "next/image";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { getSessionUser } from "@/lib/session";
import { categoryLabel, conditionLabel } from "@/lib/constants";
import ListingOwnerActions from "@/components/ListingOwnerActions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();
  const [listing, session] = await Promise.all([
    Listing.findById(id).populate("ownerId", "name contactInfo email").lean(),
    getSessionUser(),
  ]);

  if (!listing) notFound();

  const owner = listing.ownerId as unknown as {
    _id: { toString(): string };
    name?: string;
    contactInfo?: string;
    email?: string;
  };
  const isOwner = session?.userId === owner?._id?.toString?.();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-xl bg-zinc-100">
        {listing.photoUrl ? (
          <Image src={listing.photoUrl} alt={listing.description} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl">📦</div>
        )}
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-sm font-medium uppercase tracking-wide text-emerald-700">
            {categoryLabel(listing.category)}
          </span>
          <h1 className="mt-1 text-2xl font-semibold text-zinc-900">{listing.description}</h1>
        </div>
        {isOwner && <ListingOwnerActions listingId={listing._id.toString()} />}
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-zinc-200 bg-white p-5 sm:grid-cols-4">
        <Field label="Quantity" value={`${listing.quantity} ${listing.unit}`} />
        <Field label="Condition" value={conditionLabel(listing.condition)} />
        <Field label="Status" value={listing.status} />
        <Field label="Location" value={listing.location.address} />
      </dl>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-2 text-sm font-semibold text-zinc-900">Listed by</h2>
        <p className="text-sm text-zinc-700">{owner?.name ?? "Unknown"}</p>
        {owner?.contactInfo && <p className="text-sm text-zinc-500">{owner.contactInfo}</p>}
        {!isOwner && owner?.email && (
          <p className="mt-1 text-sm text-zinc-500">
            Contact: <a href={`mailto:${owner.email}`} className="text-emerald-700 hover:underline">{owner.email}</a>
          </p>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-zinc-400">{label}</dt>
      <dd className="text-sm font-medium text-zinc-800">{value}</dd>
    </div>
  );
}
