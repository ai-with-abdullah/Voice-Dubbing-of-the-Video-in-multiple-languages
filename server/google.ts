import path from "path";
import fs from "fs";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export async function speechToText(
  audioPath: string,
  languageCode: string = "en-US"
): Promise<{ success: boolean; transcript?: string; confidence?: number; error?: string }> {
  if (!GOOGLE_API_KEY) {
    return { success: false, error: "Google API key not configured" };
  }

  try {
    if (!fs.existsSync(audioPath)) {
      return { success: false, error: "Audio file not found" };
    }

    const audioBytes = fs.readFileSync(audioPath);
    const audioContent = audioBytes.toString("base64");

    const url = `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`;

    const encoding = getAudioEncoding(audioPath);
    const sampleRateHertz = 16000;

    const body = {
      config: {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: normalizeLanguageCode(languageCode),
        enableAutomaticPunctuation: true,
        model: "default",
      },
      audio: {
        content: audioContent,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Speech-to-Text API error:", error);
      return { success: false, error: `Speech-to-Text failed: ${response.status}` };
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return { success: false, error: "No speech detected in audio" };
    }

    const transcript = data.results
      .map((result: any) => result.alternatives?.[0]?.transcript || "")
      .join(" ")
      .trim();

    const confidence = data.results[0]?.alternatives?.[0]?.confidence || 0;

    if (!transcript) {
      return { success: false, error: "No transcript generated" };
    }

    return { success: true, transcript, confidence };
  } catch (error) {
    console.error("Speech-to-Text error:", error);
    return { success: false, error: "Speech-to-Text request failed" };
  }
}

export async function speechToTextLongAudio(
  audioPath: string,
  languageCode: string = "en-US"
): Promise<{ success: boolean; transcript?: string; error?: string }> {
  if (!GOOGLE_API_KEY) {
    return { success: false, error: "Google API key not configured" };
  }

  try {
    if (!fs.existsSync(audioPath)) {
      return { success: false, error: "Audio file not found" };
    }

    const chunkDurationMs = 55000;
    const chunks = await splitAudioIntoChunks(audioPath, chunkDurationMs);
    
    if (chunks.length === 0) {
      return speechToText(audioPath, languageCode);
    }

    console.log(`Processing ${chunks.length} audio chunks for transcription...`);
    let fullTranscript = "";
    
    for (let i = 0; i < chunks.length; i++) {
      const chunkPath = chunks[i];
      console.log(`Transcribing chunk ${i + 1}/${chunks.length}...`);
      
      const result = await speechToText(chunkPath, languageCode);
      if (result.success && result.transcript) {
        fullTranscript += " " + result.transcript;
      }
      
      try {
        fs.unlinkSync(chunkPath);
      } catch (e) {}
    }

    if (!fullTranscript.trim()) {
      return { success: false, error: "No speech detected in audio" };
    }

    return { success: true, transcript: fullTranscript.trim() };
  } catch (error) {
    console.error("Long audio transcription error:", error);
    return { success: false, error: "Long audio transcription failed" };
  }
}

async function splitAudioIntoChunks(audioPath: string, chunkDurationMs: number): Promise<string[]> {
  const { spawn } = await import("child_process");
  
  return new Promise((resolve) => {
    const ffprobe = spawn("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      audioPath
    ]);
    
    let stdout = "";
    
    ffprobe.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    
    ffprobe.on("close", async (code) => {
      if (code !== 0) {
        resolve([]);
        return;
      }
      
      const duration = parseFloat(stdout.trim()) * 1000;
      
      if (duration <= chunkDurationMs) {
        resolve([]);
        return;
      }
      
      const numChunks = Math.ceil(duration / chunkDurationMs);
      const chunkPaths: string[] = [];
      const tempDir = path.dirname(audioPath);
      
      for (let i = 0; i < numChunks; i++) {
        const startTime = (i * chunkDurationMs) / 1000;
        const chunkPath = path.join(tempDir, `chunk_${i}_${Date.now()}.wav`);
        
        await new Promise<void>((resolveChunk) => {
          const ffmpeg = spawn("ffmpeg", [
            "-i", audioPath,
            "-ss", startTime.toString(),
            "-t", (chunkDurationMs / 1000).toString(),
            "-ar", "16000",
            "-ac", "1",
            "-y",
            chunkPath
          ]);
          
          ffmpeg.on("close", () => {
            const fs = require("fs");
            if (fs.existsSync(chunkPath)) {
              chunkPaths.push(chunkPath);
            }
            resolveChunk();
          });
          
          ffmpeg.on("error", () => resolveChunk());
        });
      }
      
      resolve(chunkPaths);
    });
    
    ffprobe.on("error", () => resolve([]));
  });
}

function getAudioEncoding(audioPath: string): string {
  const ext = path.extname(audioPath).toLowerCase();
  
  const encodingMap: Record<string, string> = {
    ".wav": "LINEAR16",
    ".flac": "FLAC",
    ".mp3": "MP3",
    ".ogg": "OGG_OPUS",
    ".webm": "WEBM_OPUS",
    ".amr": "AMR",
  };
  
  return encodingMap[ext] || "LINEAR16";
}

function normalizeLanguageCode(code: string): string {
  const languageMap: Record<string, string> = {
    "en": "en-US",
    "es": "es-ES",
    "fr": "fr-FR",
    "de": "de-DE",
    "it": "it-IT",
    "pt": "pt-BR",
    "ja": "ja-JP",
    "ko": "ko-KR",
    "zh": "zh-CN",
    "ar": "ar-SA",
    "hi": "hi-IN",
    "ru": "ru-RU",
    "nl": "nl-NL",
    "pl": "pl-PL",
    "tr": "tr-TR",
    "vi": "vi-VN",
    "th": "th-TH",
    "id": "id-ID",
  };
  
  if (code.includes("-")) {
    return code;
  }
  
  return languageMap[code.toLowerCase()] || `${code}-${code.toUpperCase()}`;
}

export async function getYouTubeCaptions(videoId: string): Promise<{ success: boolean; captions?: string; language?: string; error?: string }> {
  try {
    const transcriptResult = await fetchYouTubeTranscript(videoId);
    if (transcriptResult.success) {
      return transcriptResult;
    }
    return { success: false, error: transcriptResult.error || "Captions not available - YouTube requires authentication for caption access" };
  } catch (error) {
    console.error("Error fetching YouTube captions:", error);
    return { success: false, error: "Failed to fetch captions - YouTube restricts server-side access" };
  }
}

async function fetchYouTubeTranscript(videoId: string, lang: string = "en"): Promise<{ success: boolean; captions?: string; language?: string; error?: string }> {
  try {
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await fetch(watchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    if (!response.ok) {
      return { success: false, error: "Failed to fetch video page" };
    }

    const html = await response.text();
    
    const captionUrlMatch = html.match(/"captionTracks":\s*\[([^\]]+)\]/);
    if (!captionUrlMatch) {
      return { success: false, error: "No captions available for this video" };
    }

    try {
      const captionData = JSON.parse(`[${captionUrlMatch[1]}]`);
      
      let captionTrack = captionData.find((track: any) => 
        track.languageCode === lang || track.vssId?.includes(lang)
      ) || captionData[0];

      if (!captionTrack || !captionTrack.baseUrl) {
        return { success: false, error: "No valid caption track found" };
      }

      let captionUrl = captionTrack.baseUrl;
      captionUrl = captionUrl.split('\\u0026').join('&');
      captionUrl = captionUrl.split('&amp;').join('&');
      captionUrl = captionUrl.split('\u0026').join('&');
      const captionResponse = await fetch(captionUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/xml, application/xml, */*',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });
      if (!captionResponse.ok) {
        return { success: false, error: "Failed to download captions" };
      }

      const captionXml = await captionResponse.text();
      
      let captions = "";
      
      const textMatches = captionXml.match(/<text[^>]*>[^<]+<\/text>/g) || [];
      if (textMatches.length > 0) {
        captions = textMatches
          .map(match => {
            const textContent = match.replace(/<[^>]+>/g, '').trim();
            return decodeHtmlEntities(textContent);
          })
          .filter(text => text.length > 0)
          .join(' ');
      }
      
      if (!captions || captions.length < 10) {
        const bodyMatch = captionXml.match(/<body[^>]*>([\s\S]*?)<\/body>/);
        if (bodyMatch) {
          const innerText = bodyMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          captions = decodeHtmlEntities(innerText);
        }
      }
      
      if (!captions || captions.length < 10) {
        const allText = captionXml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (allText.length > 10) {
          captions = decodeHtmlEntities(allText);
        }
      }

      if (captions && captions.length > 10) {
        console.log(`Extracted ${captions.length} characters of captions`);
        return { 
          success: true, 
          captions, 
          language: captionTrack.languageCode || lang 
        };
      }

      return { success: false, error: "No caption text found in response" };
    } catch (parseError) {
      console.error("Error parsing caption data:", parseError);
      return { success: false, error: "Failed to parse caption data" };
    }
  } catch (error) {
    console.error("Error fetching YouTube transcript:", error);
    return { success: false, error: "Failed to fetch transcript" };
  }
}

function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#32;': ' ',
    '&nbsp;': ' ',
  };
  
  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  }
  
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
  
  return decoded;
}

export function isGoogleConfigured(): boolean {
  return !!GOOGLE_API_KEY;
}

export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<{ success: boolean; translatedText?: string; error?: string }> {
  if (!GOOGLE_API_KEY) {
    return { success: false, error: "Google API key not configured" };
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`;
    
    const body: any = {
      q: text,
      target: targetLanguage,
      format: "text",
    };
    
    if (sourceLanguage) {
      body.source = sourceLanguage;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Translation API error:", error);
      return { success: false, error: `Translation failed: ${response.status}` };
    }

    const data = await response.json();
    const translatedText = data.data?.translations?.[0]?.translatedText;
    
    if (!translatedText) {
      return { success: false, error: "No translation returned" };
    }

    return { success: true, translatedText };
  } catch (error) {
    console.error("Translation error:", error);
    return { success: false, error: "Translation request failed" };
  }
}

export async function textToSpeech(
  text: string,
  languageCode: string
): Promise<{ success: boolean; audioContent?: string; error?: string }> {
  if (!GOOGLE_API_KEY) {
    return { success: false, error: "Google API key not configured" };
  }

  try {
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`;
    
    const voiceName = getVoiceName(languageCode);
    
    const body = {
      input: { text },
      voice: {
        languageCode: languageCode,
        name: voiceName,
        ssmlGender: "NEUTRAL",
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: 1.0,
        pitch: 0,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("TTS API error:", error);
      return { success: false, error: `Text-to-Speech failed: ${response.status}` };
    }

    const data = await response.json();
    const audioContent = data.audioContent;
    
    if (!audioContent) {
      return { success: false, error: "No audio content returned" };
    }

    return { success: true, audioContent };
  } catch (error) {
    console.error("TTS error:", error);
    return { success: false, error: "Text-to-Speech request failed" };
  }
}

export async function generateSpeechWithGoogle(
  text: string,
  targetLanguage: string
): Promise<{ success: boolean; audioUrl?: string; error?: string }> {
  const result = await textToSpeech(text, targetLanguage);
  
  if (!result.success || !result.audioContent) {
    return { success: false, error: result.error };
  }

  try {
    const audioDir = path.join(process.cwd(), "public", "audio");
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    const filename = `google_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp3`;
    const filepath = path.join(audioDir, filename);
    
    const audioBuffer = Buffer.from(result.audioContent, "base64");
    fs.writeFileSync(filepath, audioBuffer);

    return { success: true, audioUrl: `/audio/${filename}` };
  } catch (error) {
    console.error("Error saving audio file:", error);
    return { success: false, error: "Failed to save audio file" };
  }
}

function getVoiceName(languageCode: string): string {
  const voiceMap: Record<string, string> = {
    "en": "en-US-Standard-C",
    "en-US": "en-US-Standard-C",
    "en-GB": "en-GB-Standard-A",
    "es": "es-ES-Standard-A",
    "es-ES": "es-ES-Standard-A",
    "es-MX": "es-US-Standard-A",
    "fr": "fr-FR-Standard-A",
    "fr-FR": "fr-FR-Standard-A",
    "de": "de-DE-Standard-A",
    "de-DE": "de-DE-Standard-A",
    "it": "it-IT-Standard-A",
    "pt": "pt-BR-Standard-A",
    "pt-BR": "pt-BR-Standard-A",
    "pt-PT": "pt-PT-Standard-A",
    "ja": "ja-JP-Standard-A",
    "ja-JP": "ja-JP-Standard-A",
    "ko": "ko-KR-Standard-A",
    "ko-KR": "ko-KR-Standard-A",
    "zh-CN": "cmn-CN-Standard-A",
    "zh-TW": "cmn-TW-Standard-A",
    "ar": "ar-XA-Standard-A",
    "hi": "hi-IN-Standard-A",
    "hi-IN": "hi-IN-Standard-A",
    "ru": "ru-RU-Standard-A",
    "ru-RU": "ru-RU-Standard-A",
    "nl": "nl-NL-Standard-A",
    "nl-NL": "nl-NL-Standard-A",
    "pl": "pl-PL-Standard-A",
    "pl-PL": "pl-PL-Standard-A",
    "tr": "tr-TR-Standard-A",
    "tr-TR": "tr-TR-Standard-A",
    "vi": "vi-VN-Standard-A",
    "vi-VN": "vi-VN-Standard-A",
    "th": "th-TH-Standard-A",
    "th-TH": "th-TH-Standard-A",
    "id": "id-ID-Standard-A",
    "id-ID": "id-ID-Standard-A",
    "sv": "sv-SE-Standard-A",
    "sv-SE": "sv-SE-Standard-A",
    "da": "da-DK-Standard-A",
    "da-DK": "da-DK-Standard-A",
    "fi": "fi-FI-Standard-A",
    "fi-FI": "fi-FI-Standard-A",
    "nb": "nb-NO-Standard-A",
    "nb-NO": "nb-NO-Standard-A",
    "uk": "uk-UA-Standard-A",
    "uk-UA": "uk-UA-Standard-A",
    "el": "el-GR-Standard-A",
    "el-GR": "el-GR-Standard-A",
    "cs": "cs-CZ-Standard-A",
    "cs-CZ": "cs-CZ-Standard-A",
    "ro": "ro-RO-Standard-A",
    "ro-RO": "ro-RO-Standard-A",
    "hu": "hu-HU-Standard-A",
    "hu-HU": "hu-HU-Standard-A",
    "sk": "sk-SK-Standard-A",
    "sk-SK": "sk-SK-Standard-A",
    "bg": "bg-BG-Standard-A",
    "bg-BG": "bg-BG-Standard-A",
    "hr": "sr-RS-Standard-A",
    "sr": "sr-RS-Standard-A",
    "sr-RS": "sr-RS-Standard-A",
    "ca": "ca-ES-Standard-A",
    "ca-ES": "ca-ES-Standard-A",
    "fil": "fil-PH-Standard-A",
    "fil-PH": "fil-PH-Standard-A",
    "he": "he-IL-Standard-A",
    "he-IL": "he-IL-Standard-A",
    "lv": "lv-LV-Standard-A",
    "lv-LV": "lv-LV-Standard-A",
    "lt": "lt-LT-Standard-A",
    "lt-LT": "lt-LT-Standard-A",
    "ms": "ms-MY-Standard-A",
    "ms-MY": "ms-MY-Standard-A",
    "bn": "bn-IN-Standard-A",
    "bn-IN": "bn-IN-Standard-A",
    "ta": "ta-IN-Standard-A",
    "ta-IN": "ta-IN-Standard-A",
    "te": "te-IN-Standard-A",
    "te-IN": "te-IN-Standard-A",
    "ml": "ml-IN-Standard-A",
    "ml-IN": "ml-IN-Standard-A",
    "kn": "kn-IN-Standard-A",
    "kn-IN": "kn-IN-Standard-A",
    "mr": "mr-IN-Standard-A",
    "mr-IN": "mr-IN-Standard-A",
    "gu": "gu-IN-Standard-A",
    "gu-IN": "gu-IN-Standard-A",
    "pa": "pa-IN-Standard-A",
    "pa-IN": "pa-IN-Standard-A",
    "af": "af-ZA-Standard-A",
    "af-ZA": "af-ZA-Standard-A",
    "is": "is-IS-Standard-A",
    "is-IS": "is-IS-Standard-A",
    "eu": "eu-ES-Standard-A",
    "eu-ES": "eu-ES-Standard-A",
    "gl": "gl-ES-Standard-A",
    "gl-ES": "gl-ES-Standard-A",
  };

  const normalizedCode = languageCode.toLowerCase();
  return voiceMap[normalizedCode] || voiceMap[normalizedCode.split("-")[0]] || "en-US-Standard-C";
}

export async function detectLanguage(
  text: string
): Promise<{ success: boolean; language?: string; confidence?: number; error?: string }> {
  if (!GOOGLE_API_KEY) {
    return { success: false, error: "Google API key not configured" };
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2/detect?key=${GOOGLE_API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: text }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Language detection error:", error);
      return { success: false, error: `Language detection failed: ${response.status}` };
    }

    const data = await response.json();
    const detection = data.data?.detections?.[0]?.[0];
    
    if (!detection) {
      return { success: false, error: "No language detected" };
    }

    return { 
      success: true, 
      language: detection.language,
      confidence: detection.confidence,
    };
  } catch (error) {
    console.error("Language detection error:", error);
    return { success: false, error: "Language detection request failed" };
  }
}
