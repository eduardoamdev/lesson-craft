const { YoutubeTranscript } = require('youtube-transcript');
const fs = require('fs');
const fsPromises = require('fs').promises;
const os = require('os');
const path = require('path');
const YtDlpWrap = require('yt-dlp-wrap').default;

const YOUTUBE_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const YT_DLP_BINARY_PATH = path.join(os.tmpdir(), 'yt-dlp');
let ytDlpInstancePromise = null;

function extractVideoId(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  try {
    const parsedUrl = new URL(url.trim());
    const host = parsedUrl.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const shortId = parsedUrl.pathname.split('/').filter(Boolean)[0];
      if (shortId && shortId.length === 11) {
        return shortId;
      }
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const vParam = parsedUrl.searchParams.get('v');
      if (vParam && vParam.length === 11) {
        return vParam;
      }

      const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2 && ['shorts', 'embed'].includes(pathParts[0]) && pathParts[1].length === 11) {
        return pathParts[1];
      }
    }
  } catch (error) {
    return null;
  }

  return null;
}

function normalizeDeepSeekResponse(content) {
  let cleanContent = content.trim();
  cleanContent = cleanContent.replace(/^```json\s*/i, '');
  cleanContent = cleanContent.replace(/^```\s*/i, '');
  cleanContent = cleanContent.replace(/```\s*$/i, '');
  return cleanContent.trim();
}

async function fetchVideoTranscript(videoId) {
  let transcriptItems = [];

  try {
    transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
  } catch (error) {
    transcriptItems = [];
  }

  if (Array.isArray(transcriptItems) && transcriptItems.length > 0) {
    const builtTranscript = transcriptItems
      .map(item => item.text)
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (builtTranscript) {
      return builtTranscript;
    }
  }

  const fallbackTranscript = await fetchTranscriptWithCaptionTrackFallback(videoId);
  if (fallbackTranscript) {
    return fallbackTranscript;
  }

  const ytDlpTranscript = await fetchTranscriptWithYtDlp(videoId);
  if (ytDlpTranscript) {
    return ytDlpTranscript;
  }

  throw new Error('Transcript is empty or unavailable for this video');
}

async function getYtDlpInstance() {
  if (!ytDlpInstancePromise) {
    ytDlpInstancePromise = (async () => {
      if (!fs.existsSync(YT_DLP_BINARY_PATH)) {
        await YtDlpWrap.downloadFromGithub(YT_DLP_BINARY_PATH);
      }

      return new YtDlpWrap(YT_DLP_BINARY_PATH);
    })().catch(error => {
      ytDlpInstancePromise = null;
      throw error;
    });
  }

  return ytDlpInstancePromise;
}

function parseVttToText(vttContent) {
  const lines = (vttContent || '').split('\n');
  const textLines = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    if (line === 'WEBVTT' || line.startsWith('Kind:') || line.startsWith('Language:')) {
      continue;
    }

    if (line.includes('-->')) {
      continue;
    }

    if (/^\d+$/.test(line)) {
      continue;
    }

    const cleaned = decodeHtmlEntities(line.replace(/<[^>]*>/g, '')).trim();
    if (!cleaned) {
      continue;
    }

    if (textLines[textLines.length - 1] !== cleaned) {
      textLines.push(cleaned);
    }
  }

  return normalizeTranscriptText(textLines.join(' '));
}

function choosePreferredVttFile(files) {
  const vttFiles = files.filter(file => file.endsWith('.vtt'));
  if (!vttFiles.length) {
    return null;
  }

  const priorities = ['.en.vtt', '.en-orig.vtt', '.en-en.vtt'];
  for (const suffix of priorities) {
    const match = vttFiles.find(file => file.endsWith(suffix));
    if (match) {
      return match;
    }
  }

  return vttFiles[0];
}

async function fetchTranscriptWithYtDlp(videoId) {
  const ytDlp = await getYtDlpInstance();
  const tempDir = path.join(os.tmpdir(), `lesson-craft-sub-${videoId}-${Date.now()}`);

  await fsPromises.mkdir(tempDir, { recursive: true });

  try {
    const outputTemplate = path.join(tempDir, '%(id)s.%(ext)s');
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    await ytDlp.execPromise([
      videoUrl,
      '--skip-download',
      '--write-subs',
      '--write-auto-subs',
      '--sub-langs', 'en.*,en',
      '--sub-format', 'vtt',
      '-o', outputTemplate
    ]);

    const files = await fsPromises.readdir(tempDir);
    const selectedVttFile = choosePreferredVttFile(files);
    if (!selectedVttFile) {
      return '';
    }

    const vttContent = await fsPromises.readFile(path.join(tempDir, selectedVttFile), 'utf8');
    return parseVttToText(vttContent);
  } finally {
    await fsPromises.rm(tempDir, { recursive: true, force: true });
  }
}

function decodeHtmlEntities(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripXmlTags(text) {
  return decodeHtmlEntities((text || '').replace(/<[^>]*>/g, ''));
}

function normalizeTranscriptText(text) {
  return (text || '')
    .replace(/\[Music\]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractCaptionTracks(videoPageBody) {
  const splitByCaptions = videoPageBody.split('"captions":');
  if (splitByCaptions.length <= 1) {
    return [];
  }

  try {
    const captionsRaw = splitByCaptions[1].split(',"videoDetails"')[0].replace('\n', '');
    const captionsJson = JSON.parse(captionsRaw);
    const renderer = captionsJson?.playerCaptionsTracklistRenderer;
    return renderer?.captionTracks || [];
  } catch (error) {
    return [];
  }
}

function choosePreferredCaptionTrack(captionTracks) {
  if (!Array.isArray(captionTracks) || captionTracks.length === 0) {
    return null;
  }

  const preferredLanguages = ['en', 'en-US', 'en-GB'];

  for (const language of preferredLanguages) {
    const exact = captionTracks.find(track => track.languageCode === language && !track.kind);
    if (exact) {
      return exact;
    }
  }

  for (const language of preferredLanguages) {
    const autoGenerated = captionTracks.find(track => track.languageCode === language);
    if (autoGenerated) {
      return autoGenerated;
    }
  }

  return captionTracks[0];
}

function parseJson3Transcript(jsonData) {
  if (!jsonData || !Array.isArray(jsonData.events)) {
    return '';
  }

  const textParts = [];

  for (const event of jsonData.events) {
    if (!Array.isArray(event.segs)) {
      continue;
    }

    const segmentText = event.segs
      .map(segment => segment?.utf8 || '')
      .join('')
      .trim();

    if (segmentText) {
      textParts.push(segmentText);
    }
  }

  return normalizeTranscriptText(textParts.join(' '));
}

function parseXmlTranscript(xmlBody) {
  const matches = [...(xmlBody || '').matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)];
  const text = matches
    .map(match => stripXmlTags(match[1] || ''))
    .filter(Boolean)
    .join(' ');

  return normalizeTranscriptText(text);
}

async function fetchTranscriptWithCaptionTrackFallback(videoId) {
  const watchPageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      'User-Agent': YOUTUBE_USER_AGENT
    }
  });

  const watchPageBody = await watchPageResponse.text();
  const captionTracks = extractCaptionTracks(watchPageBody);
  const selectedTrack = choosePreferredCaptionTrack(captionTracks);

  if (!selectedTrack || !selectedTrack.baseUrl) {
    return '';
  }

  const json3UrlObject = new URL(selectedTrack.baseUrl);
  json3UrlObject.searchParams.set('fmt', 'json3');
  const json3Url = json3UrlObject.toString();

  const transcriptResponse = await fetch(json3Url, {
    headers: {
      'User-Agent': YOUTUBE_USER_AGENT
    }
  });

  if (!transcriptResponse.ok) {
    return '';
  }

  const transcriptBody = await transcriptResponse.text();

  try {
    const parsedJson = JSON.parse(transcriptBody);
    const fromJson3 = parseJson3Transcript(parsedJson);
    if (fromJson3) {
      return fromJson3;
    }
  } catch (error) {
    // ignore and try XML parser
  }

  return parseXmlTranscript(transcriptBody);
}

function limitTranscriptLength(transcriptText, maxChars = 12000) {
  if (!transcriptText || transcriptText.length <= maxChars) {
    return transcriptText;
  }

  return transcriptText.slice(0, maxChars);
}

async function callDeepSeekForVideoActivity(transcriptText) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const apiUrl = 'https://api.deepseek.com/v1/chat/completions';

  const promptTemplate = `We are creating an English lesson activity for B1-B2 learners.

The following text is a transcript of a YouTube video:
"""
${transcriptText}
"""

Based on this transcript, generate an activity with:
1. 5 multiple-choice fill-in-the-blank sentences based on the transcript content.
2. 1 open question that asks for reflection or summary of the video.

You MUST respond with ONLY valid JSON in this exact structure:
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
- Generate exactly 5 items in multiple_choice_sentences.
- Randomize the correct option position.
- correct_option must be a number from 0 to 3.
- Return only JSON with no markdown or extra text.`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
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
      temperature: 1.1
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`HTTP error! status: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

async function generateVideoActivity(req, res) {
  try {
    const { youtubeUrl } = req.body;

    if (!youtubeUrl) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const transcriptText = await fetchVideoTranscript(videoId);
    const summarizedTranscript = limitTranscriptLength(transcriptText);
    const generatedContentRaw = await callDeepSeekForVideoActivity(summarizedTranscript);
    const generatedContent = normalizeDeepSeekResponse(generatedContentRaw);

    const activityData = {
      timestamp: Date.now(),
      youtubeUrl,
      videoId,
      transcriptText,
      generatedContent,
      activitySource: 'video',
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Video activity generated successfully',
      data: activityData
    });
  } catch (error) {
    console.error('Error generating video activity:', error);

    const lowerMessage = (error.message || '').toLowerCase();
    const isTranscriptError = lowerMessage.includes('transcript') || lowerMessage.includes('caption');

    if (isTranscriptError) {
      return res.status(400).json({
        error: 'Could not retrieve transcript for this video. Please try another one with captions enabled.',
        details: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to generate video activity',
      details: error.message
    });
  }
}

module.exports = {
  generateVideoActivity
};
