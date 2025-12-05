import { motion } from "framer-motion";
import {
  Globe,
  Mic2,
  Languages,
  Subtitles,
  Share2,
  Zap,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Globe,
    title: "200+ Languages",
    description:
      "Support for over 200 languages and dialects with Google Translate integration.",
  },
  {
    icon: Mic2,
    title: "Voice Cloning",
    description:
      "Premium ElevenLabs voice cloning technology for natural-sounding dubbing.",
  },
  {
    icon: Languages,
    title: "Auto Detection",
    description:
      "Automatically detect the original language of your video using AI.",
  },
  {
    icon: Subtitles,
    title: "Word-Level Subtitles",
    description:
      "Generate precise subtitles with word-by-word highlighting and timing.",
  },
  {
    icon: Share2,
    title: "Social Sharing",
    description:
      "Share your dubbed videos directly to Facebook, Twitter, WhatsApp, and more.",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description:
      "Advanced processing pipeline for quick video conversion and dubbing.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your videos are processed securely and deleted after conversion.",
  },
  {
    icon: Clock,
    title: "Queue Management",
    description:
      "Process multiple videos with our intelligent queue system.",
  },
  {
    icon: Sparkles,
    title: "High Quality",
    description:
      "Crystal clear audio output with natural speech patterns and intonation.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30" id="features">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Powerful Features for Video Translation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to transform your videos into any language with
            professional-quality dubbing and subtitles.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover-elevate transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
