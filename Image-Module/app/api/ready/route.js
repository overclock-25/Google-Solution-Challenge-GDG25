import { NextResponse } from 'next/server';

export async function GET() {

  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const auth_key = process.env.AUTH_KEY;

  try {
    const apiResponse = await fetch(`${base_url}/health`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${auth_key}`,
            'Content-Type': 'application/json'
        },
    });
    if (!apiResponse.ok) {
      throw new Error(`API responded with status: ${apiResponse.status}`);
    }
    const data = await apiResponse.json();
    const response = NextResponse.json(data);
    return response;
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
