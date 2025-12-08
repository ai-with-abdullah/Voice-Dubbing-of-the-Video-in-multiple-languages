import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Globe, Mic2, Languages, Clock, Sparkles, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const features = [
  {
    icon: Languages,
    title: "200+ Languages",
    description: "Support for over 200 languages with natural-sounding AI voices"
  },
  {
    icon: Mic2,
    title: "Voice Cloning",
    description: "Preserve the original speaker's voice characteristics across languages"
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Get your dubbed videos in minutes, not hours"
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Advanced AI technology for seamless lip-sync and natural delivery"
  }
];

export default function Demo() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
          
          <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
            <Link href="/">
              <Button variant="ghost" className="mb-8 gap-2" data-testid="button-back-home">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                <Play className="w-3 h-3 mr-1" />
                Demo Videos
              </Badge>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                See Dubbio in Action
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Watch how our AI-powered voice dubbing technology transforms videos into any language 
                while preserving the original speaker's voice and emotion.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid lg:grid-cols-2 gap-8 mb-16"
            >
              <Card className="overflow-hidden" data-testid="card-demo-video-1">
                <CardContent className="p-0">
                  <div className="aspect-video relative bg-gradient-to-br from-primary/10 to-primary/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-4 p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                          <Play className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground mb-1">Original Video</p>
                          <p className="text-sm text-muted-foreground">English Speaker</p>
                        </div>
                        <Badge variant="outline" className="gap-1">
                          <Volume2 className="w-3 h-3" />
                          Video coming soon
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border">
                    <h3 className="font-semibold mb-1">Before: Original Audio</h3>
                    <p className="text-sm text-muted-foreground">
                      Watch the original video with native English audio
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden" data-testid="card-demo-video-2">
                <CardContent className="p-0">
                  <div className="aspect-video relative bg-gradient-to-br from-primary/10 to-primary/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-4 p-6 text-center">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                            <Globe className="w-8 h-8 text-primary" />
                          </div>
                          <motion.div
                            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Mic2 className="w-3 h-3 text-primary-foreground" />
                          </motion.div>
                        </div>
                        <div>
                          <p className="font-medium text-foreground mb-1">AI Dubbed Video</p>
                          <p className="text-sm text-muted-foreground">Multi-language Output</p>
                        </div>
                        <Badge variant="outline" className="gap-1">
                          <Volume2 className="w-3 h-3" />
                          Video coming soon
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border">
                    <h3 className="font-semibold mb-1">After: AI Dubbed Audio</h3>
                    <p className="text-sm text-muted-foreground">
                      Same video with AI-generated voice in your target language
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <Card key={feature.title} className="text-center" data-testid={`card-feature-${index}`}>
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <Card className="inline-block">
                <CardContent className="py-8 px-12">
                  <h2 className="text-2xl font-bold mb-4">Ready to Try It Yourself?</h2>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Start converting your videos today with our easy-to-use platform. 
                    No technical skills required.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/convert">
                      <Button size="lg" className="gap-2 w-full sm:w-auto" data-testid="button-start-converting">
                        Start Converting
                        <Sparkles className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/pricing">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-view-pricing">
                        View Pricing
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
