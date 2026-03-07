/**
 * Generic service for interacting with Large Language Models (LLMs).
 * Handles API calls, error handling, and basic response parsing in a provider-agnostic way.
 */
export async function callLLM(prompt: string, options = { temperature: 1.0 }) {
  const apiUrl = process.env.LLM_API_URL;
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL;

  if (!apiUrl || !apiKey) {
    throw new Error(
      "LLM configuration (URL or API Key) is missing in environment variables",
    );
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      ...options,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM API error: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  const content = result.choices[0].message.content;

  // Attempt to parse JSON from the response content
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  const jsonString = jsonMatch ? jsonMatch[0] : content;

  try {
    return JSON.parse(jsonString);
  } catch {
    console.error("Failed to parse LLM response as JSON:", content);
    throw new Error("Invalid AI response format");
  }
}
