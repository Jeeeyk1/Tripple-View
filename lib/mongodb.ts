import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://almariegojustinjake:plmun2k25@freelance.zuiou.mongodb.net/tripleview"
"mongodb+srv://jakefreelance:abegailforever@cluster0.tdm0q.mongodb.net/tripleview?retryWrites=true&w=majority"
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
