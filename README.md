# Lesson Craft

A web application for generating English lesson activities using AI.

## Project Structure

```
lesson-craft/
├── data/
│   ├── audio/                             # Generated conversation audio files
│   └── images/                            # Image assets + images.json metadata
├── public/                                # Static assets (CSS, JS, images)
├── src/
│   ├── server.js                          # Express server entry point
│   ├── controllers/
│   │   ├── imageActivityGenerator.js      # Image-based activity generation
│   │   ├── videoActivityGenerator.js      # YouTube transcript activity generation
│   │   ├── conversationGenerator.js       # Conversation activity generation
│   │   ├── conversationAudioGenerator.js  # Conversation TTS/audio generation
│   │   ├── imageUpload.js                 # Custom image upload handler
│   │   └── pdfGenerator.js                # PDF generation/download
│   ├── routes/
│   │   ├── imageActivityGenerator.js
│   │   ├── videoActivityGenerator.js
│   │   ├── conversationGenerator.js
│   │   ├── conversationAudioGenerator.js
│   │   ├── imageUpload.js
│   │   └── pdfGenerator.js
│   ├── utils/
│   └── views/                             # EJS templates
├── test-pdf-full.js                       # PDF generation integration script
├── .env                                   # Environment variables
└── package.json

```

## Environment Variables

Create a `.env` file in the root directory with:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key
TELNYX_API_KEY=your_telnyx_api_key
PORT=3000 # optional (defaults to 3000)
JSON_LIMIT_DEFAULT=5mb # optional (default for most JSON/urlencoded routes)
JSON_LIMIT_LARGE=50mb # optional (used for upload/PDF routes)
```

## Available Scripts

- `npm start` - Start the Express server
- `npm run server` - Start the server with nodemon (auto-reload)

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
  "data": {
    "timestamp": 1234567890,
    "description": "...",
    "imageTitle": null,
    "generatedContent": "...",
    "createdAt": "2026-02-18T10:30:00.000Z"
  }
}
```

### POST /api/generate-video-activity

Generate an English lesson activity from a YouTube video transcript.

**Request Body:**
```json
{
  "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Video activity generated successfully",
  "data": {
    "timestamp": 1234567890,
    "youtubeUrl": "...",
    "videoId": "...",
    "transcriptText": "...",
    "generatedContent": "...",
    "activitySource": "video",
    "createdAt": "2026-02-20T12:00:00.000Z"
  }
}
```

### POST /api/generate-conversation

Generate a conversation-based English activity.

### POST /api/generate-conversation-audio

Generate TTS audio from conversation lines.

### GET /api/download-conversation-audio/:audioId

Download generated conversation audio.

### GET /api/check-conversation-audio/:audioId

Check if generated conversation audio is ready.

### POST /api/upload-custom-image

Upload a custom image and register it in `data/images/images.json`.

### POST /api/generate-pdf

Generate a PDF from activity content.

### POST /api/generate-conversation-pdf

Generate a PDF for conversation activities.

### GET /api/download-pdf/:pdfId

Download a generated PDF.

### GET /api/check-pdf/:pdfId

Check if a generated PDF is ready.

## Usage

1. Install dependencies: `npm install`
2. Set up your `.env` file with API keys
3. Start the server: `npm start`
4. Open your browser to `http://localhost:3000`
5. Enter an image description and click "Generate Activity"

## Features

- ✅ Image-based activity generation using DeepSeek AI
- ✅ YouTube transcript-based activity generation
- ✅ Conversation activity + audio generation (Telnyx)
- ✅ Custom image uploads stored in `/data/images`
- ✅ Web interface with EJS templates
- ✅ PDF generation and download endpoints

## Next Steps

- Add second controller for additional features
- Implement file management for generated activities
- Add user authentication
- Create more activity types
