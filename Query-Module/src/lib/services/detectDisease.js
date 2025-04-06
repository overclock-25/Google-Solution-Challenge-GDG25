export default async function detectDiseaseApi(formdata) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/detect`, {
      method: "POST",
      headers: {
        "apiKey": process.env.VALID_API_KEY,
      },
      body: formdata,
    });
  
    console.log(response);
    if (!response.ok) {
      throw new Error(`External API call failed with status: ${response.status}`);
    }
  
    // console.log(response.json())
    return await response.json();
  }
  