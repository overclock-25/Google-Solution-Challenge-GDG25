import { NextResponse } from "next/server";
import { getCrops } from "@/lib/services/getCropsService";
import { cropQuery } from "@/lib/queries";
import { getWeatherSoil } from "@/lib/weatherModuleFetch";
import { getLocationFromDB } from "@/lib/services/firebaseDb/getLocation";
import { verifyAndGetUserId } from "@/lib/auth/verifyToken";

export async function GET(request) {
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
    console.log({ date });
    const farmId = request.headers.get("x-farm-id");
    if (!farmId) {
      return NextResponse.json(
        { error: "Farm id is required" },
        { status: 400 }
      );
    }

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

    const weatherSoilData = await getWeatherSoil(weatherReqObj);
    console.log({weatherSoilData})
    const query = cropQuery({
      soilData: weatherSoilData.soil,
      weatherData: weatherSoilData.weather,
    });

    const geminiResponse = await getCrops(query);
    // console.log(geminiResponse)
    return NextResponse.json(geminiResponse);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
