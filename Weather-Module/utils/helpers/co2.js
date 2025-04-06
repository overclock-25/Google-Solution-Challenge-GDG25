export async function co2(params) {
      try {
            const resp = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${params.lat}&longitude=${params.lon}&hourly=carbon_dioxide&forecast_days=1&domains=cams_global&timezone=IST`);
            if (!resp.ok) {
                  throw new Error("Failed to fetch co2 data");
            }

            const data = await resp.json();
            const carbonDioxide = data.hourly.carbon_dioxide.length ? data.hourly.carbon_dioxide.reduce((a, b) => a + b, 0) / data.hourly.carbon_dioxide.length : 0;
            return carbonDioxide;
      } catch (e) {
            return e;
      }
}
