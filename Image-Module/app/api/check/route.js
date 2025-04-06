import { NextResponse } from 'next/server';

const base_url = process.env.NEXT_PUBLIC_BASE_URL;
const auth_key = process.env.AUTH_KEY;


export async function POST(request) {
  console.log(request);
  try {
    const formdata = await request.formData();
    
    if (!formdata) {
      return NextResponse.json({ error: 'Image is required' }, { status: 422 });
    }

    // Call the external API
    const externalApiResponse = await detectDiseaseApi(formdata);

    // Return the response from the external API
    return NextResponse.json(externalApiResponse, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Placeholder for calling the external API
async function detectDiseaseApi(formdata) {
  const response = await fetch(`${base_url}/detect`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${auth_key}`
    },
    body: formdata,
  });

  if (!response.ok) {
    throw new Error(`External API call failed with status: ${response.status}`);
  }

  return await response.json();
}