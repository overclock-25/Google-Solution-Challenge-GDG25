import { adminDb } from "@/lib/firebase/firebase-admin";
import { verifyAndGetUserId } from "@/lib/auth/verifyToken";
import { NextResponse } from "next/server";

async function getPayloadMapFromFarm(farmId) {
  const farmDoc = await adminDb.collection("farms").doc(farmId).get();
  if (!farmDoc.exists) {
    throw new Error(`Farm with ID ${farmId} does not exist`);
  }

  const farmData = farmDoc.data();
  const districtRef = farmData.districtRef;

  if (!districtRef || !districtRef.get) {
    throw new Error("districtRef is invalid or not a Firestore reference");
  }

  const districtSnap = await districtRef.get();
  if (!districtSnap.exists) {
    throw new Error(`District document not found: ${districtRef.path}`);
  }

  const districtData = districtSnap.data();
  const { code, name, state } = districtData;

  if (!code || !name || !state) {
    throw new Error("District document missing code, name, or state");
  }

  const exactKey = `${code}, ${name}, ${state}`;

  const notificationSnap = await adminDb
    .collection("notifications")
    .select(`payload.${exactKey}`)
    .limit(1)
    .get();

  if (notificationSnap.empty) {
    throw new Error("No documents found in notifications collection");
  }

  const doc = notificationSnap.docs[0];
  const payloadValue = doc.get(`payload.${exactKey}`);

  console.log({doc, payloadValue})
  if (!payloadValue) {
    return [];
    // throw new Error(`No entry found in payload for key: ${exactKey}`);
  }

  return payloadValue;
}

export async function GET(request) {
  const farmId = request.headers.get("x-farm-id");
  const authResult = await verifyAndGetUserId(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  const userId = authResult.userId;
  try {
    console.log(userId);

    const userSnapshot = await adminDb
      .collection("users")
      .where("__name__", "==", userId)
      .where("farms", "array-contains", adminDb.doc(`farms/${farmId}`))
      .get();

    if (userSnapshot.empty) {
      return NextResponse.json(
        { error: "Forbidden: Access Denied" },
        { status: 403 }
      );
    }

    const farmNotification = await getPayloadMapFromFarm(farmId);
    if (!farmNotification) {
      return NextResponse.json(
        { error: "Farm Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(farmNotification, { status: 200 });
  } catch (error) {
    console.error("Error fetching farm details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
