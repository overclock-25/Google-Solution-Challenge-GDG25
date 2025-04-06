function convertDateAndGetPrior(dateStr) {
      // Convert "M/D/YYYY" to "YYYYMMDD"
      const [day, month, year] = dateStr.split("/").map(Number);
      const date = new Date(year, month - 1, day);
      
      const stDate = new Date(date);
      stDate.setDate(date.getDate() - 15);

      const stYear = stDate.getFullYear();
      const stMonth = String(stDate.getMonth() + 1).padStart(2, '0');
      const stDay = String(stDate.getDate()).padStart(2, '0');
      const formattedStDate = `${stYear}-${stMonth}-${stDay}`;

      const endDate = new Date(date);
      endDate.setDate(date.getDate() + 15);

      const endYear = endDate.getFullYear();
      const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
      const endDay = String(endDate.getDate()).padStart(2, '0');
      const formattedEndDate = `${endYear}-${endMonth}-${endDay}`;

      return { stDate: formattedStDate, endDate: formattedEndDate };
}
export async function openMeteo(params) {
      try {
            const { stDate, endDate } = convertDateAndGetPrior(params.date);
            const resp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${params.lat}&longitude=${params.lon}&daily=precipitation_probability_max,precipitation_sum,wind_speed_10m_max&start_date=${stDate}&end_date=${endDate}&timezone=IST`);
            if (!resp.ok) {
                  throw new Error("Failed to fetch open-meteo data");
            }

            const data = await resp.json();
            const maxPrecipitateProd = data.daily.precipitation_probability_max;

            const maxPrecipitationProd = maxPrecipitateProd.toString();

            const calculateMeanReduce = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

            const meanPrecipitation = calculateMeanReduce(data.daily.precipitation_sum);
            const meanWindSpeed = calculateMeanReduce(data.daily.wind_speed_10m_max);

            return { maxPrecipitationProd, meanPrecipitation, meanWindSpeed };
      } catch (e) {
            return e;
      }
}

