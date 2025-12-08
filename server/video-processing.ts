import path from "path";
import fs from "fs";
import { spawn } from "child_process";

const TEMP_DIR = path.join(process.cwd(), "public", "temp");
const VIDEO_DIR = path.join(process.cwd(), "public", "videos");
const AUDIO_DIR = path.join(process.cwd(), "public", "audio");

function ensureDirectories() {
  [TEMP_DIR, VIDEO_DIR, AUDIO_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

export async function extractAudioFromVideo(
  videoPath: string,
  outputFormat: string = "mp3"
): Promise<{ success: boolean; audioPath?: string; error?: string }> {
  ensureDirectories();
  
  const filename = `extracted_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${outputFormat}`;
  const outputPath = path.join(AUDIO_DIR, filename);
  
  return new Promise((resolve) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i", videoPath,
      "-vn",
      "-acodec", outputFormat === "mp3" ? "libmp3lame" : "pcm_s16le",
      "-ar", "16000",
      "-ac", "1",
      "-y",
      outputPath
    ]);
    
    let stderr = "";
    
    ffmpeg.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    
    ffmpeg.on("close", (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        resolve({ success: true, audioPath: outputPath });
      } else {
        console.error("FFmpeg error:", stderr);
        resolve({ success: false, error: `FFmpeg failed with code ${code}` });
      }
    });
    
    ffmpeg.on("error", (err) => {
      console.error("FFmpeg spawn error:", err);
      resolve({ success: false, error: err.message });
    });
  });
}

export async function mergeAudioWithVideo(
  videoPath: string,
  audioPath: string,
  mixOriginalAudio: boolean = false,
  originalAudioVolume: number = 0.2
): Promise<{ success: boolean; outputPath?: string; outputUrl?: string; error?: string }> {
  ensureDirectories();
  
  const filename = `dubbed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp4`;
  const outputPath = path.join(VIDEO_DIR, filename);
  
  return new Promise((resolve) => {
    let args: string[];
    
    if (mixOriginalAudio) {
      args = [
        "-i", videoPath,
        "-i", audioPath,
        "-filter_complex", 
        `[0:a]volume=${originalAudioVolume}[a0];[1:a]volume=1.0[a1];[a0][a1]amix=inputs=2:duration=longest[aout]`,
        "-map", "0:v",
        "-map", "[aout]",
        "-c:v", "copy",
        "-c:a", "aac",
        "-shortest",
        "-y",
        outputPath
      ];
    } else {
      args = [
        "-i", videoPath,
        "-i", audioPath,
        "-map", "0:v",
        "-map", "1:a",
        "-c:v", "copy",
        "-c:a", "aac",
        "-shortest",
        "-y",
        outputPath
      ];
    }
    
    const ffmpeg = spawn("ffmpeg", args);
    
    let stderr = "";
    
    ffmpeg.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    
    ffmpeg.on("close", (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        resolve({ 
          success: true, 
          outputPath,
          outputUrl: `/videos/${filename}`
        });
      } else {
        console.error("FFmpeg merge error:", stderr);
        resolve({ success: false, error: `FFmpeg merge failed with code ${code}` });
      }
    });
    
    ffmpeg.on("error", (err) => {
      console.error("FFmpeg spawn error:", err);
      resolve({ success: false, error: err.message });
    });
  });
}

export async function convertAudioFormat(
  inputPath: string,
  outputFormat: string = "wav",
  sampleRate: number = 16000
): Promise<{ success: boolean; outputPath?: string; error?: string }> {
  ensureDirectories();
  
  const filename = `converted_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${outputFormat}`;
  const outputPath = path.join(TEMP_DIR, filename);
  
  return new Promise((resolve) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i", inputPath,
      "-ar", sampleRate.toString(),
      "-ac", "1",
      "-y",
      outputPath
    ]);
    
    let stderr = "";
    
    ffmpeg.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    
    ffmpeg.on("close", (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        resolve({ success: true, outputPath });
      } else {
        console.error("FFmpeg convert error:", stderr);
        resolve({ success: false, error: `FFmpeg convert failed with code ${code}` });
      }
    });
    
    ffmpeg.on("error", (err) => {
      console.error("FFmpeg spawn error:", err);
      resolve({ success: false, error: err.message });
    });
  });
}

export async function getAudioDuration(
  audioPath: string
): Promise<{ success: boolean; duration?: number; error?: string }> {
  return new Promise((resolve) => {
    const ffprobe = spawn("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      audioPath
    ]);
    
    let stdout = "";
    let stderr = "";
    
    ffprobe.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    
    ffprobe.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    
    ffprobe.on("close", (code) => {
      if (code === 0 && stdout.trim()) {
        const duration = parseFloat(stdout.trim());
        if (!isNaN(duration)) {
          resolve({ success: true, duration });
        } else {
          resolve({ success: false, error: "Could not parse duration" });
        }
      } else {
        console.error("FFprobe error:", stderr);
        resolve({ success: false, error: `FFprobe failed with code ${code}` });
      }
    });
    
    ffprobe.on("error", (err) => {
      console.error("FFprobe spawn error:", err);
      resolve({ success: false, error: err.message });
    });
  });
}

export async function downloadVideoFromUrl(
  url: string,
  platform: string
): Promise<{ success: boolean; videoPath?: string; error?: string }> {
  ensureDirectories();
  
  if (platform === "youtube") {
    return downloadYouTubeVideo(url);
  }
  
  return { success: false, error: `Platform ${platform} download not yet supported` };
}

async function downloadYouTubeVideo(
  url: string
): Promise<{ success: boolean; videoPath?: string; error?: string }> {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    return { success: false, error: "Invalid YouTube URL" };
  }
  
  const filename = `youtube_${videoId}_${Date.now()}.mp4`;
  const outputPath = path.join(TEMP_DIR, filename);
  
  return new Promise((resolve) => {
    console.log(`Downloading YouTube video with yt-dlp: ${url}`);
    
    const ytdlp = spawn("yt-dlp", [
      "-f", "best[ext=mp4]/best",
      "-o", outputPath,
      "--no-playlist",
      "--no-warnings",
      "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "--extractor-args", "youtube:player_client=android,web",
      "--no-check-certificates",
      url
    ]);
    
    let stderr = "";
    
    ytdlp.stdout.on("data", (data) => {
      console.log(`yt-dlp: ${data.toString().trim()}`);
    });
    
    ytdlp.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    
    ytdlp.on("close", (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        console.log(`YouTube video downloaded successfully: ${outputPath}`);
        resolve({ success: true, videoPath: outputPath });
      } else {
        console.error("yt-dlp error:", stderr);
        resolve({ success: false, error: `yt-dlp failed with code ${code}: ${stderr}` });
      }
    });
    
    ytdlp.on("error", (err) => {
      console.error("yt-dlp spawn error:", err);
      resolve({ success: false, error: err.message });
    });
  });
}

function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

export async function cleanupTempFiles(maxAgeMs: number = 3600000): Promise<void> {
  ensureDirectories();
  
  const now = Date.now();
  
  try {
    const files = fs.readdirSync(TEMP_DIR);
    
    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtimeMs > maxAgeMs) {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up temp file: ${file}`);
      }
    }
  } catch (error) {
    console.error("Error cleaning up temp files:", error);
  }
}
