const path = require('path');

const fs = require('fs');

function loadConversationData() {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../../data/conversationData.json'), 'utf8');
    const parsed = JSON.parse(data);
    console.log('[LOAD] Loaded conversation data:', JSON.stringify(parsed, null, 2));
    return parsed;
  } catch (e) {
    console.log('[LOAD] No conversation data found or error:', e.message);
    return { conversation: [], questions: [] };
  }
}

function saveConversationData(conversation, questions) {
  console.log('[SAVE] Saving conversation:', JSON.stringify(conversation, null, 2));
  console.log('[SAVE] Saving questions:', JSON.stringify(questions, null, 2));
  try {
    fs.writeFileSync(
      path.join(__dirname, '../../data/conversationData.json'),
      JSON.stringify({ conversation, questions }, null, 2),
      'utf8'
    );
    console.log('[SAVE] Data written to conversationData.json');
  } catch (err) {
    console.error('[SAVE] Error writing conversationData.json:', err);
  }
}

exports.renderEditConversation = (req, res) => {
  let conversation = [];
  let questions = [];
  // Allow passing data via query (from view mode)
  if (req.query.conversation && req.query.questions) {
    try {
      conversation = JSON.parse(req.query.conversation);
      questions = JSON.parse(req.query.questions);
    } catch (e) {
      // fallback to backend data
      const data = loadConversationData();
      conversation = data.conversation;
      questions = data.questions;
    }
  } else {
    const data = loadConversationData();
    conversation = data.conversation;
    questions = data.questions;
  }
  res.render('conversation-edit', {
    conversation,
    questions,
    message: null,
    messageType: ''
  });
};

exports.handleEditConversation = (req, res) => {
  console.log('[EDIT] handleEditConversation called');
  console.log('[EDIT] req.body:', JSON.stringify(req.body, null, 2));
  // Parse form data safely
  const body = req.body || {};
  let conversation = body.conversation || [];
  let questions = body.questions || [];

  // Normalize data from form (handle single/multi input cases)
  if (!Array.isArray(conversation)) conversation = Object.values(conversation);
  if (!Array.isArray(questions)) questions = Object.values(questions);

  // Convert string indices to numbers for correctAnswer
  questions = questions.map(q => ({
    ...q,
    correctAnswer: typeof q.correctAnswer === 'string' ? parseInt(q.correctAnswer, 10) : q.correctAnswer,
    options: Array.isArray(q.options) ? q.options : Object.values(q.options || {})
  }));

  // Only save if data is not empty
  if (conversation.length > 0 && questions.length > 0) {
    saveConversationData(conversation, questions);
  } else {
    console.log('[EDIT] Not saving: conversation or questions empty');
  }
  res.redirect('/conversation-display');
};
