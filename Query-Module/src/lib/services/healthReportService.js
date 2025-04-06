import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function healthReport(query) {
  try {
    const schema = {
      type: "object",
      properties: {
        responses: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["responses"],
    };

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            ...query.text.map((item) => ({ text: item.text })),
            {
              inline_data: {
                mime_type: query.image.mimeType,
                data: query.image.data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
        // responseSchema: schema,
        responseMimeType: "application/json",
      },
    });

    const response = result.response.text()
    const data = JSON.parse(response);
    
    // const response = JSON.parse(
    //   result.response.text()
    // )?.responses?.[0]?.replace(/\\"/g, '"');

    // const response = JSON5.parse(
    //   JSON.parse(result.response.text())?.responses?.[0]?.replace(/\\"/g, '"')
    // );
    return response;
  } catch (error) {
    console.error("Error querying Gemini:", error);
    throw error;
  }
}
