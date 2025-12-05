import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Link2, Loader2, X, Video, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supportedPlatforms, supportedFormats } from "@shared/schema";

interface VideoInputProps {
  onVideoSelected: (source: { type: "url" | "file"; value: string | File; platform?: string }) => void;
  isProcessing?: boolean;
}

export function VideoInput({ onVideoSelected, isProcessing }: VideoInputProps) {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);

  const detectPlatform = (videoUrl: string) => {
    const urlLower = videoUrl.toLowerCase();
    for (const platform of supportedPlatforms) {
      if (urlLower.includes(platform.id) || urlLower.includes(platform.name.toLowerCase())) {
        return platform.id;
      }
    }
    return null;
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    const platform = detectPlatform(value);
    setDetectedPlatform(platform);
  };

  const handleUrlSubmit = () => {
    if (url.trim()) {
      onVideoSelected({
        type: "url",
        value: url.trim(),
        platform: detectedPlatform || undefined,
      });
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidVideoFile(droppedFile)) {
      setFile(droppedFile);
      onVideoSelected({ type: "file", value: droppedFile });
    }
  }, [onVideoSelected]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidVideoFile(selectedFile)) {
      setFile(selectedFile);
      onVideoSelected({ type: "file", value: selectedFile });
    }
  };

  const isValidVideoFile = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    return extension && supportedFormats.includes(extension);
  };

  const clearFile = () => {
    setFile(null);
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = supportedPlatforms.find((p) => p.id === platformId);
    return platform?.name || platformId;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="url" className="gap-2" data-testid="tab-url">
              <Link2 className="w-4 h-4" />
              Video URL
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2" data-testid="tab-upload">
              <Upload className="w-4 h-4" />
              Upload File
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <div className="relative">
              <Input
                type="url"
                placeholder="Paste video URL from YouTube, TikTok, Instagram, Facebook..."
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="pr-24"
                disabled={isProcessing}
                data-testid="input-video-url"
              />
              {detectedPlatform && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {getPlatformIcon(detectedPlatform)}
                  </Badge>
                </div>
              )}
            </div>

            <Button
              onClick={handleUrlSubmit}
              disabled={!url.trim() || isProcessing}
              className="w-full"
              data-testid="button-fetch-video"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fetching Video...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  Fetch Video
                </>
              )}
            </Button>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-3">Supported platforms:</p>
              <div className="flex flex-wrap gap-2">
                {supportedPlatforms.map((platform) => (
                  <Badge
                    key={platform.id}
                    variant="outline"
                    className="text-xs"
                    data-testid={`badge-platform-${platform.id}`}
                  >
                    {platform.name}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".mp4,.mov,.mkv,.webm,.avi"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isProcessing}
                data-testid="input-file-upload"
              />
              
              <div className="text-center">
                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div
                      key="file"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-3"
                    >
                      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                        <Video className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearFile();
                        }}
                        data-testid="button-clear-file"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-3"
                    >
                      <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Drop your video here or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supports {supportedFormats.map((f) => f.toUpperCase()).join(", ")}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {file && (
              <Button
                onClick={() => onVideoSelected({ type: "file", value: file })}
                disabled={isProcessing}
                className="w-full"
                data-testid="button-process-upload"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 mr-2" />
                    Process Video
                  </>
                )}
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
