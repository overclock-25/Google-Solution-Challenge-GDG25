import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const getCrops = async (query) => {
  try {
    const schema = {
      type: "object",
      properties: {
        crops: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["crops"],
    };

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: query }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    return JSON.parse(result.response.text());
  } catch (err) {
    console.log(err);
  }
};
