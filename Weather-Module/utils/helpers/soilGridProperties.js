export async function soilGrid(params) {
      try {
            const lat = params.lat;
            const lon = params.lon;
            const rLon = Math.round(lon * 10) / 10;
            const rLat = Math.round(lat * 10) / 10;
            const response = await fetch(
                  `https://api.openepi.io/soil/property?lon=${rLon}&lat=${rLat}&depths=0-5cm&properties=nitrogen&values=mean&properties=clay&properties=sand&properties=silt&properties=phh2o&properties=soc`
            );
            const res = await response.json()
            const layerMap = Object.fromEntries(
                  res.properties.layers.map(layer => [layer.code, layer])
            );

            const N = layerMap["nitrogen"]?.depths[0]?.values?.mean * 0.1;
            const ph = layerMap["phh2o"]?.depths[0]?.values?.mean;

            const clay = layerMap["clay"]?.depths[0]?.values?.mean;
            const sand = layerMap["sand"]?.depths[0]?.values?.mean;
            const silt = layerMap["silt"]?.depths[0]?.values?.mean;
            const soilDom = { 1: clay, 2: sand, 3: silt };

            const soilT = Object.keys(soilDom).reduce(
                  (a, b) => (soilDom[a] > soilDom[b] ? a : b)
            );

            const oM = layerMap["soc"]?.depths[0]?.values?.mean * 0.01724;

            return {
                  N: N,
                  ph: ph,
                  soilTypeForModel: soilT,
                  oM: oM
            };
      } catch (e) {
            console.log(e);
            return e;
      }
}
