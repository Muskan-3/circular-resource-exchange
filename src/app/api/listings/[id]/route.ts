import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { getSessionUser } from "@/lib/session";
import { CATEGORIES, CONDITIONS, LISTING_STATUSES } from "@/lib/constants";

const CATEGORY_VALUES = CATEGORIES.map((c) => c.value);
const CONDITION_VALUES = CONDITIONS.map((c) => c.value);

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  await connectDB();

  const listing = await Listing.findById(id).populate("ownerId", "name contactInfo email").lean();
  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  const owner = listing.ownerId as unknown as {
    _id: { toString(): string };
    name?: string;
    contactInfo?: string;
    email?: string;
  };

  return NextResponse.json({
    listing: {
      _id: listing._id.toString(),
      ownerId: owner?._id?.toString?.() ?? "",
      ownerName: owner?.name,
      ownerContact: owner?.contactInfo,
      ownerEmail: owner?.email,
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
  });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const listing = await Listing.findById(id);
  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }
  if (listing.ownerId.toString() !== session.userId) {
    return NextResponse.json({ error: "You can only edit your own listings." }, { status: 403 });
  }

  const body = await request.json();
  const { category, description, quantity, unit, condition, address, lat, lng, photoUrl, status, aiTags } = body ?? {};

  if (category !== undefined) {
    if (!CATEGORY_VALUES.includes(category)) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }
    listing.category = category;
  }
  if (condition !== undefined) {
    if (!CONDITION_VALUES.includes(condition)) {
      return NextResponse.json({ error: "Invalid condition." }, { status: 400 });
    }
    listing.condition = condition;
  }
  if (status !== undefined) {
    if (!LISTING_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    listing.status = status;
  }
  if (description !== undefined) listing.description = description;
  if (quantity !== undefined) listing.quantity = Number(quantity);
  if (unit !== undefined) listing.unit = unit;
  if (photoUrl !== undefined) listing.photoUrl = photoUrl;
  if (aiTags !== undefined) listing.aiTags = aiTags;
  if (address !== undefined) listing.location.address = address;
  if (lat !== undefined) listing.location.lat = lat;
  if (lng !== undefined) listing.location.lng = lng;

  await listing.save();

  return NextResponse.json({
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
  });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const listing = await Listing.findById(id);
  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }
  if (listing.ownerId.toString() !== session.userId) {
    return NextResponse.json({ error: "You can only delete your own listings." }, { status: 403 });
  }

  await listing.deleteOne();

  return NextResponse.json({ ok: true });
}
