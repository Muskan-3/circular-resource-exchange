import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { getSessionUser } from "@/lib/session";
import { CATEGORIES, CONDITIONS } from "@/lib/constants";

const CATEGORY_VALUES = CATEGORIES.map((c) => c.value);
const CONDITION_VALUES = CONDITIONS.map((c) => c.value);

export async function GET(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const location = searchParams.get("location");
  const status = searchParams.get("status") || "available";

  const filter: Record<string, unknown> = {};
  if (status !== "all") filter.status = status;
  if (category && CATEGORY_VALUES.includes(category as (typeof CATEGORY_VALUES)[number])) {
    filter.category = category;
  }
  if (location) {
    filter["location.address"] = { $regex: location, $options: "i" };
  }

  const listings = await Listing.find(filter)
    .sort({ createdAt: -1 })
    .populate("ownerId", "name")
    .lean();

  const data = listings.map((listing) => ({
    _id: listing._id.toString(),
    ownerId: (listing.ownerId as unknown as { _id: { toString(): string } })?._id?.toString?.() ?? "",
    ownerName: (listing.ownerId as unknown as { name?: string })?.name,
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

  return NextResponse.json({ listings: data });
}

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "You must be logged in to create a listing." }, { status: 401 });
  }

  const body = await request.json();
  const { category, description, quantity, unit, condition, address, lat, lng, photoUrl, aiTags } = body ?? {};

  if (!category || !CATEGORY_VALUES.includes(category)) {
    return NextResponse.json({ error: "A valid category is required." }, { status: 400 });
  }
  if (!condition || !CONDITION_VALUES.includes(condition)) {
    return NextResponse.json({ error: "A valid condition is required." }, { status: 400 });
  }
  if (!description || typeof description !== "string") {
    return NextResponse.json({ error: "A description is required." }, { status: 400 });
  }
  if (quantity === undefined || Number.isNaN(Number(quantity)) || Number(quantity) < 0) {
    return NextResponse.json({ error: "A valid quantity is required." }, { status: 400 });
  }
  if (!address || typeof address !== "string") {
    return NextResponse.json({ error: "A pickup location is required." }, { status: 400 });
  }

  await connectDB();

  const listing = await Listing.create({
    ownerId: session.userId,
    category,
    description,
    quantity: Number(quantity),
    unit: unit || "kg",
    condition,
    photoUrl,
    aiTags,
    location: { address, lat, lng },
    status: "available",
  });

  return NextResponse.json(
    {
      listing: {
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
      },
    },
    { status: 201 }
  );
}
