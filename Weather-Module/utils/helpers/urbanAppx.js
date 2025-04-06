export async function urbanApprox(params) {
      try {
            const latNum = parseFloat(params.lat);
            const lonNum = parseFloat(params.lon);
            const iso6709 = `${latNum >= 0 ? '+' : ''}${latNum.toFixed(6)}${lonNum >= 0 ? '+' : ''}${lonNum.toFixed(6)}`;
            const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/locations/${iso6709}/nearbyCities?radius=100&limit=1&distanceUnit=KM`;
            const options = {
                  method: 'GET',
                  headers: {
                        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, // store your key safely in .env
                        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
                  }
            };

            const response = await fetch(url, options);
            const data = await response.json();
            if (data.data && data.data.length > 0) {
                  const city = data.data[0];
                  return city.distance

            } else {
                  return 0;
            }
      } catch (e) {
            return e;
      }
}