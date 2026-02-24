const path = require('path');
const fs = require('fs');

// Render image-edit.ejs with activity and questions from JSON
function renderEditImageActivity(req, res) {
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
  res.render('image-edit', { activity, questions, message: null, messageType: null });
}

// Handle POST from image-edit.ejs
function handleEditImageActivity(req, res) {
  const dataPath = path.join(__dirname, '../../data/imageActivityData.json');
  let { activity, questions } = req.body;
  // Parse questions and activity from form data
  try {
    if (typeof questions === 'string') questions = JSON.parse(questions);
    if (typeof activity === 'string') activity = JSON.parse(activity);
  } catch (e) {
    // fallback: leave as is
  }
  // Ensure correct_option is a number or null
  if (Array.isArray(questions)) {
    questions = questions.map(q => {
      let correct = q.correct_option;
      if (correct === '' || correct === undefined || correct === null || isNaN(correct)) {
        correct = null;
      } else {
        correct = Number(correct);
        if (isNaN(correct)) correct = null;
      }
      return { ...q, correct_option: correct };
    });
  }
  // Save to file
  try {
    fs.writeFileSync(dataPath, JSON.stringify({ activity, questions }, null, 2), 'utf8');
    return res.redirect('/image-display');
  } catch (err) {
    res.render('image-edit', { activity, questions, message: 'Failed to save changes.', messageType: 'error' });
  }
}

module.exports = {
  renderEditImageActivity,
  handleEditImageActivity
};
