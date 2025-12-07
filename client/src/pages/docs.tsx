import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  BookOpen,
  Upload,
  Languages,
  Mic2,
  Download,
  Settings,
  Zap,
  HelpCircle,
  ArrowRight,
  Video,
  Wand2,
  FileText,
} from "lucide-react";

const gettingStartedSteps = [
  {
    step: 1,
    title: "Upload Your Video",
    description: "Start by uploading your video file or paste a URL from YouTube, Vimeo, or other platforms. We support most common video formats including MP4, MOV, AVI, and WebM.",
    icon: Upload,
  },
  {
    step: 2,
    title: "Select Target Language",
    description: "Choose from over 200 languages and dialects. Our AI will automatically detect the source language or you can specify it manually for better accuracy.",
    icon: Languages,
  },
  {
    step: 3,
    title: "Configure Voice Settings",
    description: "Customize the output voice with premium AI voice cloning technology. Adjust pitch, speed, and tone to match your preferences.",
    icon: Settings,
  },
  {
    step: 4,
    title: "Process and Download",
    description: "Our AI processes your video in minutes. Once complete, download your dubbed video with perfectly synced audio and optional subtitles.",
    icon: Download,
  },
];

const features = [
  {
    title: "Video Conversion",
    description: "Convert any video to over 200 languages with natural-sounding AI voices.",
    icon: Video,
    href: "/convert",
  },
  {
    title: "Voice Studio",
    description: "Record, transcribe, and generate voiceovers in any language.",
    icon: Mic2,
    href: "/studio",
  },
  {
    title: "AI Voice Cloning",
    description: "Create custom voices that sound natural and authentic.",
    icon: Wand2,
    href: "/convert",
  },
  {
    title: "Subtitle Export",
    description: "Download word-level subtitles in SRT or VTT format.",
    icon: FileText,
    href: "/convert",
  },
];

const faqs = [
  {
    question: "What video formats are supported?",
    answer: "We support all major video formats including MP4, MOV, AVI, WebM, MKV, and more. You can also paste URLs from YouTube, Vimeo, TikTok, and other video platforms.",
  },
  {
    question: "How accurate is the translation?",
    answer: "Our AI uses advanced neural machine translation powered by Google Cloud, achieving over 95% accuracy for most language pairs. The quality continues to improve with each update.",
  },
  {
    question: "Can I use my own voice?",
    answer: "Yes! With our Voice Studio, you can record your own voice and have it cloned to speak in any of our supported languages while maintaining your unique vocal characteristics.",
  },
  {
    question: "How long does processing take?",
    answer: "Processing time depends on video length and selected features. Most videos under 10 minutes are processed in 2-5 minutes. Premium users get priority processing for faster results.",
  },
  {
    question: "Is there a file size limit?",
    answer: "Free users can upload videos up to 100MB. Creator plans support up to 500MB, and Business plans allow files up to 2GB.",
  },
];

export default function Docs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <Badge variant="secondary" className="mb-4 gap-1">
                <BookOpen className="w-3 h-3" />
                Documentation
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                How to Use Dubbio
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about transforming your videos with 
                AI-powered voice dubbing. Get started in minutes.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <Link href="/convert">
                <Button size="lg" className="w-full gap-2" data-testid="button-start-converting">
                  Start Converting
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/support">
                <Button size="lg" variant="outline" className="w-full gap-2" data-testid="button-contact-support">
                  <HelpCircle className="w-4 h-4" />
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge variant="secondary" className="mb-4 gap-1">
                <Zap className="w-3 h-3" />
                Getting Started
              </Badge>
              <h2 className="text-3xl font-bold mb-4">
                Four Simple Steps
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Transform your video content into any language with our streamlined workflow.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {gettingStartedSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {step.step}
                        </div>
                        <step.icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                Core Features
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Explore the powerful tools available in Dubbio.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={feature.href}>
                    <Card className="h-full hover-elevate cursor-pointer">
                      <CardHeader>
                        <feature.icon className="w-8 h-8 text-primary mb-2" />
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge variant="secondary" className="mb-4 gap-1">
                <HelpCircle className="w-3 h-3" />
                FAQ
              </Badge>
              <h2 className="text-3xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Find answers to common questions about using Dubbio.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-primary/5">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Transform your first video today and see the power of AI-driven voice dubbing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/convert">
                  <Button size="lg" className="gap-2" data-testid="button-try-free">
                    Try for Free
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/support">
                  <Button size="lg" variant="outline" data-testid="button-get-help">
                    Get Help
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
