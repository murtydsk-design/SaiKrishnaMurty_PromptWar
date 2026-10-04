/**
 * Server-side utility to send prompts to Gemini API using direct REST fetch / SDK.
 * Uses process.env.GEMINI_API_KEY. Never expose this on the client side.
 */
export async function generateWithGemini(prompt: string): Promise<{ text: string; model: string; status: number }> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.error("[ThinkLens] GEMINI_KEY_PRESENT=false");
    throw new Error("Gemini API key is not configured.");
  }

  console.log("[ThinkLens] GEMINI_KEY_PRESENT=true");

  const rawModels = [
    process.env.GEMINI_MODEL,
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-flash-lite-latest",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash-lite",
    "gemini-flash-latest",
  ];

  const candidateModels = rawModels.filter(
    (m): m is string => typeof m === "string" && m.trim().length > 0
  );

  let lastError: unknown = null;
  let lastStatus = 500;

  for (const modelName of candidateModels) {
    try {
      console.log(`[ThinkLens] MODEL=${modelName}`);
      console.log(`[ThinkLens] GEMINI_REQUEST_STARTED model=${modelName}`);

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
          },
        }),
      });

      lastStatus = response.status;
      console.log(`[ThinkLens] GEMINI_STATUS=${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[ThinkLens] GEMINI_MODEL_FAILED model=${modelName} status=${response.status} err=${errorText.substring(0, 150)}`);
        continue;
      }

      const data = await response.json();
      const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (typeof candidateText === "string" && candidateText.trim().length > 0) {
        console.log(`[ThinkLens] GEMINI_RESPONSE_RECEIVED length=${candidateText.length}`);
        return { text: candidateText, model: modelName, status: response.status };
      } else {
        console.warn(`[ThinkLens] GEMINI_EMPTY_RESPONSE model=${modelName}`);
      }
    } catch (err: unknown) {
      lastError = err;
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[ThinkLens] GEMINI_FETCH_ERROR model=${modelName} err=${errMsg.substring(0, 120)}`);
      continue;
    }
  }

  console.error("[ThinkLens] ALL_MODELS_FAILED lastStatus=", lastStatus);
  throw new Error(`Failed to communicate with AI service (Status: ${lastStatus}).`);
}
