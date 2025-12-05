import {
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  MessageCircle,
  Send,
  Share2,
  Check,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  compact?: boolean;
}

const socialPlatforms = [
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "#1877F2",
    getUrl: (url: string, title: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
  },
  {
    id: "twitter",
    name: "Twitter/X",
    icon: Twitter,
    color: "#1DA1F2",
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "#0A66C2",
    getUrl: (url: string, title: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: MessageCircle,
    color: "#25D366",
    getUrl: (url: string, title: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: Send,
    color: "#0088CC",
    getUrl: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
];

export function SocialShareButtons({
  url,
  title,
  description,
  compact = false,
}: SocialShareButtonsProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: (typeof socialPlatforms)[number]) => {
    const shareUrl = platform.getUrl(url, title);
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The share link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2" data-testid="button-share">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Share to</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {socialPlatforms.map((platform) => (
            <DropdownMenuItem
              key={platform.id}
              onClick={() => handleShare(platform)}
              className="gap-2"
              data-testid={`button-share-${platform.id}`}
            >
              <platform.icon className="w-4 h-4" />
              {platform.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyToClipboard} className="gap-2" data-testid="button-copy-link">
            {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Share:</span>
      {socialPlatforms.map((platform) => (
        <Button
          key={platform.id}
          variant="outline"
          size="icon"
          onClick={() => handleShare(platform)}
          className="hover-elevate"
          data-testid={`button-share-${platform.id}`}
          aria-label={`Share on ${platform.name}`}
        >
          <platform.icon className="w-4 h-4" />
        </Button>
      ))}
      <Button
        variant="outline"
        size="icon"
        onClick={copyToClipboard}
        className="hover-elevate"
        data-testid="button-copy-link"
        aria-label="Copy link"
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      </Button>
    </div>
  );
}
