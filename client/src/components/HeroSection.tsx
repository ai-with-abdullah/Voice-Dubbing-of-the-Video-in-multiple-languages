import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Play, Globe, Mic2, Zap, Languages, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { value: "10,000+", label: "Videos Converted" },
  { value: "200+", label: "Languages" },
  { value: "99.9%", label: "Accuracy" },
];

const trustBadges = [
  "Voice Cloning Technology",
  "Word-Level Subtitles",
  "Multi-Platform Support",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
      
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1.5">
              <Zap className="w-3 h-3 mr-1" />
              AI-Powered Voice Technology
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
              <span className="text-foreground">AI Video Voice</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Language Converter
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Transform any video into any language with our advanced AI-powered voice dubbing platform. 
              Support for 200+ languages with natural-sounding voices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link href="/convert">
                <Button size="lg" className="gap-2 w-full sm:w-auto" data-testid="button-start-converting">
                  Start Converting
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto" data-testid="button-watch-demo">
                <Play className="w-4 h-4" />
                Watch Demo
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {trustBadges.map((badge) => (
                <div key={badge} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-1">
              <div className="rounded-xl bg-card border border-card-border overflow-hidden">
                <div className="aspect-video relative bg-gradient-to-br from-primary/10 to-primary/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                          <Globe className="w-12 h-12 text-primary" />
                        </div>
                        <motion.div
                          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Mic2 className="w-4 h-4 text-primary-foreground" />
                        </motion.div>
                      </div>
                      <div className="text-center px-4">
                        <p className="font-medium text-foreground">Video Transformation</p>
                        <p className="text-sm text-muted-foreground">Any language, any video</p>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div
                    className="absolute bottom-4 left-4 right-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-border">
                      <Languages className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground">Converting to</div>
                        <div className="text-sm font-medium">Spanish, French, German...</div>
                      </div>
                      <Badge variant="secondary" className="text-xs">Live</Badge>
                    </div>
                  </motion.div>
                </div>

                <div className="p-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm text-muted-foreground">AI Processing Active</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {["AR", "ES", "FR", "DE", "JA"].map((lang, i) => (
                        <div
                          key={lang}
                          className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium"
                          style={{ marginLeft: i > 0 ? "-8px" : 0 }}
                        >
                          {lang}
                        </div>
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">+195</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-3xl" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 lg:mt-24"
        >
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
