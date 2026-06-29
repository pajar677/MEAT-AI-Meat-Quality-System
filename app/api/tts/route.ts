import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ role: "user", parts: [{ text: `Convert this text to audio: ${text}` }] }],
    });

    // NOTE: This is a placeholder. Real TTS might require different API handling
    // or audio data return. Assuming it returns audio buffer or data.
    return NextResponse.json({ audio: response.text });
  } catch (error) {
    console.error("Error in TTS:", error);
    return NextResponse.json({ error: "Failed to generate audio" }, { status: 500 });
  }
}
