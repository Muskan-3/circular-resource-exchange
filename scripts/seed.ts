import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User";
import Listing from "../src/models/Listing";

const DEMO_PASSWORD = "password123";

// One representative Unsplash photo per category (verified real photos, not guessed IDs).
// Query params keep the served copy small; add your own to swap in different art later.
const PHOTO_BY_CATEGORY: Record<string, string> = {
  fabric_scraps: "https://images.unsplash.com/photo-1768409427465-01320d46963e?w=800&q=80&auto=format&fit=crop",
  wood_offcuts: "https://images.unsplash.com/photo-1662660810141-8faac6521f03?w=800&q=80&auto=format&fit=crop",
  packaging: "https://images.unsplash.com/photo-1653164514614-172c46a30984?w=800&q=80&auto=format&fit=crop",
  surplus_inventory: "https://images.unsplash.com/photo-1685483749753-0dab7e144794?w=800&q=80&auto=format&fit=crop",
  electronics: "https://images.unsplash.com/photo-1631376178637-392efc9e356b?w=800&q=80&auto=format&fit=crop",
  furniture: "https://images.unsplash.com/photo-1650476524564-f94dc9669067?w=800&q=80&auto=format&fit=crop",
};

const USERS = [
  {
    name: "Priya Sharma",
    email: "priya@example.com",
    role: "donor" as const,
    location: { address: "Koramangala, Bengaluru" },
    contactInfo: "+91 98765 43210",
  },
  {
    name: "Rohan Textiles Pvt Ltd",
    email: "rohan.textiles@example.com",
    role: "business" as const,
    location: { address: "Tirupur, Tamil Nadu" },
    contactInfo: "+91 90000 11122",
  },
  {
    name: "GreenCycle Collectors",
    email: "greencycle@example.com",
    role: "collector" as const,
    location: { address: "Whitefield, Bengaluru" },
    contactInfo: "+91 91234 56780",
  },
  {
    name: "Aarav Furniture Works",
    email: "aarav.furniture@example.com",
    role: "business" as const,
    location: { address: "Saharanpur, Uttar Pradesh" },
    contactInfo: "+91 99887 76655",
  },
  {
    name: "Meera Patel",
    email: "meera@example.com",
    role: "donor" as const,
    location: { address: "Andheri, Mumbai" },
    contactInfo: "+91 98111 22334",
  },
];

const LISTINGS = [
  // fabric scraps
  {
    category: "fabric_scraps",
    description: "Cotton fabric offcuts from a tailoring workshop, mixed colors, good for patchwork or stuffing.",
    quantity: 18,
    unit: "kg",
    condition: "good",
  },
  {
    category: "fabric_scraps",
    description: "Denim scrap bundle from jeans manufacturing, mostly indigo blue, various sizes.",
    quantity: 32,
    unit: "kg",
    condition: "good",
  },
  {
    category: "fabric_scraps",
    description: "Leftover silk and chiffon remnants from a boutique, small pieces suitable for accessories.",
    quantity: 6,
    unit: "kg",
    condition: "like_new",
  },
  {
    category: "fabric_scraps",
    description: "Polyester lining offcuts, lightly used, some pieces up to 1 meter long.",
    quantity: 12,
    unit: "kg",
    condition: "fair",
  },

  // wood offcuts
  {
    category: "wood_offcuts",
    description: "Scrap timber offcuts from furniture production, mostly pine and teak, various lengths.",
    quantity: 45,
    unit: "kg",
    condition: "good",
  },
  {
    category: "wood_offcuts",
    description: "Plywood cutoffs from a carpentry shop, edges untreated, good for small builds.",
    quantity: 28,
    unit: "kg",
    condition: "fair",
  },
  {
    category: "wood_offcuts",
    description: "Sawdust and small wood chips, dry, suitable for composting or animal bedding.",
    quantity: 60,
    unit: "kg",
    condition: "good",
  },
  {
    category: "wood_offcuts",
    description: "Reclaimed wooden pallet planks, some nails still attached, sturdy for DIY projects.",
    quantity: 22,
    unit: "kg",
    condition: "fair",
  },

  // packaging
  {
    category: "packaging",
    description: "Unused corrugated cardboard boxes, medium size, flattened and stacked.",
    quantity: 150,
    unit: "units",
    condition: "new",
  },
  {
    category: "packaging",
    description: "Bubble wrap rolls left over from a shipping run, a few small tears but mostly intact.",
    quantity: 20,
    unit: "kg",
    condition: "good",
  },
  {
    category: "packaging",
    description: "Foam packaging inserts from electronics shipments, custom-cut shapes.",
    quantity: 80,
    unit: "units",
    condition: "good",
  },

  // surplus inventory
  {
    category: "surplus_inventory",
    description: "Overstocked ceramic mugs from a canceled order, plain white, never used.",
    quantity: 240,
    unit: "units",
    condition: "new",
  },
  {
    category: "surplus_inventory",
    description: "Surplus stationery sets — notebooks and pens — from a corporate gifting order.",
    quantity: 400,
    unit: "units",
    condition: "new",
  },
  {
    category: "surplus_inventory",
    description: "Excess cotton tote bags with a discontinued print design.",
    quantity: 180,
    unit: "units",
    condition: "new",
  },

  // electronics
  {
    category: "electronics",
    description: "Working desktop computer parts — motherboards and power supplies — from an office upgrade.",
    quantity: 15,
    unit: "units",
    condition: "fair",
  },
  {
    category: "electronics",
    description: "Old but functional LED monitors, minor scratches on the bezels.",
    quantity: 8,
    unit: "units",
    condition: "good",
  },
  {
    category: "electronics",
    description: "Assorted cables and chargers, tested and working, from a device recycling drive.",
    quantity: 50,
    unit: "units",
    condition: "fair",
  },

  // furniture
  {
    category: "furniture",
    description: "Wooden office desks, some scuffing on the surface but structurally solid.",
    quantity: 6,
    unit: "units",
    condition: "fair",
  },
  {
    category: "furniture",
    description: "Stackable plastic chairs from an event rental company, lightly used.",
    quantity: 25,
    unit: "units",
    condition: "good",
  },
  {
    category: "furniture",
    description: "Metal shelving units, disassembled, minor rust spots on the frames.",
    quantity: 4,
    unit: "units",
    condition: "fair",
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI. Copy .env.example to .env and set it before seeding.");
  }

  await mongoose.connect(uri);
  console.log(`Connected to ${uri}`);

  await Listing.deleteMany({});
  await User.deleteMany({ email: { $in: USERS.map((u) => u.email) } });
  console.log("Cleared existing seed listings and demo users.");

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const createdUsers = await User.insertMany(
    USERS.map((u) => ({ ...u, passwordHash }))
  );
  console.log(`Created ${createdUsers.length} demo users (password: "${DEMO_PASSWORD}").`);

  const listingsWithOwners = LISTINGS.map((listing, i) => ({
    ...listing,
    ownerId: createdUsers[i % createdUsers.length]._id,
    location: createdUsers[i % createdUsers.length].location,
    photoUrl: PHOTO_BY_CATEGORY[listing.category],
    status: "available",
    embedding: [],
  }));

  const createdListings = await Listing.insertMany(listingsWithOwners);
  console.log(`Created ${createdListings.length} demo listings.`);

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
