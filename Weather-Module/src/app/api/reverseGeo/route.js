import { NextResponse } from 'next/server';
import { revGeo } from "../../../../utils/reverseGeo";

export async function OPTIONS() {
      return new NextResponse(null, {
            status: 200,
            headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
            },
      });
}

export async function POST(request) {
      try {
            const { lat, lon } = await request.json();

            const res = await revGeo({lat: lat, lon: lon});
            return NextResponse.json({district: res}, { status: 200 });
      }

      catch (e) {
            return NextResponse.json({ error: "Internal server Error" }, { status: 500 });
      }
}

