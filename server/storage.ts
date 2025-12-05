import {
  type User,
  type InsertUser,
  type VideoConversion,
  type InsertVideoConversion,
  type VoiceDubbing,
  type InsertVoiceDubbing,
  type Subscription,
  type InsertSubscription,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getVideoConversion(id: string): Promise<VideoConversion | undefined>;
  getVideoConversionsByUser(userId: string): Promise<VideoConversion[]>;
  createVideoConversion(conversion: InsertVideoConversion): Promise<VideoConversion>;
  updateVideoConversion(id: string, updates: Partial<VideoConversion>): Promise<VideoConversion | undefined>;
  deleteVideoConversion(id: string): Promise<boolean>;

  getVoiceDubbing(id: string): Promise<VoiceDubbing | undefined>;
  getVoiceDubbingsByUser(userId: string): Promise<VoiceDubbing[]>;
  createVoiceDubbing(dubbing: InsertVoiceDubbing): Promise<VoiceDubbing>;
  updateVoiceDubbing(id: string, updates: Partial<VoiceDubbing>): Promise<VoiceDubbing | undefined>;

  getSubscription(id: string): Promise<Subscription | undefined>;
  getSubscriptionByUser(userId: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription | undefined>;

  getConversionStats(): Promise<{ totalConversions: number; todayConversions: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private videoConversions: Map<string, VideoConversion>;
  private voiceDubbings: Map<string, VoiceDubbing>;
  private subscriptions: Map<string, Subscription>;

  constructor() {
    this.users = new Map();
    this.videoConversions = new Map();
    this.voiceDubbings = new Map();
    this.subscriptions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      email: insertUser.email || null,
      subscriptionStatus: "free",
      subscriptionEndDate: null,
    };
    this.users.set(id, user);
    return user;
  }

  async getVideoConversion(id: string): Promise<VideoConversion | undefined> {
    return this.videoConversions.get(id);
  }

  async getVideoConversionsByUser(userId: string): Promise<VideoConversion[]> {
    return Array.from(this.videoConversions.values()).filter(
      (conversion) => conversion.userId === userId
    );
  }

  async createVideoConversion(insertConversion: InsertVideoConversion): Promise<VideoConversion> {
    const id = randomUUID();
    const conversion: VideoConversion = {
      id,
      userId: null,
      originalUrl: insertConversion.originalUrl || null,
      originalFileName: insertConversion.originalFileName || null,
      sourceLanguage: null,
      targetLanguage: insertConversion.targetLanguage,
      status: "pending",
      progress: 0,
      outputVideoUrl: null,
      outputAudioUrl: null,
      subtitlesSrt: null,
      subtitlesVtt: null,
      transcript: null,
      translatedText: null,
      voiceType: insertConversion.voiceType || "google",
      createdAt: new Date(),
    };
    this.videoConversions.set(id, conversion);
    return conversion;
  }

  async updateVideoConversion(id: string, updates: Partial<VideoConversion>): Promise<VideoConversion | undefined> {
    const conversion = this.videoConversions.get(id);
    if (!conversion) return undefined;

    const updated = { ...conversion, ...updates };
    this.videoConversions.set(id, updated);
    return updated;
  }

  async deleteVideoConversion(id: string): Promise<boolean> {
    return this.videoConversions.delete(id);
  }

  async getVoiceDubbing(id: string): Promise<VoiceDubbing | undefined> {
    return this.voiceDubbings.get(id);
  }

  async getVoiceDubbingsByUser(userId: string): Promise<VoiceDubbing[]> {
    return Array.from(this.voiceDubbings.values()).filter(
      (dubbing) => dubbing.userId === userId
    );
  }

  async createVoiceDubbing(insertDubbing: InsertVoiceDubbing): Promise<VoiceDubbing> {
    const id = randomUUID();
    const dubbing: VoiceDubbing = {
      id,
      userId: null,
      inputText: insertDubbing.inputText,
      sourceLanguage: insertDubbing.sourceLanguage || null,
      targetLanguage: insertDubbing.targetLanguage,
      outputAudioUrl: null,
      voiceType: insertDubbing.voiceType || "google",
      status: "pending",
      createdAt: new Date(),
    };
    this.voiceDubbings.set(id, dubbing);
    return dubbing;
  }

  async updateVoiceDubbing(id: string, updates: Partial<VoiceDubbing>): Promise<VoiceDubbing | undefined> {
    const dubbing = this.voiceDubbings.get(id);
    if (!dubbing) return undefined;

    const updated = { ...dubbing, ...updates };
    this.voiceDubbings.set(id, updated);
    return updated;
  }

  async getSubscription(id: string): Promise<Subscription | undefined> {
    return this.subscriptions.get(id);
  }

  async getSubscriptionByUser(userId: string): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(
      (sub) => sub.userId === userId && sub.status === "active"
    );
  }

  async createSubscription(insertSub: InsertSubscription): Promise<Subscription> {
    const id = randomUUID();
    const subscription: Subscription = {
      id,
      userId: insertSub.userId,
      planType: insertSub.planType,
      amount: insertSub.amount,
      currency: insertSub.currency || "USD",
      paymentProvider: insertSub.paymentProvider,
      paymentId: null,
      status: "pending",
      startDate: null,
      endDate: null,
      createdAt: new Date(),
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return undefined;

    const updated = { ...subscription, ...updates };
    this.subscriptions.set(id, updated);
    return updated;
  }

  async getConversionStats(): Promise<{ totalConversions: number; todayConversions: number }> {
    const conversions = Array.from(this.videoConversions.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayConversions = conversions.filter(
      (c) => c.createdAt && new Date(c.createdAt) >= today
    ).length;

    return {
      totalConversions: conversions.length,
      todayConversions,
    };
  }
}

export const storage = new MemStorage();
