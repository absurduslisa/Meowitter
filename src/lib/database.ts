import mongoose from 'mongoose'

const MONGODB_URI = process.env.DB_Link as string

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in .env.local');
}

let cached = (global as any).mongoose || { conn: null, promise: null };
(global as any).mongoose = cached;

export async function connectToDB () {
  if (cached.conn) return cached.conn;
  try {
    cached.promise = mongoose.connect(MONGODB_URI);
    cached.conn = await cached.promise;
    console.log('Connected to DB')
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error('Failed to connect to DB', error)
  }
}
