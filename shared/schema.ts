import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  subscriptionStatus: text("subscription_status").default("free"),
  subscriptionEndDate: timestamp("subscription_end_date"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const videoConversions = pgTable("video_conversions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  originalUrl: text("original_url"),
  originalFileName: text("original_file_name"),
  sourceLanguage: text("source_language"),
  targetLanguage: text("target_language").notNull(),
  status: text("status").notNull().default("pending"),
  progress: integer("progress").default(0),
  outputVideoUrl: text("output_video_url"),
  outputAudioUrl: text("output_audio_url"),
  subtitlesSrt: text("subtitles_srt"),
  subtitlesVtt: text("subtitles_vtt"),
  transcript: text("transcript"),
  translatedText: text("translated_text"),
  voiceType: text("voice_type").default("google"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVideoConversionSchema = createInsertSchema(videoConversions).pick({
  originalUrl: true,
  originalFileName: true,
  targetLanguage: true,
  voiceType: true,
});

export type InsertVideoConversion = z.infer<typeof insertVideoConversionSchema>;
export type VideoConversion = typeof videoConversions.$inferSelect;

export const voiceDubbings = pgTable("voice_dubbings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  inputText: text("input_text").notNull(),
  sourceLanguage: text("source_language"),
  targetLanguage: text("target_language").notNull(),
  outputAudioUrl: text("output_audio_url"),
  voiceType: text("voice_type").default("google"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVoiceDubbingSchema = createInsertSchema(voiceDubbings).pick({
  inputText: true,
  sourceLanguage: true,
  targetLanguage: true,
  voiceType: true,
});

export type InsertVoiceDubbing = z.infer<typeof insertVoiceDubbingSchema>;
export type VoiceDubbing = typeof voiceDubbings.$inferSelect;

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  planType: text("plan_type").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").default("USD"),
  paymentProvider: text("payment_provider").notNull(),
  paymentId: text("payment_id"),
  status: text("status").notNull().default("pending"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  userId: true,
  planType: true,
  amount: true,
  currency: true,
  paymentProvider: true,
});

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

export const supportedLanguages = [
  { code: "af", name: "Afrikaans", flag: "🇿🇦" },
  { code: "sq", name: "Albanian", flag: "🇦🇱" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hy", name: "Armenian", flag: "🇦🇲" },
  { code: "az", name: "Azerbaijani", flag: "🇦🇿" },
  { code: "eu", name: "Basque", flag: "🇪🇸" },
  { code: "be", name: "Belarusian", flag: "🇧🇾" },
  { code: "bn", name: "Bengali", flag: "🇧🇩" },
  { code: "bs", name: "Bosnian", flag: "🇧🇦" },
  { code: "bg", name: "Bulgarian", flag: "🇧🇬" },
  { code: "ca", name: "Catalan", flag: "🇪🇸" },
  { code: "ceb", name: "Cebuano", flag: "🇵🇭" },
  { code: "zh-CN", name: "Chinese (Simplified)", flag: "🇨🇳" },
  { code: "zh-TW", name: "Chinese (Traditional)", flag: "🇹🇼" },
  { code: "hr", name: "Croatian", flag: "🇭🇷" },
  { code: "cs", name: "Czech", flag: "🇨🇿" },
  { code: "da", name: "Danish", flag: "🇩🇰" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "eo", name: "Esperanto", flag: "🌍" },
  { code: "et", name: "Estonian", flag: "🇪🇪" },
  { code: "fi", name: "Finnish", flag: "🇫🇮" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "gl", name: "Galician", flag: "🇪🇸" },
  { code: "ka", name: "Georgian", flag: "🇬🇪" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "el", name: "Greek", flag: "🇬🇷" },
  { code: "gu", name: "Gujarati", flag: "🇮🇳" },
  { code: "ht", name: "Haitian Creole", flag: "🇭🇹" },
  { code: "ha", name: "Hausa", flag: "🇳🇬" },
  { code: "haw", name: "Hawaiian", flag: "🇺🇸" },
  { code: "he", name: "Hebrew", flag: "🇮🇱" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "hu", name: "Hungarian", flag: "🇭🇺" },
  { code: "is", name: "Icelandic", flag: "🇮🇸" },
  { code: "ig", name: "Igbo", flag: "🇳🇬" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "ga", name: "Irish", flag: "🇮🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "jv", name: "Javanese", flag: "🇮🇩" },
  { code: "kn", name: "Kannada", flag: "🇮🇳" },
  { code: "kk", name: "Kazakh", flag: "🇰🇿" },
  { code: "km", name: "Khmer", flag: "🇰🇭" },
  { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "ku", name: "Kurdish", flag: "🇮🇶" },
  { code: "ky", name: "Kyrgyz", flag: "🇰🇬" },
  { code: "lo", name: "Lao", flag: "🇱🇦" },
  { code: "la", name: "Latin", flag: "🇻🇦" },
  { code: "lv", name: "Latvian", flag: "🇱🇻" },
  { code: "lt", name: "Lithuanian", flag: "🇱🇹" },
  { code: "lb", name: "Luxembourgish", flag: "🇱🇺" },
  { code: "mk", name: "Macedonian", flag: "🇲🇰" },
  { code: "mg", name: "Malagasy", flag: "🇲🇬" },
  { code: "ms", name: "Malay", flag: "🇲🇾" },
  { code: "ml", name: "Malayalam", flag: "🇮🇳" },
  { code: "mt", name: "Maltese", flag: "🇲🇹" },
  { code: "mi", name: "Maori", flag: "🇳🇿" },
  { code: "mr", name: "Marathi", flag: "🇮🇳" },
  { code: "mn", name: "Mongolian", flag: "🇲🇳" },
  { code: "my", name: "Myanmar (Burmese)", flag: "🇲🇲" },
  { code: "ne", name: "Nepali", flag: "🇳🇵" },
  { code: "no", name: "Norwegian", flag: "🇳🇴" },
  { code: "ny", name: "Nyanja (Chichewa)", flag: "🇲🇼" },
  { code: "or", name: "Odia (Oriya)", flag: "🇮🇳" },
  { code: "ps", name: "Pashto", flag: "🇦🇫" },
  { code: "fa", name: "Persian", flag: "🇮🇷" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "pa", name: "Punjabi", flag: "🇮🇳" },
  { code: "ro", name: "Romanian", flag: "🇷🇴" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "sm", name: "Samoan", flag: "🇼🇸" },
  { code: "gd", name: "Scots Gaelic", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { code: "sr", name: "Serbian", flag: "🇷🇸" },
  { code: "st", name: "Sesotho", flag: "🇱🇸" },
  { code: "sn", name: "Shona", flag: "🇿🇼" },
  { code: "sd", name: "Sindhi", flag: "🇵🇰" },
  { code: "si", name: "Sinhala", flag: "🇱🇰" },
  { code: "sk", name: "Slovak", flag: "🇸🇰" },
  { code: "sl", name: "Slovenian", flag: "🇸🇮" },
  { code: "so", name: "Somali", flag: "🇸🇴" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "su", name: "Sundanese", flag: "🇮🇩" },
  { code: "sw", name: "Swahili", flag: "🇰🇪" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "tl", name: "Tagalog (Filipino)", flag: "🇵🇭" },
  { code: "tg", name: "Tajik", flag: "🇹🇯" },
  { code: "ta", name: "Tamil", flag: "🇮🇳" },
  { code: "tt", name: "Tatar", flag: "🇷🇺" },
  { code: "te", name: "Telugu", flag: "🇮🇳" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "tk", name: "Turkmen", flag: "🇹🇲" },
  { code: "uk", name: "Ukrainian", flag: "🇺🇦" },
  { code: "ur", name: "Urdu", flag: "🇵🇰" },
  { code: "ug", name: "Uyghur", flag: "🇨🇳" },
  { code: "uz", name: "Uzbek", flag: "🇺🇿" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "cy", name: "Welsh", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  { code: "xh", name: "Xhosa", flag: "🇿🇦" },
  { code: "yi", name: "Yiddish", flag: "🇮🇱" },
  { code: "yo", name: "Yoruba", flag: "🇳🇬" },
  { code: "zu", name: "Zulu", flag: "🇿🇦" },
];

export const supportedPlatforms = [
  { id: "youtube", name: "YouTube", icon: "youtube", color: "#FF0000" },
  { id: "tiktok", name: "TikTok", icon: "tiktok", color: "#000000" },
  { id: "instagram", name: "Instagram", icon: "instagram", color: "#E4405F" },
  { id: "facebook", name: "Facebook", icon: "facebook", color: "#1877F2" },
  { id: "twitter", name: "Twitter/X", icon: "twitter", color: "#1DA1F2" },
  { id: "linkedin", name: "LinkedIn", icon: "linkedin", color: "#0A66C2" },
  { id: "reddit", name: "Reddit", icon: "reddit", color: "#FF4500" },
  { id: "vimeo", name: "Vimeo", icon: "vimeo", color: "#1AB7EA" },
  { id: "dailymotion", name: "Dailymotion", icon: "dailymotion", color: "#0066DC" },
  { id: "twitch", name: "Twitch", icon: "twitch", color: "#9146FF" },
];

export const supportedFormats = ["mp4", "mov", "mkv", "webm", "avi"];

export type SupportedLanguage = typeof supportedLanguages[number];
export type SupportedPlatform = typeof supportedPlatforms[number];

export const conversionStatusSchema = z.enum([
  "pending",
  "downloading",
  "extracting_audio",
  "transcribing",
  "translating",
  "generating_voice",
  "merging",
  "completed",
  "failed",
]);

export type ConversionStatus = z.infer<typeof conversionStatusSchema>;

export const subscriptionPlanSchema = z.enum(["free", "creator", "business"]);
export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;

export const pricingPlans = [
  {
    id: "free",
    name: "Free Demo",
    price: 0,
    priceAnnual: 0,
    currency: "USD",
    features: [
      "30-second video limit",
      "5 conversions per day",
      "Standard Google TTS voice",
      "Basic subtitle export",
      "Community support",
    ],
    limitations: {
      maxVideoLength: 30,
      dailyConversions: 5,
      voiceCloning: false,
    },
  },
  {
    id: "creator",
    name: "Creator Studio",
    price: 12,
    priceAnnual: 8,
    annualTotal: 96,
    currency: "USD",
    popular: true,
    features: [
      "10-minute video limit",
      "Unlimited conversions",
      "Premium ElevenLabs voice cloning",
      "SRT & VTT subtitle export",
      "Priority processing",
      "Social sharing tools",
      "Priority email support",
    ],
    limitations: {
      maxVideoLength: 600,
      dailyConversions: -1,
      voiceCloning: true,
    },
  },
  {
    id: "business",
    name: "Business",
    price: 39,
    priceAnnual: 29,
    annualTotal: 348,
    currency: "USD",
    features: [
      "30-minute video limit",
      "Unlimited conversions",
      "Premium ElevenLabs voice cloning",
      "Custom voice profiles",
      "Batch processing",
      "API access",
      "SRT & VTT subtitle export",
      "Dedicated account manager",
      "White-label option",
    ],
    limitations: {
      maxVideoLength: 1800,
      dailyConversions: -1,
      voiceCloning: true,
    },
  },
];

export type PricingPlan = typeof pricingPlans[number];
