import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { history } = await req.json();

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      history: history,
    });

    const result = await chat.sendMessage({
      message: history[history.length - 1].parts[0].text,
    });

    return NextResponse.json({ text: result.text });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json({ error: "Failed to chat" }, { status: 500 });
  }
}
