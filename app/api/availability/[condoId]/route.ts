import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Reservation from "@/models/Reservation";

export async function GET(
  request: Request,
  { params }: { params: { condoId: string } }
) {
  await dbConnect();

  const { condoId } = params;
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "Start date and end date are required" },
      { status: 400 }
    );
  }

  const reservations = await Reservation.find({
    condoId,
    status: "approved", // Only fetch approved reservations
    $or: [
      { checkIn: { $gte: new Date(startDate), $lt: new Date(endDate) } },
      { checkOut: { $gt: new Date(startDate), $lte: new Date(endDate) } },
      {
        $and: [
          { checkIn: { $lte: new Date(startDate) } },
          { checkOut: { $gte: new Date(endDate) } },
        ],
      },
    ],
  });

  const bookedDates = new Set<string>();

  reservations.forEach((reservation) => {
    let currentDate = new Date(reservation.checkIn);
    let checkOutDate = new Date(reservation.checkOut);
  
    // Convert to UTC+8 by adding 8 hours
    currentDate.setHours(currentDate.getHours() + 8);
    checkOutDate.setHours(checkOutDate.getHours() + 8);
  
    while (currentDate <= checkOutDate) {
      bookedDates.add(currentDate.toISOString().split("T")[0]); // Store only the date part
      currentDate.setDate(currentDate.getDate() + 1); // Add 1 day
    }
  });
  

  return NextResponse.json({ bookedDates: Array.from(bookedDates) });
}
