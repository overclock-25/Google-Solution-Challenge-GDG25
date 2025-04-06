export const getWeatherSoil = async (weatherReqObj) => {
  const response = await fetch(`${process.env.WEATHER_API_URL}/api/getData`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WEATHER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(weatherReqObj),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log(response);
    throw new Error(`External API call failed with status: ${response.status}`);
  }

  return data;
};
