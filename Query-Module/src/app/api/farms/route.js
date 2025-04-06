import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/firebase-admin";
import { z } from "zod";
import { verifyAndGetUserId } from "@/lib/auth/verifyToken";
import { GeoPoint } from "firebase-admin/firestore";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request) {
  const authResult = await verifyAndGetUserId(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  const userId = authResult.userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userDoc = await adminDb.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    const farmIds = userData.farms?.map((ref) => ref.id) || [];

    if (farmIds.length === 0) {
      return NextResponse.json({ farms: [] }, { status: 200 });
    }

    const farmsSnapshot = await adminDb
      .collection("farms")
      .where("__name__", "in", farmIds)
      .select("name", "notification")
      .get();

    const farms = farmsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ farms }, { status: 200 });
  } catch (error) {
    console.error("Error fetching farms:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const farmSchema = z.object({
  name: z.string().min(3, "Farm name must be at least 3 characters"),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  waterSource: z.number(),
  notification: z.boolean().default(false),
  state: z.string(),
  district: z.string(),
  districtCode: z.number(),
});

export async function POST(request) {
  try {
    const authResult = await verifyAndGetUserId(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const validatedData = farmSchema.parse(body);

    const userRef = adminDb.collection("users").doc(userId);
    if (!userRef) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }
    const districtId = `IN${validatedData.districtCode}`;
    let districtRef = adminDb.collection("districts").doc(districtId);
    const districtDoc = await districtRef.get();

    if (!districtDoc.exists) {
      await districtRef.set({
        code: validatedData.districtCode,
        name: validatedData.district,
        state: validatedData.state,
      });
    }

    const farmRef = await adminDb.collection("farms").add({
      name: validatedData.name,
      waterSource: validatedData.waterSource,
      notification: validatedData.notification,
      location: new GeoPoint(
        validatedData.location.latitude,
        validatedData.location.longitude
      ),
      userId,
      userRef,
      districtRef,
      createdAt: new Date(),
    });

    await userRef.set(
      { farms: FieldValue.arrayUnion(farmRef) },
      { merge: true }
    );

    return NextResponse.json(
      { success: true, id: farmRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
