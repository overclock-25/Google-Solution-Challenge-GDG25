import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, token } = body;
    
    if (!userId || !token) {
      return NextResponse.json({ error: "Missing userId or token" }, { status: 400 });
    }

    console.log("Saving FCM token", userId, token);

    const userRef = adminDb.collection("users").doc(userId);
    await userRef.set(
      { fcmTokens: FieldValue.arrayUnion(token) },
      { merge: true }
    );

    return NextResponse.json({ message: "Token saved" });
  } catch (error) {

  }
}
