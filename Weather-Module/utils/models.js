const HF_Access_Token = process.env.HG_FACE_API_KEY;
const HF_URL = process.env.HG_FACE_URL;
export async function predict(params) {
      try {

            const attributes = {
                  N: params.dataSoil.N,
                  temperature: params.dataWeather.temperature,
                  humidity: params.dataWeather.humidity,
                  ph: params.dataSoil.ph,
                  rainfall: params.dataWeather.rainfall,
                  soil_moisture: params.dataSoil.SoilMoisture,
                  soil_type: params.dataSoil.soilTypeForModel,
                  sunlight_exposure: params.dataWeather.sunlightExposure,
                  wind_speed: params.dataWeather.windSpeed_10m_above_grd_level,
                  co2_concentration: params.dataWeather.carbonDioxideConcentration,
                  organic_matter: params.dataSoil.oM,
                  growth_stage: params.growth_stage,
                  urban_area_proximity: params.dataWeather.urbanApprox,
                  water_source_type: params.water_source_type,
            }

            //console.log(attributes)

            const res = await fetch(`${HF_URL}/predict`, {
                  "method": "POST",
                  "headers": {
                        'Authorization': `Bearer ${HF_Access_Token}`,
                        "Content-Type": "application/json"
                  },
                  body: JSON.stringify(attributes)
            });

            const data = await res.json();
            const P = data.regression_prediction[0]
            const K = data.regression_prediction[1]
            const crop = data.crop_prediction
            const prediction = { P: P, K: K, crop_suggesstion: crop };

            return prediction;
      } catch (error) {
            console.log(error)
            return error;
      }
}

export async function wakeUp() {
      try {
            const res = await fetch(`${HF_URL}/wakeUp`,{
                  "method" : "GET",
                  "headers" : {
                        'Authorization': `Bearer ${HF_Access_Token}`,
                        "Content-Type" : "application/json"
                  }
            });

            const data = await res.json();
            if (res.status !== 200 ) {
                  throw new Error("Failed to wake up the model");
            }
            return {status : 200, message: "Model is awake"}
      } catch (error) {
            console.log(error)
            return error;
      }
}