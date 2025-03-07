// src/app/api/deepgram/transcribe/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@deepgram/sdk";

export async function POST(req: Request) {
  try {
    // Get audio data from request
    const body = await req.json();
    const { audioData } = body;

    if (!audioData) {
      return NextResponse.json(
        { error: "No audio data provided" },
        { status: 400 }
      );
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioData.split(",")[1], "base64");

    // Get Deepgram API key
    const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
    if (!deepgramApiKey) {
      return NextResponse.json(
        { error: "Deepgram API key not configured" },
        { status: 500 }
      );
    }

    // Initialize Deepgram client
    const deepgram = createClient(deepgramApiKey);

    // Send audio to Deepgram for transcription
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: "nova-3",
        smart_format: true,
      }
    );

    if (error) {
      console.error("Deepgram transcription error:", error);
      return NextResponse.json(
        { error: "Transcription failed" },
        { status: 500 }
      );
    }

    // Extract transcript
    const transcript =
      result.results?.channels[0]?.alternatives[0]?.transcript || "";

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
