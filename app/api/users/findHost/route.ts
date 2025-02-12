import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function GET(request: Request) {
  await dbConnect()
  const { searchParams } = new URL(request.url)
  const role = searchParams.get("role")

  let query = {}
  if (role) {
    query = { userType: role.toUpperCase() }
  }

  const users = await User.find(query).select("name email userType")

  return NextResponse.json(users)
}

