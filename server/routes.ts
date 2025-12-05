import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
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
      
      await storage.updateVoiceDubbing(dubbing.id, {
        status: "completed",
        outputAudioUrl: "/api/audio/sample.mp3",
      });

      const updated = await storage.getVoiceDubbing(dubbing.id);
      res.json(updated);
    } catch (error) {
      console.error("Error generating voice:", error);
      res.status(500).json({ error: "Failed to generate voice" });
    }
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

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      expoMode: isExpoMode,
    });
  });

  return httpServer;
}
