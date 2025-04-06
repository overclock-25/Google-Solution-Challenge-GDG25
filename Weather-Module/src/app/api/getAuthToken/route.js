import { NextResponse } from "next/server";
import { createToken } from "../../../../Auth/createToken";
export async function OPTIONS() {
      return new NextResponse(null, {
            status: 200,
            headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "GET, POST",
                  "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
      });
}
export async function GET() {
      const log = {
            api_name: "weather-soil-module API/getAuthToken",
            version: "1.0.01",
            introduction:
                  "Hello ! Nice to see you here. Let's start",
            tool_needed:
                  "You can use curl, but I recommend tools like Postman, ThunderClient to hit the route",
            "how to get the token":
                  "Hit this route with a POST request having a payload. The payload will have one field id : value (values are certain unique number assigned to the team member)",
            quaries: "For any quaries reach out through mail : das840kunal@gmail.com",
      };
      return NextResponse.json(log)
}

export async function POST(request) {
      try {
            const { id } = await request.json();
            const ids = ["11000122005", "11000122004", "110001220010", "11000122050"]
            if (!ids.includes(id)) {
                  return NextResponse.json({ error: "Who are You ?" }, { status: 403 });
            }
            const crTk = `DeveloperKey/${id}`
            const token = await createToken(crTk);

            return NextResponse.json({ "Token": `${token}`, "Active": "True" }, { status: 200 })

      } catch (e) {
            return NextResponse.json(
                  { error: "Internal Server eror" },
                  { status: 500 }
            );
      }
}
