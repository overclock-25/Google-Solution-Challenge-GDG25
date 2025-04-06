import { adminAuth } from "@/lib/firebase/firebase-admin";

export async function verifyAndGetUserId(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return { error: "Unauthorized", status: 401 };
    }

    const token = authHeader.replace("Bearer ", "");
    const decodedToken = await adminAuth.verifyIdToken(token);
    if (!decodedToken) {
      return { error: "Invalid token", status: 401 };
    }

    return { userId: decodedToken.uid };
  } catch (error) {
    console.error("Token Verification Error:", error);
    return { error: "Invalid request", status: 400 };
  }
}
