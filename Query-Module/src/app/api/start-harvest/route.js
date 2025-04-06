import { NextResponse } from "next/server";
import { harvestQuery } from "@/lib/queries";
import { getWeatherSoil } from "@/lib/weatherModuledummy";
import { startHarvestInfo } from "@/lib/services/startHarvestService";
import { verifyAndGetUserId } from "@/lib/auth/verifyToken";
import { getLocationFromDB } from "@/lib/services/firebaseDb/getLocation";
import { storeInteractions } from "@/lib/services/firebaseDb/storeInteractions";

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

    const date = request.headers.get("x-date");
    const farmId = request.headers.get("x-farm-id");
    if (!farmId) {
      return NextResponse.json(
        { error: "Farm id is required" },
        { status: 400 }
      );
    }
    console.log({ farmId });

    const cropName = await request.json();
    console.log({ cropName });

    const location = await getLocationFromDB(userId, farmId);
    if (!location) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 400 }
      );
    }

    const weatherReqObj = {
      lat: location.lat,
      lon: location.lon,
      water_source_type: location.water_source_type,
      date: date, 
      growth_stage: 1,
      uid: farmId
    }

    const weatherSoilData = getWeatherSoil(weatherReqObj);
    const query = harvestQuery({
      crop: cropName,
      soilData: weatherSoilData.soil,
      weatherData: weatherSoilData.weather,
      location,
    });

    const geminiResponse = await startHarvestInfo(query);

    const result = await storeInteractions(farmId, userId, {
      type: "start-harvest",
      data: geminiResponse,
    });

    // console.dir( JSON.parse(geminiResponse), {depth: null} );    //! send msg if not stored in db
    return NextResponse.json(geminiResponse);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
