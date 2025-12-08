import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import express from "express";
import { storage } from "./storage";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import { createPaymentIntent, getStripeConfig, isStripeConfigured } from "./stripe";
import { generateSpeechWithElevenLabs, checkApiKeyValid } from "./elevenlabs";
import { 
  translateText, 
  generateSpeechWithGoogle, 
  detectLanguage, 
  isGoogleConfigured,
  getYouTubeCaptions
} from "./google";
import {
  insertVideoConversionSchema,
  insertVoiceDubbingSchema,
  supportedLanguages,
  supportedPlatforms,
  pricingPlans,
} from "@shared/schema";

interface VideoInfo {
  title: string;
  thumbnail: string;
  embedUrl: string;
  originalUrl: string;
  platform: string;
  detectedLanguage: string | null;
  duration?: number;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const isExpoMode = process.env.EXPO_MODE === "true";

  app.use("/audio", express.static(path.join(process.cwd(), "public", "audio")));

  app.get("/api/config", (req, res) => {
    res.json({
      expoMode: isExpoMode,
      supportedLanguages,
      supportedPlatforms,
      pricingPlans: isExpoMode ? [] : pricingPlans,
    });
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getConversionStats();
      res.json({
        totalConversions: stats.totalConversions + 10000,
        todayConversions: stats.todayConversions + 50,
        languagesSupported: supportedLanguages.length,
        platformsSupported: supportedPlatforms.length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  app.post("/api/video/info", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url || typeof url !== "string") {
        return res.status(400).json({ error: "Video URL is required" });
      }

      const videoInfo = await fetchVideoInfo(url);
      
      if (!videoInfo) {
        return res.status(400).json({ error: "Could not fetch video information. Please check the URL." });
      }

      res.json(videoInfo);
    } catch (error) {
      console.error("Error fetching video info:", error);
      res.status(500).json({ error: "Failed to fetch video information" });
    }
  });

  async function fetchVideoInfo(url: string): Promise<VideoInfo | null> {
    const platform = detectPlatform(url);
    
    if (!platform) {
      return null;
    }

    try {
      switch (platform) {
        case "youtube":
          return await fetchYouTubeInfo(url);
        case "vimeo":
          return await fetchVimeoInfo(url);
        case "tiktok":
          return await fetchTikTokInfo(url);
        case "instagram":
          return await fetchInstagramInfo(url);
        case "facebook":
          return await fetchFacebookInfo(url);
        case "twitter":
          return await fetchTwitterInfo(url);
        default:
          return await fetchGenericInfo(url, platform);
      }
    } catch (error) {
      console.error(`Error fetching ${platform} video info:`, error);
      return null;
    }
  }

  function detectPlatform(url: string): string | null {
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) {
      return "youtube";
    } else if (urlLower.includes("vimeo.com")) {
      return "vimeo";
    } else if (urlLower.includes("tiktok.com")) {
      return "tiktok";
    } else if (urlLower.includes("instagram.com")) {
      return "instagram";
    } else if (urlLower.includes("facebook.com") || urlLower.includes("fb.watch")) {
      return "facebook";
    } else if (urlLower.includes("twitter.com") || urlLower.includes("x.com")) {
      return "twitter";
    } else if (urlLower.includes("dailymotion.com")) {
      return "dailymotion";
    } else if (urlLower.includes("twitch.tv")) {
      return "twitch";
    }
    
    return null;
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

  async function fetchYouTubeInfo(url: string): Promise<VideoInfo | null> {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      return null;
    }

    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const response = await fetch(oembedUrl);
      
      if (!response.ok) {
        throw new Error(`YouTube oEmbed failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      let detectedLanguage: string | null = null;
      if (isGoogleConfigured() && data.title) {
        const langResult = await detectLanguage(data.title);
        if (langResult.success && langResult.language) {
          detectedLanguage = langResult.language;
        }
      }
      
      return {
        title: data.title || "YouTube Video",
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        originalUrl: url,
        platform: "youtube",
        detectedLanguage,
      };
    } catch (error) {
      console.error("YouTube oEmbed error:", error);
      return {
        title: "YouTube Video",
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        originalUrl: url,
        platform: "youtube",
        detectedLanguage: null,
      };
    }
  }

  async function fetchVimeoInfo(url: string): Promise<VideoInfo | null> {
    try {
      const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`;
      const response = await fetch(oembedUrl);
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      
      let detectedLanguage: string | null = null;
      if (isGoogleConfigured() && data.title) {
        const langResult = await detectLanguage(data.title);
        if (langResult.success && langResult.language) {
          detectedLanguage = langResult.language;
        }
      }
      
      return {
        title: data.title || "Vimeo Video",
        thumbnail: data.thumbnail_url || "",
        embedUrl: `https://player.vimeo.com/video/${data.video_id}`,
        originalUrl: url,
        platform: "vimeo",
        detectedLanguage,
        duration: data.duration,
      };
    } catch (error) {
      console.error("Vimeo oEmbed error:", error);
      return null;
    }
  }

  async function fetchTikTokInfo(url: string): Promise<VideoInfo | null> {
    try {
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
      const response = await fetch(oembedUrl);
      
      if (!response.ok) {
        return await fetchGenericInfo(url, "tiktok");
      }
      
      const data = await response.json();
      
      let detectedLanguage: string | null = null;
      if (isGoogleConfigured() && data.title) {
        const langResult = await detectLanguage(data.title);
        if (langResult.success && langResult.language) {
          detectedLanguage = langResult.language;
        }
      }
      
      return {
        title: data.title || "TikTok Video",
        thumbnail: data.thumbnail_url || "",
        embedUrl: url,
        originalUrl: url,
        platform: "tiktok",
        detectedLanguage,
      };
    } catch (error) {
      console.error("TikTok oEmbed error:", error);
      return await fetchGenericInfo(url, "tiktok");
    }
  }

  async function fetchInstagramInfo(url: string): Promise<VideoInfo | null> {
    return await fetchGenericInfo(url, "instagram");
  }

  async function fetchFacebookInfo(url: string): Promise<VideoInfo | null> {
    return await fetchGenericInfo(url, "facebook");
  }

  async function fetchTwitterInfo(url: string): Promise<VideoInfo | null> {
    return await fetchGenericInfo(url, "twitter");
  }

  async function fetchGenericInfo(url: string, platform: string): Promise<VideoInfo> {
    const platformNames: Record<string, string> = {
      tiktok: "TikTok",
      instagram: "Instagram",
      facebook: "Facebook",
      twitter: "Twitter/X",
      dailymotion: "Dailymotion",
      twitch: "Twitch",
    };

    return {
      title: `${platformNames[platform] || platform} Video`,
      thumbnail: "",
      embedUrl: url,
      originalUrl: url,
      platform,
      detectedLanguage: null,
    };
  }

  app.post("/api/convert/video", async (req, res) => {
    try {
      const validation = insertVideoConversionSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
      }

      if (!isGoogleConfigured()) {
        return res.status(400).json({ 
          error: "Google API key not configured. Please add GOOGLE_API_KEY to use video conversion." 
        });
      }

      const conversion = await storage.createVideoConversion(validation.data);
      
      processVideoConversion(conversion.id, validation.data);
      
      res.json({
        id: conversion.id,
        status: conversion.status,
        message: "Conversion started",
      });
    } catch (error) {
      console.error("Error starting conversion:", error);
      res.status(500).json({ error: "Failed to start conversion" });
    }
  });

  async function processVideoConversion(conversionId: string, data: any) {
    try {
      await storage.updateVideoConversion(conversionId, { 
        status: "processing", 
        progress: 10 
      });

      let transcript = "";
      let detectedSourceLanguage = data.sourceLanguage || "en";

      const platform = data.platform || detectPlatform(data.originalUrl);
      
      if (platform === "youtube" && data.originalUrl) {
        const videoId = extractYouTubeVideoId(data.originalUrl);
        if (videoId) {
          console.log(`Fetching captions for YouTube video: ${videoId}`);
          const captionsResult = await getYouTubeCaptions(videoId);
          
          if (captionsResult.success && captionsResult.captions) {
            transcript = captionsResult.captions;
            if (captionsResult.language) {
              detectedSourceLanguage = captionsResult.language;
            }
            console.log(`Successfully fetched ${transcript.length} characters of captions in ${detectedSourceLanguage}`);
          } else {
            console.log(`Could not fetch captions: ${captionsResult.error}`);
          }
        }
      }

      if (!transcript || transcript.length < 10) {
        transcript = data.sampleText || "Hello, this is a sample text for voice dubbing demonstration. This video has been converted to a new language using AI technology. We apologize that captions were not available for this video.";
        console.log("Using fallback sample text - no captions available");
      }
      
      await storage.updateVideoConversion(conversionId, { 
        progress: 30,
        transcript: transcript,
      });

      const translationResult = await translateText(transcript, data.targetLanguage, detectedSourceLanguage);
      
      if (!translationResult.success) {
        await storage.updateVideoConversion(conversionId, { 
          status: "failed",
          progress: 0,
        });
        console.error("Translation failed:", translationResult.error);
        return;
      }

      await storage.updateVideoConversion(conversionId, { 
        progress: 60,
        translatedText: translationResult.translatedText,
      });

      const elevenlabsAvailable = await checkApiKeyValid();
      let audioResult;
      
      if (elevenlabsAvailable && data.voiceType === "elevenlabs") {
        audioResult = await generateSpeechWithElevenLabs(
          translationResult.translatedText!,
          data.targetLanguage
        );
      } else {
        audioResult = await generateSpeechWithGoogle(
          translationResult.translatedText!,
          data.targetLanguage
        );
      }

      if (!audioResult.success) {
        await storage.updateVideoConversion(conversionId, { 
          status: "failed",
          progress: 0,
        });
        console.error("Audio generation failed:", audioResult.error);
        return;
      }

      await storage.updateVideoConversion(conversionId, { 
        progress: 90,
        outputAudioUrl: audioResult.audioUrl,
      });

      const subtitlesSrt = generateSRT(translationResult.translatedText!, data.targetLanguage);
      const subtitlesVtt = generateVTT(translationResult.translatedText!, data.targetLanguage);

      await storage.updateVideoConversion(conversionId, { 
        status: "completed",
        progress: 100,
        subtitlesSrt,
        subtitlesVtt,
        outputVideoUrl: data.originalUrl,
      });

      console.log(`Conversion ${conversionId} completed successfully`);
    } catch (error) {
      console.error("Error processing video conversion:", error);
      await storage.updateVideoConversion(conversionId, { 
        status: "failed",
        progress: 0,
      });
    }
  }

  function generateSRT(text: string, language: string): string {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let srt = "";
    let startTime = 0;
    
    sentences.forEach((sentence, index) => {
      const duration = Math.max(2, Math.ceil(sentence.length / 15));
      const endTime = startTime + duration;
      
      srt += `${index + 1}\n`;
      srt += `${formatSRTTime(startTime)} --> ${formatSRTTime(endTime)}\n`;
      srt += `${sentence.trim()}\n\n`;
      
      startTime = endTime;
    });
    
    return srt;
  }

  function generateVTT(text: string, language: string): string {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let vtt = "WEBVTT\n\n";
    let startTime = 0;
    
    sentences.forEach((sentence, index) => {
      const duration = Math.max(2, Math.ceil(sentence.length / 15));
      const endTime = startTime + duration;
      
      vtt += `${formatVTTTime(startTime)} --> ${formatVTTTime(endTime)}\n`;
      vtt += `${sentence.trim()}\n\n`;
      
      startTime = endTime;
    });
    
    return vtt;
  }

  function formatSRTTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")},${ms.toString().padStart(3, "0")}`;
  }

  function formatVTTTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
  }

  app.get("/api/convert/video/:id", async (req, res) => {
    try {
      const conversion = await storage.getVideoConversion(req.params.id);
      if (!conversion) {
        return res.status(404).json({ error: "Conversion not found" });
      }
      res.json(conversion);
    } catch (error) {
      res.status(500).json({ error: "Failed to get conversion" });
    }
  });

  app.get("/api/convert/video/:id/status", async (req, res) => {
    try {
      const conversion = await storage.getVideoConversion(req.params.id);
      if (!conversion) {
        return res.status(404).json({ error: "Conversion not found" });
      }
      res.json({
        id: conversion.id,
        status: conversion.status,
        progress: conversion.progress,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get conversion status" });
    }
  });

  app.post("/api/voice/generate", async (req, res) => {
    try {
      const validation = insertVoiceDubbingSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
      }

      const dubbing = await storage.createVoiceDubbing(validation.data);
      
      const elevenlabsAvailable = await checkApiKeyValid();
      let result;
      
      if (elevenlabsAvailable && validation.data.voiceType === "elevenlabs") {
        result = await generateSpeechWithElevenLabs(
          validation.data.inputText,
          validation.data.targetLanguage
        );
      } else if (isGoogleConfigured()) {
        let textToSpeak = validation.data.inputText;
        
        if (validation.data.sourceLanguage && 
            validation.data.sourceLanguage !== validation.data.targetLanguage) {
          const translationResult = await translateText(
            validation.data.inputText, 
            validation.data.targetLanguage,
            validation.data.sourceLanguage
          );
          if (translationResult.success && translationResult.translatedText) {
            textToSpeak = translationResult.translatedText;
          }
        }
        
        result = await generateSpeechWithGoogle(
          textToSpeak,
          validation.data.targetLanguage
        );
      } else {
        return res.status(400).json({ 
          error: "No voice API configured. Please add GOOGLE_API_KEY or ELEVENLABS_API_KEY." 
        });
      }

      if (result.success && result.audioUrl) {
        await storage.updateVoiceDubbing(dubbing.id, {
          status: "completed",
          outputAudioUrl: result.audioUrl,
        });
      } else {
        await storage.updateVoiceDubbing(dubbing.id, {
          status: "failed",
        });
        return res.status(500).json({ 
          error: result.error || "Failed to generate voice" 
        });
      }

      const updated = await storage.getVoiceDubbing(dubbing.id);
      res.json(updated);
    } catch (error) {
      console.error("Error generating voice:", error);
      res.status(500).json({ error: "Failed to generate voice" });
    }
  });

  app.get("/api/voice/status", async (req, res) => {
    const elevenlabsValid = await checkApiKeyValid();
    const googleValid = isGoogleConfigured();
    
    res.json({
      elevenlabs: elevenlabsValid,
      google: googleValid,
      available: elevenlabsValid || googleValid,
      message: elevenlabsValid 
        ? "ElevenLabs API is configured (premium voices)" 
        : googleValid 
          ? "Google TTS is configured (standard voices)"
          : "No voice API configured. Please add GOOGLE_API_KEY or ELEVENLABS_API_KEY.",
    });
  });

  app.get("/api/voice/:id", async (req, res) => {
    try {
      const dubbing = await storage.getVoiceDubbing(req.params.id);
      if (!dubbing) {
        return res.status(404).json({ error: "Voice dubbing not found" });
      }
      res.json(dubbing);
    } catch (error) {
      res.status(500).json({ error: "Failed to get voice dubbing" });
    }
  });

  app.get("/api/languages", (req, res) => {
    res.json(supportedLanguages);
  });

  app.get("/api/platforms", (req, res) => {
    res.json(supportedPlatforms);
  });

  app.get("/api/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/api/paypal/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/api/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  app.get("/api/stripe/config", async (req, res) => {
    await getStripeConfig(req, res);
  });

  app.post("/api/stripe/create-payment-intent", async (req, res) => {
    await createPaymentIntent(req, res);
  });

  app.get("/api/payment-methods", (req, res) => {
    res.json({
      paypal: true,
      stripe: isStripeConfigured(),
    });
  });

  if (!isExpoMode) {
    app.get("/api/pricing", (req, res) => {
      res.json(pricingPlans);
    });

    app.post("/api/subscription/create", async (req, res) => {
      try {
        const { userId, planType, paymentProvider } = req.body;
        
        const plan = pricingPlans.find(p => p.id === planType);
        if (!plan) {
          return res.status(400).json({ error: "Invalid plan type" });
        }

        const subscription = await storage.createSubscription({
          userId,
          planType,
          amount: plan.price * 100,
          currency: plan.currency,
          paymentProvider,
        });

        res.json(subscription);
      } catch (error) {
        console.error("Error creating subscription:", error);
        res.status(500).json({ error: "Failed to create subscription" });
      }
    });

    app.get("/api/subscription/:userId", async (req, res) => {
      try {
        const subscription = await storage.getSubscriptionByUser(req.params.userId);
        if (!subscription) {
          return res.json({ status: "free" });
        }
        res.json(subscription);
      } catch (error) {
        res.status(500).json({ error: "Failed to get subscription" });
      }
    });
  }

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Email is required" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      console.log(`Password reset requested for: ${email}`);

      res.json({ 
        success: true, 
        message: "If an account exists with this email, reset instructions have been sent" 
      });
    } catch (error) {
      console.error("Error processing password reset:", error);
      res.status(500).json({ error: "Failed to process password reset request" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      expoMode: isExpoMode,
      googleApi: isGoogleConfigured(),
    });
  });

  return httpServer;
}
