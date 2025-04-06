import { soilType } from "./helpers/soilType";
import { soilGrid } from "./helpers/soilGridProperties";
import { soilMoisture } from "./helpers/soilMoisture";

export async function soil(params) {
      try {
            const lat = params.cord.lat;
            const lon = params.cord.lon;
            const cord = { lat, lon };
            const uid = params.uid;

            //* Soil Type recieved
            const tempSoil = await soilType(cord);
            const typeSoil = tempSoil.soilType;
            const polygon = tempSoil.polygon;


            const [propertiesSoil, moistureSoil] = await Promise.all([
                  soilGrid(cord),
                  soilMoisture({polygon, uid})
            ]);

            const soilData = {
                  N: propertiesSoil.N,
                  P: null,
                  K: null,
                  ph: propertiesSoil.ph || 3,
                  soilTypeForModel: propertiesSoil.soilTypeForModel,
                  oM: propertiesSoil.oM,
                  SoilMoisture: moistureSoil.SoilMoisture,
                  soilTemp: moistureSoil.SoilTemp,
                  soilType: typeSoil,
            };

            return soilData;

      } catch (e) {
            console.log(e);
            return e;
      }
}
