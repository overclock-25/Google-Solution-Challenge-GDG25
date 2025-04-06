export async function soilType(params) {
      try {
            const lat = params.lat;
            const lon = params.lon;
            const response = await fetch(
                  "https://api.openepi.io/soil/type/summary?" + new URLSearchParams({
                        min_lon: `${lon}`,
                        max_lon: `${lon+0.01}`,
                        min_lat: `${lat}`,    
                        max_lat: `${lat+0.01}`,
                  })
            );
            const res = await response.json();
            const soilType = res.properties.summaries[0].soil_type;
            
            const polygon = res.geometry.coordinates[0];
            return {soilType, polygon};
      } catch (e) {
            console.log(e);
            return e;
      }
}
