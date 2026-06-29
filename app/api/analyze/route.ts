import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { image, prompt } = await req.json();

    let retries = 3;
    let result;
    
    while (retries > 0) {
      try {
        result = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: image,
                  },
                },
              ],
            },
          ],
        });
        break; // Success
      } catch (error: any) {
        console.error("API Attempt failed:", error);
        const status = error.status || error.response?.status || error.error?.code;
        if (status === 503 && retries > 1) {
          retries--;
          await new Promise(resolve => setTimeout(resolve, 3000));
          continue;
        }
        throw error;
      }
    }

    if (!result || !result.text) {
        throw new Error("No text returned from API");
    }

    return NextResponse.json({ text: result.text });
  } catch (error) {
    console.error("Error analyzing image:", error);
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
  }
}
