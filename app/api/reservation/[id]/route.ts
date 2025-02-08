import dbConnect from "@/lib/mongodb";
import { ReservationStatus } from "@/lib/types";
import Reservation from "@/models/Reservation";

import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const reservations = await Reservation.find({ userId: params.id });
  if (!reservations) {
    return NextResponse.json({ message: "Condo not found" }, { status: 404 });
  }
  return NextResponse.json(reservations);
}
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { action } = await request.json();

  let status;
  switch (action) {
    case "accept":
      status = ReservationStatus.APPROVED;
      break;
    case "decline":
      status = ReservationStatus.DECLINED;
      break;
    case "cancel":
      status = ReservationStatus.CANCELLED;
      break;
    default:
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }

  const updatedReservation = await Reservation.findByIdAndUpdate(
    params.id,
    { status },
    { new: true }
  );

  if (!updatedReservation) {
    return NextResponse.json(
      { message: "Reservation not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updatedReservation);
}
