import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Play, Volume2, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VideoInput } from "@/components/VideoInput";
import { LanguageSelector, LanguageDisplay } from "@/components/LanguageSelector";
import { ConversionProgress } from "@/components/ConversionProgress";
import { SocialShareButtons } from "@/components/SocialShareButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isExpoMode } from "@/lib/config";
import { apiRequest } from "@/lib/queryClient";
import type { ConversionStatus } from "@shared/schema";

interface VideoSource {
  type: "url" | "file";
  value: string | File;
  platform?: string;
}

interface VideoInfo {
  title: string;
  thumbnail: string;
  embedUrl: string;
  originalUrl: string;
  platform: string;
  detectedLanguage: string | null;
}

interface ConversionResult {
  id: string;
  status: string;
  outputAudioUrl?: string;
  translatedText?: string;
  subtitlesSrt?: string;
  subtitlesVtt?: string;
  outputVideoUrl?: string;
}

export default function Convert() {
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState("");
  const [usePremiumVoice, setUsePremiumVoice] = useState(isExpoMode());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [conversionStatus, setConversionStatus] = useState<ConversionStatus>("pending");
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionId, setConversionId] = useState<string | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVideoSelected = async (source: VideoSource) => {
    setVideoSource(source);
    setResult(null);
    setConversionStatus("pending");
    setConversionProgress(0);
    setError(null);
    setVideoInfo(null);
    setDetectedLanguage(null);

    if (source.type === "url" && typeof source.value === "string") {
      setIsFetching(true);
      try {
        const response = await apiRequest("POST", "/api/video/info", { url: source.value });
        const info = await response.json();
        setVideoInfo(info);
        if (info.detectedLanguage) {
          setDetectedLanguage(info.detectedLanguage);
        }
      } catch (err) {
        console.error("Error fetching video info:", err);
        setError("Could not fetch video information. The platform may not be supported or the video may be private.");
      } finally {
        setIsFetching(false);
      }
    } else if (source.type === "file") {
      setDetectedLanguage(null);
    }
  };

  const handleConvert = async () => {
    if (!videoSource || !targetLanguage) return;

    setIsProcessing(true);
    setConversionStatus("downloading");
    setError(null);

    try {
      const originalUrl = typeof videoSource.value === "string" 
        ? videoSource.value 
        : videoSource.value.name;

      const response = await apiRequest("POST", "/api/convert/video", {
        originalUrl,
        targetLanguage,
        sourceLanguage: detectedLanguage || "en",
        voiceType: usePremiumVoice ? "elevenlabs" : "google",
        platform: videoSource.platform || videoInfo?.platform || "unknown",
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setConversionId(data.id);
      pollConversionStatus(data.id);
    } catch (err: any) {
      console.error("Error starting conversion:", err);
      setError(err.message || "Failed to start conversion. Please try again.");
      setIsProcessing(false);
      setConversionStatus("failed");
    }
  };

  const pollConversionStatus = async (id: string) => {
    const statusSteps: Record<number, ConversionStatus> = {
      10: "downloading",
      30: "transcribing",
      60: "translating",
      90: "generating_voice",
      100: "completed",
    };

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/convert/video/${id}`);
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setConversionProgress(data.progress || 0);

        for (const [progress, status] of Object.entries(statusSteps).reverse()) {
          if (data.progress >= parseInt(progress)) {
            setConversionStatus(status);
            break;
          }
        }

        if (data.status === "completed") {
          setResult({
            id: data.id,
            status: data.status,
            outputAudioUrl: data.outputAudioUrl,
            translatedText: data.translatedText,
            subtitlesSrt: data.subtitlesSrt,
            subtitlesVtt: data.subtitlesVtt,
            outputVideoUrl: data.outputVideoUrl,
          });
          setIsProcessing(false);
          setConversionStatus("completed");
        } else if (data.status === "failed") {
          throw new Error("Conversion failed. Please try again.");
        } else {
          setTimeout(checkStatus, 1500);
        }
      } catch (err: any) {
        console.error("Error checking conversion status:", err);
        setError(err.message || "Failed to check conversion status.");
        setIsProcessing(false);
        setConversionStatus("failed");
      }
    };

    checkStatus();
  };

  const handleDownloadAudio = () => {
    if (result?.outputAudioUrl) {
      window.open(result.outputAudioUrl, "_blank");
    }
  };

  const handleDownloadSubtitles = (format: "srt" | "vtt") => {
    const content = format === "srt" ? result?.subtitlesSrt : result?.subtitlesVtt;
    if (content) {
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `subtitles.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getEmbedUrl = () => {
    if (videoInfo?.embedUrl) {
      return videoInfo.embedUrl;
    }
    if (videoSource?.type === "url" && typeof videoSource.value === "string") {
      return videoSource.value;
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Convert Video to Any Language
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a video or paste a URL from YouTube, TikTok, Instagram, and more.
              Select your target language and let AI do the magic.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 max-w-3xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <VideoInput
                onVideoSelected={handleVideoSelected}
                isProcessing={isProcessing || isFetching}
              />

              <AnimatePresence mode="wait">
                {(videoSource || isFetching) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Conversion Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {videoInfo && (
                          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                            <div className="flex items-center gap-3">
                              {videoInfo.thumbnail && (
                                <img 
                                  src={videoInfo.thumbnail} 
                                  alt={videoInfo.title}
                                  className="w-20 h-12 object-cover rounded"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{videoInfo.title}</p>
                                <Badge variant="secondary" className="mt-1">
                                  {videoInfo.platform}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div>
                            <p className="text-sm text-muted-foreground">Detected Language</p>
                            {isFetching ? (
                              <p className="text-sm text-muted-foreground">Detecting...</p>
                            ) : detectedLanguage ? (
                              <LanguageDisplay code={detectedLanguage} />
                            ) : (
                              <p className="text-sm text-muted-foreground">Unknown (will use English)</p>
                            )}
                          </div>
                          <Badge variant="outline">
                            {detectedLanguage ? "Auto-detected" : "Default"}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <Label>Target Language</Label>
                          <LanguageSelector
                            value={targetLanguage}
                            onChange={setTargetLanguage}
                            label="Select target language"
                            excludeLanguage={detectedLanguage || undefined}
                            disabled={isProcessing}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium">Premium Voice Cloning</p>
                              <p className="text-xs text-muted-foreground">
                                ElevenLabs technology
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={usePremiumVoice}
                            onCheckedChange={setUsePremiumVoice}
                            disabled={isProcessing}
                            data-testid="switch-premium-voice"
                          />
                        </div>

                        <Button
                          className="w-full"
                          size="lg"
                          disabled={!targetLanguage || isProcessing || isFetching}
                          onClick={handleConvert}
                          data-testid="button-convert"
                        >
                          {isProcessing ? (
                            "Converting..."
                          ) : (
                            <>
                              Convert Now
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <ConversionProgress
                      status={conversionStatus}
                      progress={conversionProgress}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Play className="w-5 h-5" />
                          Original Video with Dubbed Audio
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {videoInfo?.platform === "youtube" && videoInfo.embedUrl ? (
                          <div className="aspect-video rounded-lg overflow-hidden bg-black">
                            <iframe
                              src={videoInfo.embedUrl}
                              className="w-full h-full"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                          </div>
                        ) : videoInfo?.thumbnail ? (
                          <div className="aspect-video rounded-lg overflow-hidden relative">
                            <img 
                              src={videoInfo.thumbnail} 
                              alt={videoInfo.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                              <div className="text-center text-white">
                                <Play className="w-12 h-12 mx-auto mb-2" />
                                <p className="text-sm">Open original video to watch</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => window.open(videoInfo.originalUrl, "_blank")}
                                >
                                  Open Video
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">Video preview not available</p>
                          </div>
                        )}

                        {result.outputAudioUrl && (
                          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                            <div className="flex items-center gap-2">
                              <Volume2 className="w-5 h-5 text-primary" />
                              <p className="font-medium">Dubbed Audio (Play while watching video)</p>
                            </div>
                            <audio 
                              controls 
                              className="w-full"
                              src={result.outputAudioUrl}
                            >
                              Your browser does not support the audio element.
                            </audio>
                            <p className="text-sm text-muted-foreground">
                              Play this audio while watching the original video for the dubbed experience.
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleDownloadAudio}
                            disabled={!result.outputAudioUrl}
                            data-testid="button-download-audio"
                          >
                            Download Audio
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadSubtitles("srt")}
                            disabled={!result.subtitlesSrt}
                            data-testid="button-download-srt"
                          >
                            Download SRT
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadSubtitles("vtt")}
                            disabled={!result.subtitlesVtt}
                            data-testid="button-download-vtt"
                          >
                            Download VTT
                          </Button>
                        </div>

                        {result.translatedText && (
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm font-medium mb-2">Translated Text:</p>
                            <p className="text-sm text-muted-foreground">{result.translatedText}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="py-4">
                        <SocialShareButtons
                          url={window.location.href}
                          title="Check out my dubbed video!"
                          description="Created with Dubbio"
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : videoInfo ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Video Preview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {videoInfo.platform === "youtube" && videoInfo.embedUrl ? (
                          <div className="aspect-video rounded-lg overflow-hidden bg-black">
                            <iframe
                              src={videoInfo.embedUrl}
                              className="w-full h-full"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                          </div>
                        ) : videoInfo.thumbnail ? (
                          <div className="aspect-video rounded-lg overflow-hidden relative">
                            <img 
                              src={videoInfo.thumbnail} 
                              alt={videoInfo.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Badge variant="secondary" className="gap-1">
                                <Play className="w-3 h-3" />
                                {videoInfo.platform}
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                            <div className="text-center">
                              <Badge variant="secondary" className="mb-2">
                                {videoInfo.platform}
                              </Badge>
                              <p className="text-sm text-muted-foreground">{videoInfo.title}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Card className="h-full min-h-[400px] flex items-center justify-center">
                      <CardContent className="text-center py-12">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                          <Sparkles className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          Your Dubbed Video Will Appear Here
                        </h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                          Upload a video and select a target language to start the conversion process.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
