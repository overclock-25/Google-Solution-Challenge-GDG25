import { NextResponse } from "next/server";
import { cropHealthReportQuery } from "@/lib/queries";
// import { getWeatherSoil } from "@/lib/weatherModuledummy";
import { getWeatherSoil } from "@/lib/weatherModuleFetch";
import { healthReport } from "@/lib/services/healthReportService";
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
    if (!farmId) {
      return NextResponse.json(
        { error: "Farm id is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get("file");

    console.log({formData})
    if (!imageFile) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Convert image file to base64
    const imageBuffer = await imageFile.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");
    const mimeType = imageFile.type;

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

    try {
      console.log("External");
      const detectionData = await detectDiseaseApi(formData);
      if (detectionData.valid) {
        const modifiedQuery = cropHealthReportQuery({
          soilData: weatherSoilData.soil,
          weatherData: weatherSoilData.weather,
          location,
          issues: detectionData.issues,
        });

        const query = {
          text: modifiedQuery,
          image: {
            data: imageBase64,
            mimeType: mimeType,
          },
          processedImage: {
            data: detectionData.processed_image.split(",")[1],
            mimeType: mimeType,
          },
        };
        const geminiResponse = await healthReport(query);
        const result = await storeInteractions(farmId, userId, {
          type: "health-report",
          data: geminiResponse,
        });
        
        console.log("got detected");
        return NextResponse.json(geminiResponse);
      }
      console.log(detectionData.valid);
    } catch (error) {
      console.log("Error in external api");
      const modifiedQuery = cropHealthReportQuery({
        soilData: weatherSoilData.soil,
        weatherData: weatherSoilData.weather,
        location,
      });

      const query = {
        text: modifiedQuery,
        image: {
          data: imageBase64,
          mimeType: mimeType,
        },
      };

      const geminiResponse = await healthReport(query);

      const result = await storeInteractions(farmId, userId, {
        type: "health-report",
        data: geminiResponse,
      });

      console.log("Not detected");
      return NextResponse.json(geminiResponse);
    }
    return NextResponse.json(detectionData);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
