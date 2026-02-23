require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const imageActivityGeneratorRoutes = require('./routes/imageActivityGenerator');
const pdfGeneratorRoutes = require('./routes/pdfGenerator');
const imageUploadRoutes = require('./routes/imageUpload');
const conversationGeneratorRoutes = require('./routes/conversationGenerator');
const conversationAudioGeneratorRoutes = require('./routes/conversationAudioGenerator');
const conversationEditRoutes = require('./routes/conversationEdit');
const videoActivityGeneratorRoutes = require('./routes/videoActivityGenerator');


const app = express();
const JSON_LIMIT_DEFAULT = process.env.JSON_LIMIT_DEFAULT || '5mb';
const JSON_LIMIT_LARGE = process.env.JSON_LIMIT_LARGE || '50mb';
app.use(bodyParser.json({ limit: JSON_LIMIT_DEFAULT }));
app.use(bodyParser.urlencoded({ extended: true, limit: JSON_LIMIT_DEFAULT }));
app.use('/', conversationEditRoutes);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use('/data', express.static(path.join(__dirname, '../data')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  res.render('home', { title: 'Lesson Craft' });
});

app.get('/image-activity', (req, res) => {
  res.render('image-selection', { title: 'Select Image - Lesson Craft' });
});

app.get('/activity-display', (req, res) => {
  res.render('activity-display', { title: 'Activity - Lesson Craft' });
});

app.get('/image-display', (req, res) => {
  res.render('image-display', { title: 'Image Activity - Lesson Craft' });
});

app.get('/video-display', (req, res) => {
  res.render('video-display', { title: 'Video Activity - Lesson Craft' });
});

app.get('/conversation-activity', (req, res) => {
  res.render('conversation-input', { title: 'Conversation Activity - Lesson Craft' });
});

const fs = require('fs');
app.get('/conversation-display', (req, res) => {
  // Try to get conversation data from sessionStorage (client-side) is not possible on server,
  // so as a workaround, check if a temp file exists (or use another backend mechanism).
  // For now, try to read from a temp file if it exists (simulate persistence for demo).
  let conversation = null;
  let questions = null;
  try {
    if (fs.existsSync(path.join(__dirname, '../data/conversationData.json'))) {
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/conversationData.json'), 'utf8'));
      conversation = data.conversation;
      questions = data.questions;
    }
  } catch (e) {
    conversation = null;
    questions = null;
  }
  res.render('conversation-display', {
    title: 'Conversation - Lesson Craft',
    conversation,
    questions
  });
});

app.get('/video-activity', (req, res) => {
  res.render('video-activity-input', { title: 'Video Activity - Lesson Craft' });
});

app.use(
  '/api',
  bodyParser.json({ limit: JSON_LIMIT_LARGE }),
  bodyParser.urlencoded({ extended: true, limit: JSON_LIMIT_LARGE }),
  imageUploadRoutes
);
app.use(
  '/api',
  bodyParser.json({ limit: JSON_LIMIT_LARGE }),
  bodyParser.urlencoded({ extended: true, limit: JSON_LIMIT_LARGE }),
  pdfGeneratorRoutes
);

app.use(bodyParser.json({ limit: JSON_LIMIT_DEFAULT }));
app.use(bodyParser.urlencoded({ extended: true, limit: JSON_LIMIT_DEFAULT }));

app.use('/api', imageActivityGeneratorRoutes);
app.use('/api', conversationGeneratorRoutes);
app.use('/api', conversationAudioGeneratorRoutes);
app.use('/api', videoActivityGeneratorRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
