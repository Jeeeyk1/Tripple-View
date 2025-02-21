import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Condo from "@/models/Condo";
import Reservation from "@/models/Reservation";

export async function GET() {
  await dbConnect();
  const condos = await Condo.find({});
  return NextResponse.json(condos);
}
export async function POST(request: Request) {
  await dbConnect();
  let data = await request.json();

  // Convert dates to local timezone before saving
  console.log(new Date(data.checkIn).toLocaleString("en-PH") + "check in");
  console.log(new Date(data.checkOut).toLocaleString("en-PH") + "checkOut ");

  data.checkIn = new Date(data.checkIn).toLocaleString("en-PH");
  data.checkOut = new Date(data.checkOut).toLocaleString("en-PH");

  const reservation = await Reservation.create(data);
  return NextResponse.json(reservation, { status: 201 });
}
