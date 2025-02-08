import dbConnect from "@/lib/mongodb";
import { ReservationStatus } from "@/lib/types";
import Condo from "@/models/Condo";
import Reservation from "@/models/Reservation";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();
  const { hostId } = await request.json();
  if(hostId==""){
    return NextResponse.json({ message: "Host id cannot be empty" }, { status: 400 });

  }
  const condos = await Condo.find({ owner: hostId });
  console.log(condos.length + " length");
  const condoIds = condos.map((condo) => condo._id);
  console.log(condoIds + " ids");
  if (condoIds.length == 0) {
    return NextResponse.json([]);
  }
  const reservations = await Reservation.find({ condoId: { $in:condos[0] } });
  if (!reservations) {
    return NextResponse.json({ message: "Condo not found" }, { status: 400 });
  }
  return NextResponse.json(reservations);
}
