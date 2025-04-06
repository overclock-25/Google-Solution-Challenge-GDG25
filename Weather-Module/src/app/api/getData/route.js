import { NextResponse } from 'next/server';
import { predict, wakeUp } from "../../../../utils/models";
import { soil } from "../../../../utils/soil";
import { weather } from "../../../../utils/weather";
import { isValidToken } from "../../../../Auth/validateToken";

export async function OPTIONS() {
      return new NextResponse(null, {
            status: 200,
            headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'POST',
                  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
      });
}

export async function POST(request) {
      try {
            const authHeader = await request.headers.get("authorization");

            if (!authHeader) {
                  return NextResponse({ error: "Authorization header missing" }, { status: 401 })
            }
            if (!authHeader.startsWith("Bearer ")) {
                  return NextResponse({ error: "Invalid authorization token" }, { status: 403 })
            }
            const token = authHeader.substring(7);
            const valid = await isValidToken(token)
            if (!valid){
                  return NextResponse.json({Error: "Unauthorized Access"}, {status : 403})
            }
            const { lat, lon, date, growth_stage, water_source_type, uid } = await request.json();
            const cord = { lat, lon };

            const [dataSoil, dataWeather, wake] = await Promise.all([
                  soil({ cord, uid }),
                  weather({ lat, lon, date }),
                  wakeUp()
            ]);

            if (wake.status !== 200) {
                  return NextResponse.json({ error: "something Went Wrong" }, { status: 500 });
            }
            const prediction = await predict({ dataSoil, dataWeather, growth_stage, water_source_type });
            if (!prediction || !prediction.P || !prediction.K || !prediction.crop_suggesstion) {
                  throw new Error("Invalid prediction data structure");
            }
            let urbanApprox = dataWeather.urbanApprox;
            if(urbanApprox === 0){
                  urbanApprox = "No_information"
            }
            const result = {
                  soil: {
                        N: dataSoil.N,
                        P: prediction.P,
                        K: prediction.K,
                        ph: dataSoil.ph,
                        soil_moisture: dataSoil.SoilMoisture,
                        soil_type: dataSoil.soilType,
                        organic_matter: dataSoil.oM,
                        growth_stage: growth_stage,
                        water_source_type: water_source_type,
                        crop_suggestion: prediction.crop_suggesstion,
                  },
                  weather: {
                        carbonDioxideConcentration: dataWeather.carbonDioxideConcentration,
                        descriptionOfSky: dataWeather.descriptionOfSky,
                        temperature: dataWeather.temperature,
                        humidity: dataWeather.humidity,
                        sunlightExposure: dataWeather.sunlightExposure,
                        rainfall: dataWeather.rainfall,
                        windSpeed_10m_above_grd_level: dataWeather.windSpeed_10m_above_grd_level,
                        max_precipitation_probability: dataWeather.max_precipitation_probability,
                        urbanApprox: urbanApprox,
                  }
            }
            return NextResponse.json(result, { status: 200 });
      }

      catch (e) {
            return NextResponse.json({ error: "Internal server Error" }, { status: 500 });
      }
}

