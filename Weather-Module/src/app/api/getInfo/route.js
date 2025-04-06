import { NextResponse } from 'next/server';

export async function OPTIONS() {
      return new NextResponse(null, {
            status: 200,
            headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'GET',
                  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
      });
}
export async function GET() {
      const log = {
            "api_name": "weather-soil-module API",
            "version": "1.0",
            "description": "Provides weather alerts, soil and weather data, reverse geocoding services.",
            "routes": [
                  {
                        "route": "/alerts",
                        "method": "POST",
                        "description": "Fetches weather-related alerts based on location."
                  },
                  {
                        "route": "/getData",
                        "method": "POST",
                        "description": "Retrieves soil and weather data based on input parameters."
                  },
                  {
                        "route": "/reverseGeo",
                        "method": "POST",
                        "description": "Performs reverse geocoding to get location details from coordinates."
                  },
                  {
                        "route": "/getAuthToken",
                        "Note" : "Every AuthToken is preceeded with Bearer",
                        "methods": [
                              {
                                    "method": "POST",
                                    "description": "Generates an authentication key for API access."
                              },
                              {
                                    "method": "GET",
                                    "description": "Get instruction to Generates an authentication key for API access."
                              }
                        ],
                  }
            ],
            "usage": {
                  "Authorization": "API key required for access. Obtain it from the /getAuthToken route.",
                  "data_source": "Weather and soil data aggregated from satellite and ground-based sources."
            },
            "provider" : {
                  "developer" : "Kyo",
                  "description" : "Developed under the a poject of TeamOverclock",
                  "maintained" : "Currently maintained by Kyo",
                  "regulations" : "All rights Reserved @2025"
            },
            "spoiler" :  " ver 2.0 will have a fully funtionable reverse-geoCoder ", 
      }

      return NextResponse.json(log)
}