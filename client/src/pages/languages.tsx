import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LanguageGrid } from "@/components/LanguageGrid";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";

export default function Languages() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              <Globe className="w-3 h-3 mr-1" />
              Language Support
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              200+ Languages Supported
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform supports over 200 languages and dialects,
              powered by Google Translate and advanced voice synthesis technology.
            </p>
          </div>

          <LanguageGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
}
