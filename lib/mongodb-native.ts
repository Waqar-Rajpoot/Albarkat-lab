import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI environment variable");
}

type NativeCache = {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
};

declare global {
  var _mongoNativeCache: NativeCache | undefined;
}

const cached: NativeCache = global._mongoNativeCache ?? {
  client: null,
  promise: null,
};

if (!global._mongoNativeCache) {
  global._mongoNativeCache = cached;
}

export async function getNativeDb(): Promise<Db> {
  if (cached.client) {
    return cached.client.db();
  }

  if (!cached.promise) {
    cached.promise = new MongoClient(MONGODB_URI as string, {
      family: 4, // matches lib/auth.ts
    }).connect();
  }

  cached.client = await cached.promise;
  return cached.client.db();
}