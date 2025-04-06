export async function alerts(params) {
      try {
            const key = process.env.WEATHER_API_KEY;
            const response = await fetch(
                  "http://api.weatherapi.com/v1/alerts.json?" + new URLSearchParams({
                        key: `${key}`,
                        q: `${params.lat}, ${params.lon}`
                  })
            );
            const res = await response.json();
            return res.alerts
      }
      catch (e) {
            console.log(e)
      }
}