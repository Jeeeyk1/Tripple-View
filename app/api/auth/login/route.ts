import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import Cookies from "js-cookie";
import { cookies } from "next/headers";
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
      console.log("test");

      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
    console.log("test");

    const token = jwt.sign(
      { userId: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || "plmun2k25",
      { expiresIn: "1d" }
    );

    let redirectUrl = "/";
    switch (user.userType) {
      case UserType.HOST:
        redirectUrl = "/dashboard";
        break;
      case UserType.ADMIN:
        redirectUrl = "/dashboard";
        break;
      default:
        redirectUrl = "/condo";
        break;
    }
    cookies().set("userId", user._id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30600,
      path: "/",
    });
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30600,
      path: "/",
    });
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30600,
      path: "/",
    });
    const response = NextResponse.json(
      { token,  user, redirectUrl },
      { status: 200 }
    );
    response.headers.append("Set-Cookie", cookie);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
