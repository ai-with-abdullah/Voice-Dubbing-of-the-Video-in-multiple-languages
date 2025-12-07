import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

export function SEO({ 
  title, 
  description, 
  keywords,
  ogImage = "/og-image.png",
  canonical
}: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | Dubbio`;
    
    document.title = fullTitle;
    
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (meta) {
        meta.content = content;
      } else {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    updateMetaTag("description", description);
    updateMetaTag("title", fullTitle);
    if (keywords) {
      updateMetaTag("keywords", keywords);
    }
    
    updateMetaTag("og:title", fullTitle, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", ogImage, true);
    updateMetaTag("og:type", "website", true);
    
    updateMetaTag("twitter:title", fullTitle, false);
    updateMetaTag("twitter:description", description, false);
    updateMetaTag("twitter:image", ogImage, false);
    updateMetaTag("twitter:card", "summary_large_image", false);
    
    const currentPath = window.location.pathname;
    const canonicalUrl = canonical || `https://dubbio.com${currentPath}`;
    
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (link) {
      link.href = canonicalUrl;
    } else {
      link = document.createElement("link");
      link.rel = "canonical";
      link.href = canonicalUrl;
      document.head.appendChild(link);
    }
    
    updateMetaTag("og:url", canonicalUrl, true);
    updateMetaTag("twitter:url", canonicalUrl, false);

    return () => {
      document.title = "Dubbio - AI Video Voice Dubbing | Convert Videos to 200+ Languages";
      const defaultDescription = "Transform any video into any language with AI-powered voice dubbing. Support for YouTube, TikTok, Instagram, and more. Premium voice cloning technology with word-perfect subtitles.";
      updateMetaTag("description", defaultDescription);
      updateMetaTag("og:title", "Dubbio - AI Video Voice Dubbing | Convert Videos to 200+ Languages", true);
      updateMetaTag("og:description", defaultDescription, true);
      updateMetaTag("og:url", "https://dubbio.com/", true);
      updateMetaTag("twitter:title", "Dubbio - AI Video Voice Dubbing | Convert Videos to 200+ Languages", false);
      updateMetaTag("twitter:description", defaultDescription, false);
      updateMetaTag("twitter:url", "https://dubbio.com/", false);
      
      const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (canonicalLink) {
        canonicalLink.href = "https://dubbio.com/";
      }
    };
  }, [title, description, keywords, ogImage, canonical]);

  return null;
}
