import { NextResponse } from 'next/server';

const base_url = process.env.NEXT_PUBLIC_BASE_URL;
const auth_key = process.env.AUTH_KEY;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, apiKey',
    },
  });
}

export async function POST(request) {
  console.log(request);
  
  const apiKey = request.headers.get('apiKey');
  try {
    const formdata = await request.formData();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    if (!formdata) {
      return NextResponse.json({ error: 'Image is required' }, { status: 422 });
    }

    // Validate API key (replace with your actual validation logic)
    const isValidApiKey = await validateApiKey(apiKey);
    if (!isValidApiKey) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 403 });
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

// Placeholder for API key validation logic
async function validateApiKey(apiKey) {
  // Replace this with your actual API key validation logic
  // Example: Check against a database or environment variable
  return apiKey === process.env.VALID_API_KEY;
}

// Placeholder for calling the external API
async function detectDiseaseApi(formdata) {
  // Replace this with your actual external API call logic
  // Example: Using fetch or axios to send the image to another API
  const response = await fetch(`${base_url}/detect`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${auth_key}`
    },
    body: formdata, // Adjust as needed
  });

  if (!response.ok) {
    throw new Error(`External API call failed with status: ${response.status}`);
  }

  return await response.json();
}
