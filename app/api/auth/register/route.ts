import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcrypt"
import { UserType } from "@/lib/types"

export async function POST(request: Request) {
  await dbConnect()
  const { name, email, password, userType } = await request.json()

  try {
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      userType: userType || UserType.USER,
    })

    await newUser.save()

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

