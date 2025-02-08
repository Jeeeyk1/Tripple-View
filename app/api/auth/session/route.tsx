import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const cookiesValue = cookies();
  const token = cookiesValue.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { token: null, id: null },
      { status: 401 } // Adding a status for better API response handling
    );
  }

  let test;
  try {
    test = jwt.verify(token, "plmun2k25");
  } catch (err) {
    console.log("error " + err);
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 403 }
    );
  }

  return NextResponse.json(
    {
      token: token, // Only returning token value, not full cookie object
      id: cookiesValue.get("userId")?.value || null,
    },
    { status: 200 }
  );
}
