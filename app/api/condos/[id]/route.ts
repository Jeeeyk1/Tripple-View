import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Condo from "@/models/Condo"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const condo = await Condo.findById(params.id)
  if (!condo) {
    return NextResponse.json({ message: "Condo not found" }, { status: 404 })
  }
  return NextResponse.json(condo)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const data = await request.json()
  const condo = await Condo.findByIdAndUpdate(params.id, data, { new: true })
  if (!condo) {
    return NextResponse.json({ message: "Condo not found" }, { status: 404 })
  }
  return NextResponse.json(condo)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const condo = await Condo.findByIdAndDelete(params.id)
  if (!condo) {
    return NextResponse.json({ message: "Condo not found" }, { status: 404 })
  }
  return NextResponse.json({ message: "Condo deleted successfully" })
}

