import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { cookies } from "next/headers";

export function GET() {
  const cookiesClear = cookies();
  const cookie = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: -1, // Expire immediately
    path: "/",
  });
  cookiesClear.delete;

  const response = NextResponse.json({ message: "Logged out" });
  response.headers.append("Set-Cookie", cookie);
  return response;
}
