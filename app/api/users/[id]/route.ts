import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Condo from "@/models/Condo";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const condos = await User.findById(params.id);
  return NextResponse.json(condos);
}
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { name, password } = await request.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  await dbConnect();
  const condos = await User.findByIdAndUpdate(
    params.id,
    { name, password: hashedPassword },
    { new: true }
  );
  return NextResponse.json(condos);
}
