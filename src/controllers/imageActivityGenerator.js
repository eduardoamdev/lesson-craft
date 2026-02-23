const path = require('path');
const fs = require('fs');

// Render image-display.ejs with activity and questions from JSON
function renderImageDisplay(req, res) {
  const dataPath = path.join(__dirname, '../../data/imageActivityData.json');
  let activity = null;
  let questions = [];
  try {
    const raw = fs.readFileSync(dataPath, 'utf8');
    const parsed = JSON.parse(raw);
    activity = parsed.activity || {};
    questions = parsed.questions || [];
  } catch (e) {
    activity = {};
    questions = [];
  }
  res.render('image-display', { activity, questions });
}
async function callDeepSeekAPI(description) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const apiUrl = 'https://api.deepseek.com/v1/chat/completions';

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not configured');
  }

  // Pre-built prompt template with placeholder for image description
  const promptTemplate = `We are in the context of a particular English lesson. The activity is "Commenting on the image". Between B1 and B2 level. 

The description of the image is: "${description}"

I want you to provide the texts for the activity:
1. Sentences with blanks where words can be filled in, with multiple choice options below each sentence. IMPORTANT: Randomize the position of the correct answer in each multiple choice question - do NOT always place it first.
2. One open question about describing the image with student's own words.

You MUST respond with ONLY valid JSON following this exact structure (no additional properties):
{
  "multiple_choice_sentences": [
    {
      "sentence": "The sentence with a __________ blank.",
      "options": ["option1", "option2", "option3", "option4"],
      "correct_option": 0
    }
  ],
  "open_question": "Your open-ended question here."
}

Important: 
- Use "multiple_choice_sentences" (not multiple_choice_blanks or any other name)
- Use "open_question" as a string (not an object)
- "correct_option" must be a number (0 for first option, 1 for second, etc.)
- Do not add any extra properties or wrap this in any other object`;

  try {
    const abortController = new AbortController();
    const timeoutMs = Number(process.env.DEEPSEEK_TIMEOUT_MS || 30000);
    const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: promptTemplate
          }
        ],
        temperature: 1.3
      }),
      signal: abortController.signal
    });

    clearTimeout(timeoutId);

    const rawBody = await response.text();
    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      parsedBody = null;
    }

    if (!response.ok) {
      const apiError = parsedBody?.error?.message || parsedBody?.message || rawBody || 'Unknown error';
      console.error('API Error Details:', parsedBody || rawBody);
      throw new Error(`HTTP error! status: ${response.status} - ${apiError}`);
    }

    const data = parsedBody;
    if (!data?.choices?.[0]?.message?.content) {
      throw new Error('DeepSeek returned an unexpected response format');
    }

    const answer = data.choices[0].message.content;
    
    return answer;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error.message);
    throw error;
  }
}

async function generateImageActivity(req, res) {
  try {
    const { description, imageTitle } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Image description is required' });
    }

    console.log('Generating activity for image description:', description);

    // Call DeepSeek API
    const generatedContent = await callDeepSeekAPI(description);

    console.log('Generated content from DeepSeek API:', generatedContent);



    // Parse generatedContent robustly (strip triple backticks and extra text)
    let parsed = {};
    function extractJsonString(raw) {
      if (!raw) return null;
      let s = String(raw).trim();
      s = s.replace(/^```(?:json)?\s*/i, '');
      s = s.replace(/\s*```$/i, '');
      // If the string contains a JSON object, try to find the first {...} block
      const firstBrace = s.indexOf('{');
      const lastBrace = s.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        return s.slice(firstBrace, lastBrace + 1);
      }
      return s;
    }
    try {
      parsed = JSON.parse(extractJsonString(generatedContent));
    } catch (e) {
      parsed = {};
    }

    console.log('Parsed content for activity:', parsed);

    // Prepare activity and questions for display
    const activity = {
      imageTitle: imageTitle || null,
      customImageBase64: null, // You can enhance this if needed
      description,
      open_question: parsed.open_question || ''
    };
    const questions = parsed.multiple_choice_sentences || [];

    // Save to imageActivityData.json for display route
    const fs = require('fs');
    const path = require('path');
    try {
      fs.writeFileSync(
        path.join(__dirname, '../../data/imageActivityData.json'),
        JSON.stringify({ activity, questions }, null, 2),
        'utf8'
      );
    } catch (err) {
      console.error('Failed to write imageActivityData.json:', err);
    }

    console.log('response to be sent to frontend:', { activity, questions });

    res.json({
      success: true,
      message: 'Activity generated successfully',
      data: { activity, questions }
    });

  } catch (error) {
    console.error('Error generating activity:', error);
    res.status(500).json({ 
      error: 'Failed to generate activity',
      details: error.message 
    });
  }
}

module.exports = {
  generateImageActivity,
  renderImageDisplay
};
