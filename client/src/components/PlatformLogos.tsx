import { motion } from "framer-motion";
import { supportedPlatforms } from "@shared/schema";
import {
  SiYoutube,
  SiTiktok,
  SiInstagram,
  SiFacebook,
  SiX,
  SiLinkedin,
  SiReddit,
  SiVimeo,
  SiDailymotion,
  SiTwitch,
} from "react-icons/si";

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  youtube: SiYoutube,
  tiktok: SiTiktok,
  instagram: SiInstagram,
  facebook: SiFacebook,
  twitter: SiX,
  linkedin: SiLinkedin,
  reddit: SiReddit,
  vimeo: SiVimeo,
  dailymotion: SiDailymotion,
  twitch: SiTwitch,
};

export function PlatformLogos() {
  return (
    <section className="py-12 border-y border-border bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mb-8"
        >
          Download and dub videos from all major platforms
        </motion.p>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {supportedPlatforms.map((platform, index) => {
            const Icon = platformIcons[platform.id];
            if (!Icon) return null;

            return (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${platform.color}15` }}
                >
                  <Icon
                    className="w-6 h-6 transition-colors"
                    style={{ color: platform.color }}
                  />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {platform.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
