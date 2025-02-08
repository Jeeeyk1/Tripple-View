import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// Use a Uint8Array secret key for jose
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "plmun2k25"
);

// Define protected routes
const protectedRoutes = ["/condo", "/profile", "/settings", "/api/condos","/api/reservation","/api/users","/api/upload",];

export async function middleware(request: NextRequest) {
  console.log("🚀 Middleware running for:", request.nextUrl.pathname);

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  console.log("🔍 Token found:", token);

  // Check if the route is protected
  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!isProtected) {
    return NextResponse.next(); // Allow public routes
  }

  if (!token) {
    console.log("❌ No token found, redirecting...");
    if (request.nextUrl.pathname.split("/")[1].toLowerCase() == "api") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // ✅ Verify token using `jose`
    const { payload } = await jwtVerify(token, SECRET_KEY);
    console.log("✅ Token verified:", payload);
    return NextResponse.next(); // Allow request to continue
  } catch (error) {
    if (request.nextUrl.pathname.split("/")[1].toLowerCase() == "api") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// ✅ Middleware must run in Edge runtime (default in Next.js)
export const config = {
  matcher: [
    "/condo/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/api/condos:path*",
    "/api/reservation/:path*",
    "/api/users/:path*",
    "/api/upload/:path*",
  ],
};
