import { HeroSection } from "@/components/HeroSection";
import { PlatformLogos } from "@/components/PlatformLogos";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PlatformLogos />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
