import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import ListingCard from "@/components/ListingCard";
import FilterBar from "@/components/FilterBar";
import { CATEGORIES } from "@/lib/constants";
import type { ListingDTO } from "@/types";

const CATEGORY_VALUES = CATEGORIES.map((c) => c.value);

type Props = {
  searchParams: Promise<{ category?: string; location?: string }>;
};

export default async function ListingsPage({ searchParams }: Props) {
  const { category, location } = await searchParams;

  await connectDB();

  const filter: Record<string, unknown> = { status: "available" };
  if (category && CATEGORY_VALUES.includes(category as (typeof CATEGORY_VALUES)[number])) {
    filter.category = category;
  }
  if (location) {
    filter["location.address"] = { $regex: location, $options: "i" };
  }

  const listings = await Listing.find(filter).sort({ createdAt: -1 }).lean();

  const data: ListingDTO[] = listings.map((listing) => ({
    _id: listing._id.toString(),
    ownerId: listing.ownerId.toString(),
    category: listing.category,
    description: listing.description,
    quantity: listing.quantity,
    unit: listing.unit,
    condition: listing.condition,
    photoUrl: listing.photoUrl,
    aiTags: listing.aiTags,
    location: listing.location,
    status: listing.status,
    createdAt: listing.createdAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Browse listings</h1>

      <FilterBar />

      {data.length === 0 ? (
        <p className="mt-12 text-center text-zinc-500">No listings match those filters yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
