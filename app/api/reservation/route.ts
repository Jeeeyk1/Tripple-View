import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Reservation from "@/models/Reservation";
import jwt from "jsonwebtoken";

const verifyToken = (req: Request) => {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return null;
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
  } catch (error) {
    return null;
  }
};

export async function GET(request: Request) {
  await dbConnect();

  const reservations = await Reservation.find();
  return NextResponse.json(reservations);
}

