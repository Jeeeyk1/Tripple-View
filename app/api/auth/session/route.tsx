import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export function GET() {
  const cookiesValue = cookies();
  const token = cookiesValue.get("token")?.value;
  if (!token) {
    return NextResponse.json({
      token: null,
      id: null,
    });;
  }
  let test;
  try {
    test = jwt.verify(token, "plmun2k25");
  } catch (err) {
    console.log("error " + err)
    return NextResponse.json;
  }

  return  NextResponse.json({
    token: cookiesValue.get("token") || {},
    id: cookiesValue.get("userId") || {},
  });
  
}
