import mongoose from "mongoose";

// Side-effect imports: with Next.js's per-route module isolation, a route that
// only imports e.g. Listing won't have User registered in Mongoose's global
// model registry, which breaks `.populate("ownerId")`. Importing every model
// here — the one module every DB-touching route already loads — guarantees
// they're all registered before any query runs.
import "@/models/User";
import "@/models/Listing";
import "@/models/Match";
import "@/models/Exchange";
import "@/models/ImpactLog";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cache;

export async function connectDB() {
  if (cache.conn) return cache.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable. Copy .env.example to .env and set it.");
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, { bufferCommands: false });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
