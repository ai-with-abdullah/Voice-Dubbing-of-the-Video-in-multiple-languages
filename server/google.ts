import path from "path";
import fs from "fs";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

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
