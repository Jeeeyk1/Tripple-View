import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Condo from "@/models/Condo"
import Reservation from "@/models/Reservation"

export async function GET() {
  await dbConnect()
  const condos = await Condo.find({})
  return NextResponse.json(condos)
}

export async function POST(request: Request) {
  await dbConnect()
  const data = await request.json()
  const reservation = await Reservation.create(data)
  return NextResponse.json(reservation, { status: 201 })
}

