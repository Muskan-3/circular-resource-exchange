import { notFound, redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { getSessionUser } from "@/lib/session";
import ListingForm from "@/components/ListingForm";
import type { ListingDTO } from "@/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditListingPage({ params }: Props) {
  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();
  const [listing, session] = await Promise.all([Listing.findById(id).lean(), getSessionUser()]);

  if (!listing) notFound();
  if (!session || session.userId !== listing.ownerId.toString()) {
    redirect(`/listings/${id}`);
  }

  const initial: Partial<ListingDTO> = {
    category: listing.category,
    description: listing.description,
    quantity: listing.quantity,
    unit: listing.unit,
    condition: listing.condition,
    photoUrl: listing.photoUrl,
    location: listing.location,
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Edit listing</h1>
      <ListingForm mode="edit" listingId={id} initial={initial} />
    </div>
  );
}
