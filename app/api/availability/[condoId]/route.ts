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

  const bookedDates = reservations.flatMap((reservation) => {
    const dates = [];
    const currentDate = new Date(reservation.checkIn);
    while (currentDate < new Date(reservation.checkOut)) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  });

  return NextResponse.json({ bookedDates });
}
