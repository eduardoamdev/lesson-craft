/**
 * Service for interacting with Deepseek AI.
 * Handles API calls, error handling, and basic response parsing.
 */
export async function callDeepseek(
  prompt: string,
  options = { temperature: 1.3 },
) {
  const apiUrl = "https://api.deepseek.com/v1/chat/completions";
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not defined in environment variables");
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: options.temperature,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Deepseek API error: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  const content = result.choices[0].message.content;

  // Attempt to parse JSON from the response content
  // Deepseek sometimes wraps JSON in markdown blocks or includes extra text
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  const jsonString = jsonMatch ? jsonMatch[0] : content;

  try {
    return JSON.parse(jsonString);
  } catch {
    console.error("Failed to parse Deepseek response as JSON:", content);
    throw new Error("Invalid AI response format");
  }
}
