import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Upload,
  Play,
  Pause,
  Download,
  Loader2,
  Volume2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LanguageSelector } from "./LanguageSelector";
import { isExpoMode } from "@/lib/config";

interface VoiceDubbingStudioProps {
  onGenerate?: (text: string, targetLanguage: string, voiceType: string) => Promise<string>;
}

export function VoiceDubbingStudio({ onGenerate }: VoiceDubbingStudioProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [usePremiumVoice, setUsePremiumVoice] = useState(isExpoMode());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "recording.webm", { type: "audio/webm" });
        setAudioFile(file);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleGenerate = async () => {
    if (!transcript.trim() || !targetLanguage) return;

    setIsGenerating(true);
    try {
      const voiceType = usePremiumVoice ? "elevenlabs" : "google";
      if (onGenerate) {
        const audioUrl = await onGenerate(transcript, targetLanguage, voiceType);
        setGeneratedAudioUrl(audioUrl);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setGeneratedAudioUrl("/api/sample-audio.mp3");
      }
    } catch (error) {
      console.error("Error generating voice:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (value: number[]) => {
    const speed = value[0];
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const downloadAudio = () => {
    if (generatedAudioUrl) {
      const a = document.createElement("a");
      a.href = generatedAudioUrl;
      a.download = "dubbed-audio.mp3";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const clearAll = () => {
    setTranscript("");
    setAudioFile(null);
    setGeneratedAudioUrl(null);
    setTargetLanguage("");
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              className="flex-1"
              onClick={isRecording ? stopRecording : startRecording}
              data-testid="button-record"
            >
              {isRecording ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </>
              )}
            </Button>

            <div className="relative flex-1">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                data-testid="input-audio-file"
              />
              <Button variant="outline" className="w-full" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Audio
                </span>
              </Button>
            </div>
          </div>

          {isRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 py-4"
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-primary rounded-full"
                    animate={{
                      height: [8, 24, 8],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">Recording...</span>
            </motion.div>
          )}

          {audioFile && !isRecording && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm flex-1 truncate">{audioFile.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAudioFile(null)}
                data-testid="button-clear-audio"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label>Transcription (Editable)</Label>
            <Textarea
              placeholder="Your speech will appear here, or type/paste text to convert..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={6}
              className="resize-none"
              data-testid="textarea-transcript"
            />
            <p className="text-xs text-muted-foreground">
              {transcript.length} characters
            </p>
          </div>

          <div className="space-y-2">
            <Label>Target Language</Label>
            <LanguageSelector
              value={targetLanguage}
              onChange={setTargetLanguage}
              label="Select output language"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Premium Voice</p>
                <p className="text-xs text-muted-foreground">
                  ElevenLabs voice cloning
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {usePremiumVoice && (
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              )}
              <Switch
                checked={usePremiumVoice}
                onCheckedChange={setUsePremiumVoice}
                data-testid="switch-premium-voice"
              />
            </div>
          </div>

          <Button
            className="w-full"
            disabled={!transcript.trim() || !targetLanguage || isGenerating}
            onClick={handleGenerate}
            data-testid="button-generate-voice"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Voice...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Voice
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Output
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {generatedAudioUrl ? (
            <>
              <audio ref={audioRef} src={generatedAudioUrl} />

              <div className="flex items-center justify-center">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full w-20 h-20"
                  onClick={togglePlayback}
                  data-testid="button-playback"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Playback Speed</Label>
                  <span className="text-sm text-muted-foreground">
                    {playbackSpeed}x
                  </span>
                </div>
                <Slider
                  value={[playbackSpeed]}
                  min={0.5}
                  max={2}
                  step={0.25}
                  onValueChange={handleSpeedChange}
                  data-testid="slider-playback-speed"
                />
              </div>

              <Button
                className="w-full"
                onClick={downloadAudio}
                data-testid="button-download-audio"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Audio
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Volume2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Generated audio will appear here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Enter text and select a language to generate
              </p>
            </div>
          )}

          {(transcript || audioFile || generatedAudioUrl) && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={clearAll}
              data-testid="button-clear-all"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
