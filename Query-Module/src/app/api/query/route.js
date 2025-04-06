import { NextResponse } from "next/server";
import { pestQuery, suggestionQuery } from "@/lib/queries";
import { getWeatherSoil } from "@/lib/weatherModuleFetch";
// import { getWeatherSoil } from "@/lib/weatherModuledummy";
import { getQueryResponse } from "@/lib/services/queryService";
import { verifyAndGetUserId } from "@/lib/auth/verifyToken";
import { getLocationFromDB } from "@/lib/services/firebaseDb/getLocation";
import { storeInteractions } from "@/lib/services/firebaseDb/storeInteractions";
import detectDiseaseApi from "@/lib/services/detectDisease";

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
    const { searchParams } = request.nextUrl;
    const queryType = searchParams.get("type");

    if (queryType !== "suggestion" && queryType !== "pest") {
      return NextResponse.json(
        { error: "Invalid Query Type." },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const text = formData.get("text");
    const imageFile = formData.get("file");

    // console.log(formData.get("growth"))
    if (!text) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    let imageBase64 = null;
    let mimeType = null;

    if (imageFile && typeof imageFile.arrayBuffer === "function") {
      const imageBuffer = await imageFile.arrayBuffer();
      imageBase64 = Buffer.from(imageBuffer).toString("base64");
      mimeType = imageFile.type;
    }

    const location = await getLocationFromDB(userId, farmId);
    if (!location) {
      console.log("first");
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
      growth_stage: Number(formData.get("growth")),
      uid: farmId
    }

    const weatherSoilData = getWeatherSoil(weatherReqObj);

    var detectionData = null;
    try {
      if (!!imageBase64) {
        const newFormData = new FormData();
        newFormData.append("file", imageFile);

        detectionData = await detectDiseaseApi(newFormData);
        console.log(detectionData, "detected");
      }
    } catch (error) {
      console.log("error in external api");
      console.log(error.status);
    }

    const modifiedQuery =
      queryType === "suggestion"
        ? suggestionQuery({
            userQuery: text,
            soilData: weatherSoilData.soil,
            weatherData: weatherSoilData.weather,
            location,
            hasImage: !!imageBase64, // Pass boolean indicating if image exists
            issues: detectionData ? detectionData.issues : null,
          })
        : queryType === "pest"
        ? pestQuery({
            userQuery: text,
            soil_data: weatherSoilData.soil,
            weather_data: weatherSoilData.weather,
            location,
            hasImage: !!imageBase64,
            issues: detectionData ? detectionData.issues : null,
          })
        : "";

    let query = {
      text: modifiedQuery,
    };

    if (imageFile && imageBase64) {
      query.image = {
        data: imageBase64,
        mimeType: mimeType,
      };
    }

    const geminiResponse = await getQueryResponse(query);

    const result = await storeInteractions(farmId, userId, {
      type: queryType,
      data: geminiResponse,
    });

    console.log(geminiResponse);

    return NextResponse.json(geminiResponse);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
