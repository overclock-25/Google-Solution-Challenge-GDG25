import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/firebase-admin";
import { verifyAndGetUserId } from "@/lib/auth/verifyToken";

export async function PATCH(request) {
  try {
    const { notification } = await request.json();
    const authResult = await verifyAndGetUserId(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.userId;
    const farmId = request.headers.get("x-farm-id");

    if (!farmId || !userId || typeof notification !== "boolean") {
      console.log(farmId, userId, notification, typeof notification);
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const farmRef = adminDb.collection("farms").doc(farmId);
    const farmDoc = await farmRef.get();

    if (!farmDoc.exists) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 });
    }

    const farmData = farmDoc.data();
    if (farmData?.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    await farmRef.update({ notification });

    return NextResponse.json(
      { message: "Notification updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
