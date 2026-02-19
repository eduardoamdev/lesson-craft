async function callDeepSeekForConversation(description) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const apiUrl = 'https://api.deepseek.com/v1/chat/completions';

  const promptTemplate = `You are an English conversation generator for language learners (B1-B2 level).

User's request: "${description}"

Generate a natural conversation based on this description. The conversation should:
1. Have 6-10 exchanges (back and forth between two speakers)
2. Be appropriate for B1-B2 English level
3. Use natural, conversational language
4. Include realistic context and phrasing

Also generate 4 comprehension questions about the conversation, each with 4 possible answers (only one correct).

You MUST respond with ONLY valid JSON in this EXACT structure (no other text):

{
  "conversation": [
    { "speaker": "Person A", "text": "Hello, how are you?" },
    { "speaker": "Person B", "text": "I'm fine, thank you!" }
  ],
  "questions": [
    {
      "question": "What did Person A ask?",
      "options": ["How are you?", "Where are you?", "Who are you?", "What are you?"],
      "correctAnswer": 0
    }
  ]
}

Important rules:
- "speaker" should be descriptive role names (e.g., "Customer", "Waiter", "Teacher", "Student")
- Do NOT use voice field - we will assign voices automatically
- Generate exactly 4 questions
- "correctAnswer" is the index (0-3) of the correct option
- Do NOT add any explanation or text outside the JSON`;

  try {
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
            content: [
              {
                type: 'text',
                text: promptTemplate
              }
            ]
          }
        ],
        temperature: 1.0
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Details:', errorData);
      throw new Error(`HTTP error! status: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;
    
    return answer;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error.message);
    throw error;
  }
}

function validateConversationData(data) {
  // Check if data has required properties
  if (!data.conversation || !Array.isArray(data.conversation)) {
    throw new Error('Invalid response: missing or invalid conversation array');
  }
  
  if (!data.questions || !Array.isArray(data.questions)) {
    throw new Error('Invalid response: missing or invalid questions array');
  }
  
  // Validate conversation structure
  if (data.conversation.length < 4) {
    throw new Error('Conversation is too short (minimum 4 exchanges required)');
  }
  
  for (const exchange of data.conversation) {
    if (!exchange.speaker || !exchange.text) {
      throw new Error('Invalid conversation format: each exchange must have speaker and text');
    }
  }
  
  // Validate questions
  if (data.questions.length !== 4) {
    throw new Error(`Expected 4 questions, got ${data.questions.length}`);
  }
  
  for (const q of data.questions) {
    if (!q.question || !q.options || !Array.isArray(q.options)) {
      throw new Error('Invalid question format');
    }
    if (q.options.length !== 4) {
      throw new Error('Each question must have exactly 4 options');
    }
    if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
      throw new Error('correctAnswer must be a number between 0 and 3');
    }
  }
  
  return true;
}

function assignVoices(conversation) {
  // Assign alternating voices to speakers
  const femaleVoice = 'Telnyx.NaturalHD.astra';
  const maleVoice = 'Telnyx.NaturalHD.andersen_johan';
  
  const speakerVoices = {};
  let nextVoice = femaleVoice;
  
  return conversation.map(exchange => {
    if (!speakerVoices[exchange.speaker]) {
      speakerVoices[exchange.speaker] = nextVoice;
      nextVoice = nextVoice === femaleVoice ? maleVoice : femaleVoice;
    }
    
    return {
      ...exchange,
      voice: speakerVoices[exchange.speaker]
    };
  });
}

async function generateConversation(req, res) {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Conversation description is required' });
    }

    console.log('Generating conversation for description:', description);

    // Call DeepSeek API
    const generatedContent = await callDeepSeekForConversation(description);
    console.log('Generated content from DeepSeek API:', generatedContent);

    // Parse and validate response
    let parsedData;
    try {
      // Remove markdown code blocks if present
      let cleanContent = generatedContent.trim();
      cleanContent = cleanContent.replace(/^```json\s*/i, '');
      cleanContent = cleanContent.replace(/^```\s*/i, '');
      cleanContent = cleanContent.replace(/```\s*$/i, '');
      cleanContent = cleanContent.trim();
      
      parsedData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      return res.status(500).json({ 
        error: 'Failed to parse AI response. Please try again.' 
      });
    }

    // Validate structure
    try {
      validateConversationData(parsedData);
    } catch (validationError) {
      console.error('Validation error:', validationError.message);
      return res.status(500).json({ 
        error: 'Invalid conversation format from AI. Please try again.' 
      });
    }

    // Assign voices to speakers
    const conversationWithVoices = assignVoices(parsedData.conversation);

    const conversationData = {
      timestamp: Date.now(),
      description,
      conversation: conversationWithVoices,
      questions: parsedData.questions,
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Conversation generated successfully',
      data: conversationData
    });

  } catch (error) {
    console.error('Error generating conversation:', error);
    res.status(500).json({ 
      error: 'Failed to generate conversation: ' + error.message 
    });
  }
}

module.exports = {
  generateConversation
};
