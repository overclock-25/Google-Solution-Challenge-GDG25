import { co2 } from "./helpers/co2";
import { openMeteo } from "./helpers/openMeteo";
import { openWeather } from "./helpers/openWeather";
import { sunLight } from "./helpers/sunExp";
import { urbanApprox } from "./helpers/urbanAppx";

export async function weather(params) {
      try {
            const lat = params.lat;
            const lon = params.lon;

            const cord = { lat, lon };

            const [carbonDioxide, dataOpenWeather, ubApprox, dataOpenMeteo, expoSun] = await Promise.all([
                  co2(cord),
                  openWeather(cord),
                  urbanApprox(cord),
                  openMeteo(params),  
                  sunLight(params),
            ]);

            const weatherData = {
                  carbonDioxideConcentration: carbonDioxide,
                  descriptionOfSky: dataOpenWeather.descriptionOfSky,
                  temperature: dataOpenWeather.temperature,
                  humidity: dataOpenWeather.humidity,
                  urbanApprox: ubApprox,
                  sunlightExposure: expoSun,
                  rainfall: dataOpenMeteo.meanPrecipitation,
                  windSpeed_10m_above_grd_level: dataOpenMeteo.meanWindSpeed,
                  max_precipitation_probability: dataOpenMeteo.maxPrecipitationProd,
            };


            return weatherData;

      } catch (e) {
            console.log(e);
            return e;
      }
}
