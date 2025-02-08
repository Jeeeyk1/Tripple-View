import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Condo from "@/models/Condo"
import User from "@/models/User"

export async function GET() {
  await dbConnect()
  const condos = await User.find({})
  return NextResponse.json(condos)
}

export async function POST(request: Request) {
  await dbConnect()
  const data = await request.json()
  const condo = await User.create(data)
  return NextResponse.json(condo, { status: 201 })
}

