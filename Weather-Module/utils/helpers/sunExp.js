function convertDateAndGetPrior(dateStr) {
      // Convert "M/D/YYYY" to "YYYYMMDD"
      const [ day, month, year] = dateStr.split("/").map(Number);
      const date = new Date(year, month - 1, day);

      // Format as YYYYMMDD
      const formattedDate = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;

      // Get exactly 30 days prior
      const priorDate = new Date(date);
      priorDate.setDate(date.getDate() - 30);

      const priorYear = priorDate.getFullYear();
      const priorMonth = String(priorDate.getMonth() + 1).padStart(2, '0');
      const priorDay = String(priorDate.getDate()).padStart(2, '0');
      const formattedPriorDate = `${priorYear}${priorMonth}${priorDay}`;

      return { date: formattedDate, monthBefore: formattedPriorDate };
}

export async function sunLight(params) {

      try {
            const { date, monthBefore } = convertDateAndGetPrior(params.date);
            const powerApiResponse = await fetch(
                  `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN&community=ag&longitude=${params.lon}&latitude=${params.lat}&start=${monthBefore}&end=${date}&format=JSON`
            );

            function computeMean(parameterData) {
                  const validValues = Object.values(parameterData).filter(value => value !== -999.0);
                  if (validValues.length === 0) return null;
                  const sum = validValues.reduce((acc, val) => acc + val, 0);
                  return sum / validValues.length;
            }

            const powerApiData = await powerApiResponse.json();     

            const parameters = powerApiData?.properties.parameter;
            if (!parameters) {
                  throw new Error("Missing parameter data in response.");
            }
            const meanSunlightExposure = computeMean(parameters.ALLSKY_SFC_SW_DWN);
            return meanSunlightExposure;
      }
      catch (e) {
            console.log(e);
            return e;
      }
}