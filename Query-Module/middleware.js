import { NextResponse } from "next/server";
import { adminAuth as auth } from "@/lib/firebase/firebase-admin";

export async function middleware(req) {
  console.log("Middleware triggered for:", req.nextUrl.pathname);
  const authHeader = req.headers.get("Authorization");
  console.log(authHeader, "authHeader");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 402 });
  }

  const token = authHeader.split(" ")[1];
  console.log(token);
  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = { uid: decodedToken.uid };

    return NextResponse.next();
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/", "/api/protected/:path*"],
};
