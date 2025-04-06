import { NextResponse } from 'next/server';
import { alerts } from "../../../../utils/alerts";
import { isValidToken } from "../../../../Auth/validateToken";
const base_url = process.env.NEXT_PUBLIC_BASE_URL;

export async function OPTIONS() {
      return new NextResponse(null, {
            status: 200,
            headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'POST',
                  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
      });
}
function findCords(data) {
      // Check if data is empty
      if (!data || data.length === 0) {
            return { lat: null, lon: null };
      }

      const dataArray = Array.isArray(data) ? data : [data];

      // If there's only one entity, return its lat and lon
      if (dataArray.length === 1) {
            return {
                  lat: dataArray[0].lat,
                  lon: dataArray[0].lon
            };
      }

      // If multiple entities, search for "state_district" addresstype
      const stateDistrict = dataArray.find(location => location.addresstype === "state_district");
      if (stateDistrict) {
            return {
                  lat: stateDistrict.lat,
                  lon: stateDistrict.lon
            };
      }

      // If no state_district, search for "county" addresstype
      const county = dataArray.find(location => location.addresstype === "county");
      if (county) {
            return {
                  lat: county.lat,
                  lon: county.lon
            };
      }

      return {
            lat: dataArray[0].lat,
            lon: dataArray[0].lon
      };
}

export async function POST(request) {
      try {
            const authHeader = await request.headers.get("authorization");

            if (!authHeader) {
                  return NextResponse({ error: "Authorization header missing" }, { status: 401 })
            }
            if (!authHeader.startsWith("Bearer ")) {
                  return NextResponse({ error: "Invalid authorization token" }, { status: 403 })
            }
            const token = authHeader.substring(7);
            const valid = await isValidToken(token)
            if (!valid) {
                  return NextResponse.json({ Error: "Unauthorized Access" }, { status: 403 })
            }

            const { dist } = await request.json();

            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${dist}&format=json`)
            const data = await response.json();
            const {lat, lon} = findCords(data);

            if (!lat || !lon) {
                  return NextResponse.json({error: "Something Went Wrong"},{status : 400})
            }

            const cords = {
                  lat: lat,
                  lon: lon
            };
            const res = await alerts(cords);
            return NextResponse.json({ Place: dist, alerts: res.alert }, { status: 200 });
      }

      catch (e) {
            return NextResponse.json({ error: "Internal server Error" }, { status: 500 });
      }
}

