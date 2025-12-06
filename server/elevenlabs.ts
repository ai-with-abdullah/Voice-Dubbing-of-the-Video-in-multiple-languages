import fs from "fs";
import path from "path";

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

interface Voice {
  voice_id: string;
  name: string;
  category: string;
}

interface ElevenLabsVoicesResponse {
  voices: Voice[];
}

const languageVoiceMap: Record<string, string> = {
  "en": "21m00Tcm4TlvDq8ikWAM",
  "es": "AZnzlk1XvdvUeBnXmlld",
  "fr": "EXAVITQu4vr4xnSDxMaL",
  "de": "ErXwobaYiN019PkySvjV",
  "it": "VR6AewLTigWG4xSOukaG",
  "pt": "pNInz6obpgDQGcFmaJgB",
  "pl": "Yko7PKHZNXotIFUBG7I9",
  "ru": "GBv7mTt0atIp3Br8iCZE",
  "ja": "MF3mGyEYCl7XYWbV9V6O",
  "ko": "jsCqWAovK2LkecY7zXl4",
  "zh": "XB0fDUnXU5powFXDhCwa",
  "ar": "ODq5zmih8GrVes37Dizd",
  "hi": "TX3LPaxmHKxFdv7VOQHJ",
  "tr": "g5CIjZEefAph4nQFvHAz",
  "nl": "pFZP5JQG7iQjIQuC4Bku",
  "sv": "N2lVS1w4EtoT3dr4eOWO",
  "default": "21m00Tcm4TlvDq8ikWAM",
};

function getVoiceIdForLanguage(languageCode: string): string {
  const code = languageCode.split("-")[0].toLowerCase();
  return languageVoiceMap[code] || languageVoiceMap["default"];
}

export async function generateSpeechWithElevenLabs(
  text: string,
  targetLanguage: string
): Promise<{ success: boolean; audioUrl?: string; error?: string }> {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "ElevenLabs API key not configured. Please set ELEVENLABS_API_KEY environment variable.",
    };
  }

  try {
    const voiceId = getVoiceIdForLanguage(targetLanguage);

    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", response.status, errorText);
      return {
        success: false,
        error: `ElevenLabs API error: ${response.status} - ${errorText}`,
      };
    }

    const audioBuffer = await response.arrayBuffer();

    const audioDir = path.join(process.cwd(), "public", "audio");
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    const fileName = `generated_${Date.now()}.mp3`;
    const filePath = path.join(audioDir, fileName);

    fs.writeFileSync(filePath, Buffer.from(audioBuffer));

    return {
      success: true,
      audioUrl: `/audio/${fileName}`,
    };
  } catch (error) {
    console.error("Error generating speech with ElevenLabs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getAvailableVoices(): Promise<Voice[]> {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return [];
  }

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        "xi-api-key": apiKey,
      },
    });

    if (!response.ok) {
      return [];
    }

    const data: ElevenLabsVoicesResponse = await response.json();
    return data.voices;
  } catch (error) {
    console.error("Error fetching voices:", error);
    return [];
  }
}

export async function checkApiKeyValid(): Promise<boolean> {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return false;
  }

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/user`, {
      headers: {
        "xi-api-key": apiKey,
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}
