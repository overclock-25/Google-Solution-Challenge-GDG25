import { adminDb } from "@/lib/firebase/firebase-admin";
import { verifyAndGetUserId } from "@/lib/auth/verifyToken";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id: farmId } = await params;
  const authResult = await verifyAndGetUserId(req);
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

    const farmDoc = await adminDb.collection("farms").doc(farmId).get();
    if (!farmDoc.exists) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 });
    }

    return NextResponse.json(
      { farm: { id: farmDoc.id, ...farmDoc.data() } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching farm details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
