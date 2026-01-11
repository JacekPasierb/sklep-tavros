import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI!;
if (!MONGODB_URI) {
  throw new Error("⚠️ Missing MONGO_URI environment variable.");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// używamy globalThis żeby cache nie resetował się przy hot-reload
const globalWithCache = globalThis as unknown as {
  _mongoose?: MongooseCache;
};

const cache: MongooseCache = globalWithCache._mongoose ?? {
  conn: null,
  promise: null,
};

globalWithCache._mongoose = cache;

export async function connectToDatabase() {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      dbName: "Tavros",
      bufferCommands: false,
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
