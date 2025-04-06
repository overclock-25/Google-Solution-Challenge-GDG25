export async function revGeo(params) {
      try {
            const key = process.env.OAPI_KEY;
            const response = await fetch(
                  "http://api.openweathermap.org/geo/1.0/reverse?"+ new URLSearchParams({
                        appid: `${key}`,
                        lat: `${params.lat}`, 
                        lon: `${params.lon}`
                  })
            );
            const json = await response.json();
            const name = json[0].name;
            console.log(name)
            return name
      }
      catch (e) {
            console.log(e)
      }
}