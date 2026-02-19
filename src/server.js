require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const imageActivityGeneratorRoutes = require('./routes/imageActivityGenerator');
const pdfGeneratorRoutes = require('./routes/pdfGenerator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

app.use('/api', imageActivityGeneratorRoutes);
app.use('/api', pdfGeneratorRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
