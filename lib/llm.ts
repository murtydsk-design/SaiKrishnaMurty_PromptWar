import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Server-side utility to send prompts to the Gemini API.
 * Uses process.env.GEMINI_API_KEY. Never expose this on the client side.
 */
export async function generateWithGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error("Gemini API key is not configured.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Available text generation models supported by Google Gemini API
  // Put gemini-flash-latest first for fast, reliable response
  const rawModels = [
    process.env.GEMINI_MODEL,
    "gemini-flash-latest",
    "gemini-2.5-flash",
    "gemini-3.5-flash",
    "gemini-2.5-pro",
    "gemini-2.5-flash-lite",
    "gemini-pro-latest",
  ];

  const candidateModels = rawModels.filter(
    (m): m is string => typeof m === "string" && m.trim().length > 0
  );

  let lastError: unknown = null;

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.5,
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        return text;
      }
    } catch (err: unknown) {
      lastError = err;
      // If 404 model not found, try next candidate model
      if (
        err instanceof Error &&
        (err.message.includes("404") || err.message.includes("not found"))
      ) {
        console.warn(`Gemini model '${modelName}' not found (404), trying fallback model...`);
        continue;
      }
      // For other errors, break and report
      break;
    }
  }

  if (lastError instanceof Error && lastError.message.includes("Gemini API key")) {
    throw lastError;
  }

  console.error("Gemini API invocation error:", lastError);
  throw new Error("Failed to communicate with AI service.");
}
