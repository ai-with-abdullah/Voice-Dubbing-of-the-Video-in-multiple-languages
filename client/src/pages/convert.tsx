import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VideoInput } from "@/components/VideoInput";
import { LanguageSelector, LanguageDisplay } from "@/components/LanguageSelector";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ConversionProgress } from "@/components/ConversionProgress";
import { SocialShareButtons } from "@/components/SocialShareButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { isExpoMode } from "@/lib/config";
import type { ConversionStatus } from "@shared/schema";

interface VideoSource {
  type: "url" | "file";
  value: string | File;
  platform?: string;
}

export default function Convert() {
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState("");
  const [usePremiumVoice, setUsePremiumVoice] = useState(isExpoMode());
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionStatus, setConversionStatus] = useState<ConversionStatus>("pending");
  const [conversionProgress, setConversionProgress] = useState(0);
  const [result, setResult] = useState<{
    videoUrl: string;
    subtitles: any[];
  } | null>(null);

  const handleVideoSelected = (source: VideoSource) => {
    setVideoSource(source);
    setResult(null);
    setConversionStatus("pending");
    setConversionProgress(0);
    setDetectedLanguage("en");
  };

  const handleConvert = async () => {
    if (!videoSource || !targetLanguage) return;

    setIsProcessing(true);
    setConversionStatus("downloading");

    const steps: ConversionStatus[] = [
      "downloading",
      "extracting_audio",
      "transcribing",
      "translating",
      "generating_voice",
      "merging",
    ];

    for (let i = 0; i < steps.length; i++) {
      setConversionStatus(steps[i]);
      setConversionProgress(Math.round(((i + 1) / steps.length) * 100));
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    setConversionStatus("completed");
    setConversionProgress(100);
    setResult({
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      subtitles: [
        {
          id: 1,
          startTime: 0,
          endTime: 3,
          text: "Welcome to the demo video",
          words: [
            { word: "Welcome", startTime: 0, endTime: 0.5 },
            { word: "to", startTime: 0.5, endTime: 0.7 },
            { word: "the", startTime: 0.7, endTime: 0.9 },
            { word: "demo", startTime: 0.9, endTime: 1.3 },
            { word: "video", startTime: 1.3, endTime: 1.8 },
          ],
        },
        {
          id: 2,
          startTime: 3,
          endTime: 6,
          text: "This is an example of dubbed content",
          words: [
            { word: "This", startTime: 3, endTime: 3.3 },
            { word: "is", startTime: 3.3, endTime: 3.5 },
            { word: "an", startTime: 3.5, endTime: 3.7 },
            { word: "example", startTime: 3.7, endTime: 4.2 },
            { word: "of", startTime: 4.2, endTime: 4.4 },
            { word: "dubbed", startTime: 4.4, endTime: 4.8 },
            { word: "content", startTime: 4.8, endTime: 5.3 },
          ],
        },
      ],
    });
    setIsProcessing(false);
  };

  const handleDownloadVideo = () => {
    if (result?.videoUrl) {
      window.open(result.videoUrl, "_blank");
    }
  };

  const handleDownloadAudio = () => {
    console.log("Download audio");
  };

  const handleDownloadSubtitles = (format: "srt" | "vtt") => {
    console.log(`Download subtitles as ${format}`);
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

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <VideoInput
                onVideoSelected={handleVideoSelected}
                isProcessing={isProcessing}
              />

              <AnimatePresence mode="wait">
                {videoSource && (
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
                        {detectedLanguage && (
                          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div>
                              <p className="text-sm text-muted-foreground">Detected Language</p>
                              <LanguageDisplay code={detectedLanguage} />
                            </div>
                            <Badge variant="outline">Auto-detected</Badge>
                          </div>
                        )}

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
                          disabled={!targetLanguage || isProcessing}
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
                    <VideoPlayer
                      videoUrl={result.videoUrl}
                      subtitles={result.subtitles}
                      onDownloadVideo={handleDownloadVideo}
                      onDownloadAudio={handleDownloadAudio}
                      onDownloadSubtitles={handleDownloadSubtitles}
                    />
                    
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
