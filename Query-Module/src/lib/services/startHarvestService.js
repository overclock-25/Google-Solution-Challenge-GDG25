import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
import JSON5 from "json5";

export async function startHarvestInfo(query) {
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

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [...query.map((item) => ({ text: item.text }))],
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

    console.log(result.response.text());
    const response = result.response.text();
    const data = JSON.parse(response);

    // const response = JSON.parse(
    //   result.response.text()
    // )?.responses?.[0]?.replace(/\\"/g, '"');

    // console.log( JSON.parse(response));
    // const response = JSON5.parse(
    //   JSON.parse(result.response.text())?.responses?.[0]?.replace(/\\"/g, '"')
    // );
    return response;
  } catch (error) {
    console.error("Error querying Gemini:", error);
    throw error;
  }
}
