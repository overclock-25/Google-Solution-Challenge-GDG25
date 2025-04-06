import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
import JSON5 from "json5";

export async function getQueryResponse(query) {
  try {
    // const schema = {
    //   description: "List of responses",
    //   type: SchemaType.ARRAY,
    //   items: {
    //     type: SchemaType.OBJECT,
    //     properties: {
    //       keyName: {
    //         type: SchemaType.STRING,
    //         description: "The dynamic key name to use",
    //       },
    //       response: {
    //         type: SchemaType.STRING,
    //       },
    //     },
    //   },
    // };

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
          parts: [
            ...query.text.map((item) => ({ text: item.text })),
            ...(query?.image
              ? [
                  {
                    inline_data: {
                      mime_type: query.image.mimeType,
                      data: query.image.data,
                    },
                  },
                ]
              : []),
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

    const response = result.response.text();
    const data = JSON.parse(response);
    // const response = JSON.parse(result.response.text())?.responses?.[0]?.replace(/\\"/g, '"');
    // console.log(JSON5.parse(response));
    return response;
  } catch (error) {
    console.error("Error querying Gemini:", error);
    throw error;
  }
}
