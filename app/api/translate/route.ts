import { NextResponse } from "next/server";

const API_HOST = "openl-translate.p.rapidapi.com";
const API_KEY = process.env.RAPIDAPI_KEY;

export async function POST(request: Request) {
  try {
    const { text, target_lang } = await request.json();

    if (!text || !target_lang) {
      return NextResponse.json(
        { message: "Text and target language are required" },
        { status: 400 }
      );
    }

    if (!API_KEY) {
      return NextResponse.json(
        { message: "API key is not configured" },
        { status: 500 }
      );
    }

    // Updated request format based on the OpenL Translate API requirements
    const url = "https://openl-translate.p.rapidapi.com/translate";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": API_HOST,
      },
      body: JSON.stringify({
        text: text,
        target_lang: target_lang,
        source_lang: "auto", // Add auto-detection for source language
      }),
    };

    console.log("Sending request with options:", {
      url,
      headers: options.headers,
      body: options.body,
    });

    const response = await fetch(url, options);

    // Log the raw response for debugging
    const rawResponse = await response.text();
    // console.log("Raw API response:", rawResponse)

    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(rawResponse);
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
      return NextResponse.json(
        {
          message: "Invalid response from translation service",
          rawResponse,
        },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error("API Error:", data);
      return NextResponse.json(
        {
          message: "Translation service error",
          details: data,
        },
        { status: response.status }
      );
    }

    // Check if the expected field exists
    if (!data.translatedText) {
      // console.error("Unexpected API response format:", data)
      return NextResponse.json(
        {
          message: "Unexpected response format from translation service",
          data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ translatedText: data.translatedText });
  } catch (error) {
    // console.error("Translation error:", error)
    return NextResponse.json(
      {
        message: "Failed to process translation request",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
