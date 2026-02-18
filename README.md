# Lesson Craft

A web application for generating English lesson activities using AI.

## Project Structure

```
lesson-craft/
├── src/
│   ├── server.js                          # Express server entry point
│   ├── index.js                           # Legacy TTS audio generator
│   ├── lesson-generator.js                # Lesson generator with TTS
│   ├── controllers/
│   │   └── imageActivityGenerator.js      # Controller for image activity generation
│   ├── routes/
│   │   └── imageActivityGenerator.js      # Routes for image activity API
│   ├── views/
│   │   └── index.ejs                      # Main frontend view
│   ├── audio/                             # Generated audio files
│   └── images/                            # Image assets
├── storage/
│   └── temp/                              # Temporary storage for generated activities
├── public/                                # Static assets (CSS, JS, images)
├── .env                                   # Environment variables
└── package.json

```

## Environment Variables

Create a `.env` file in the root directory with:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key
TELNYX_API_KEY=your_telnyx_api_key
PORT=3000
```

## Available Scripts

- `npm start` - Start the Express server
- `npm run server` - Start the server with nodemon (auto-reload)
- `npm run dev` - Run the legacy TTS generator

## API Endpoints

### POST /api/generate-image-activity

Generate an English lesson activity from an image description.

**Request Body:**
```json
{
  "description": "Five people gathered in an office in what appears to be a work meeting..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Activity generated successfully",
  "filename": "activity_1234567890.json",
  "data": {
    "timestamp": 1234567890,
    "description": "...",
    "generatedContent": "...",
    "createdAt": "2026-02-18T10:30:00.000Z"
  }
}
```

## Usage

1. Install dependencies: `npm install`
2. Set up your `.env` file with API keys
3. Start the server: `npm start`
4. Open your browser to `http://localhost:3000`
5. Enter an image description and click "Generate Activity"

## Features

- ✅ Image-based activity generation using DeepSeek AI
- ✅ Activities stored as JSON in `/storage/temp`
- ✅ Web interface with EJS templates
- ✅ RESTful API endpoints
- ✅ Text-to-Speech conversation generation with Telnyx

## Next Steps

- Add second controller for additional features
- Implement file management for generated activities
- Add user authentication
- Create more activity types
