import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { UserType } from "@/lib/types";
import User from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();
  const { email, password } = await request.json();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || "plmun2k25",
      { expiresIn: "1d" }
    );

    let redirectUrl = "/";
    switch (user.userType) {
      case UserType.HOST:
      case UserType.ADMIN:
        redirectUrl = "/dashboard";
        break;
      default:
        redirectUrl = "/condo";
        break;
    }

    // 🔹 Use "Set-Cookie" header instead of cookies().set()
    const tokenCookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none", // 🔥 Important for cross-origin requests!
      maxAge: 3600, // 1 hour
      path: "/",
    });

    const userIdCookie = serialize("userId", String(user._id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 3600,
      path: "/",
    });

    const response = NextResponse.json(
      { token, user, redirectUrl },
      { status: 200 }
    );

    response.headers.append("Set-Cookie", tokenCookie);
    response.headers.append("Set-Cookie", userIdCookie);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
