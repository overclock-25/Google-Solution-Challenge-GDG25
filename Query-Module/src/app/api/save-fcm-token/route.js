import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { subToTopic } from "@/lib/services/token-subscribe";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, token } = body;

    if (!userId || !token) {
      return NextResponse.json(
        { error: "Missing userId or token" },
        { status: 400 }
      );
    }

    console.log("Saving FCM token", userId, token);

    const userRef = adminDb.collection("users").doc(userId);
    await userRef.set(
      { fcmTokens: FieldValue.arrayUnion(token) },
      { merge: true }
    );

    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (userData && userData.farms && userData.farms.length > 0) {
      const farmDocs = await Promise.all(
        userData.farms.map((farmRef) => farmRef.get())
      );

      const districtIds = farmDocs
        .map((doc) => (doc.exists ? doc.data().districtRef?.id : null))
        .filter(Boolean);

      const uniqueDistrictIds = [...new Set(districtIds)];

      console.log("District IDs:", uniqueDistrictIds);

      const subscriptionPromises = uniqueDistrictIds.map((districtId) =>
        subToTopic(token, districtId)
      );

      // Wait for all subscriptions to complete
      await Promise.all(subscriptionPromises);
      console.log(
        `Token subscribed to ${uniqueDistrictIds.length} district topics`
      );
    }

    return NextResponse.json({ message: "Token saved" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
