export async function soilMoisture(params) {
      try {
            const key = process.env.AGRO_API_KEY;
            const res = await fetch(
                  `http://api.agromonitoring.com/agro/1.0/polygons?appid=${key}`, {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                        "name": `${params.uid}`,
                        "geo_json": {
                              "type": "Feature",
                              "properties": {},
                              "geometry": {
                                    "type": "Polygon",
                                    "coordinates": [params.polygon]
                              }
                        }
                  })
            }
            );
            const response = await res.json();
            var farmId;

            if (response.name === "UnprocessableEntityError") {
                  const msg = response.message.split('.')[0];
                  farmId = msg.substring(msg.indexOf("'") + 1, msg.lastIndexOf("'"))
            } else {
                  farmId = response?.id;
            }

            const id = farmId;
            const resp = await fetch(`http://api.agromonitoring.com/agro/1.0/soil?polyid=${id}&appid=${key}`);
            if (!resp.ok) {
                  throw new Error("Failed to fetch soil Mositure data");
            }

            const data = await resp.json();
            const SoilTemp = data.t0 - 243.15;
            const SoilMoisture = data.moisture * 100;

            return { SoilTemp, SoilMoisture };
      } catch (e) {
            return e;
      }
}