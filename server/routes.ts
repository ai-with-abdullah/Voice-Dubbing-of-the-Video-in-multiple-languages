import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import express from "express";
import { storage } from "./storage";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import { createPaymentIntent, getStripeConfig, isStripeConfigured } from "./stripe";
import { generateSpeechWithElevenLabs, checkApiKeyValid } from "./elevenlabs";
import {
  insertVideoConversionSchema,
  insertVoiceDubbingSchema,
  supportedLanguages,
  supportedPlatforms,
  pricingPlans,
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const isExpoMode = process.env.EXPO_MODE === "true";

  // Serve generated audio files
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

  app.post("/api/convert/video", async (req, res) => {
    try {
      const validation = insertVideoConversionSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.message });
      }

      const conversion = await storage.createVideoConversion(validation.data);
      
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
      
      // Generate actual speech using ElevenLabs
      const result = await generateSpeechWithElevenLabs(
        validation.data.inputText,
        validation.data.targetLanguage
      );

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

  // Check if ElevenLabs API is configured
  app.get("/api/voice/status", async (req, res) => {
    const isValid = await checkApiKeyValid();
    res.json({
      elevenlabs: isValid,
      message: isValid 
        ? "ElevenLabs API is configured and ready" 
        : "ElevenLabs API key not configured or invalid",
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

  // Stripe payment routes
  app.get("/api/stripe/config", async (req, res) => {
    await getStripeConfig(req, res);
  });

  app.post("/api/stripe/create-payment-intent", async (req, res) => {
    await createPaymentIntent(req, res);
  });

  // Payment methods status
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

  // Password reset request (placeholder - would integrate with email service)
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

      // In production, this would:
      // 1. Check if user exists
      // 2. Generate a secure reset token
      // 3. Store token with expiry in database
      // 4. Send email with reset link
      console.log(`Password reset requested for: ${email}`);

      // Always return success to prevent email enumeration
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
    });
  });

  return httpServer;
}
