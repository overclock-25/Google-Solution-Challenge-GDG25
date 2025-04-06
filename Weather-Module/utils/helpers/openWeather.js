export async function openWeather(params) {
      try {
            const key = process.env.OAPI_KEY;

            const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${params.lat}&lon=${params.lon}&appid=${key}&units=metric`);
            if (!resp.ok) {
                  throw new Error("Failed to fetch Open Weather API data");
            }

            const data = await resp.json();

            const desc = data.weather[0].description;
            const { temp_min, temp, temp_max, humidity } = data.main;
            const temperature = (temp_min + temp + temp_max) / 3;

            return { descriptionOfSky: desc, temperature, humidity };
      } catch (e) {
            return e;
      }
}