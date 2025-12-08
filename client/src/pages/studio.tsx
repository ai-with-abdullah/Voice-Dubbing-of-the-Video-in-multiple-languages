import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VoiceDubbingStudio } from "@/components/VoiceDubbingStudio";
import { Badge } from "@/components/ui/badge";
import { Mic2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Studio() {
  const { toast } = useToast();

  const handleGenerate = async (text: string, targetLanguage: string, voiceType: string): Promise<string> => {
    try {
      const response = await apiRequest("POST", "/api/voice/generate", {
        inputText: text,
        targetLanguage: targetLanguage,
        voiceType: voiceType,
      });

      const data = await response.json();

      if (data.outputAudioUrl) {
        toast({
          title: "Voice Generated",
          description: "Your audio has been successfully generated in the selected language.",
        });
        return data.outputAudioUrl;
      } else {
        throw new Error("No audio URL returned from the server");
      }
    } catch (error) {
      console.error("Error generating voice:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate voice. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              <Mic2 className="w-3 h-3 mr-1" />
              Voice Studio
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Voice Dubbing Studio
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Record or upload audio, transcribe it, and generate a new voice in any language.
              Perfect for voiceovers, podcasts, and content creation.
            </p>
          </div>

          <VoiceDubbingStudio onGenerate={handleGenerate} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
