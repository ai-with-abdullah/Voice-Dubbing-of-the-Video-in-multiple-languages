import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Newspaper,
  Clock,
  ArrowRight,
  Sparkles,
  Globe,
  Mic2,
  Video,
  TrendingUp,
  Users,
} from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "The Future of AI Voice Dubbing: What to Expect in 2025",
    excerpt: "Discover how artificial intelligence is revolutionizing video content localization and what advancements we can expect in the coming year.",
    category: "Industry Trends",
    readTime: "5 min read",
    date: "Dec 5, 2024",
    icon: TrendingUp,
    featured: true,
  },
  {
    id: 2,
    title: "How Content Creators Are Reaching Global Audiences",
    excerpt: "Learn how YouTubers, educators, and businesses are using AI dubbing to expand their reach to international markets.",
    category: "Success Stories",
    readTime: "4 min read",
    date: "Dec 3, 2024",
    icon: Users,
    featured: true,
  },
  {
    id: 3,
    title: "Getting Started with Voice Cloning Technology",
    excerpt: "A comprehensive guide to understanding and using voice cloning for natural-sounding translations that preserve speaker identity.",
    category: "Tutorials",
    readTime: "6 min read",
    date: "Nov 28, 2024",
    icon: Mic2,
    featured: false,
  },
  {
    id: 4,
    title: "Breaking Language Barriers in Education",
    excerpt: "How educational institutions are using AI dubbing to make learning materials accessible to students worldwide.",
    category: "Use Cases",
    readTime: "4 min read",
    date: "Nov 25, 2024",
    icon: Globe,
    featured: false,
  },
  {
    id: 5,
    title: "Best Practices for Video Localization",
    excerpt: "Tips and strategies for creating high-quality dubbed content that resonates with international audiences.",
    category: "Tutorials",
    readTime: "7 min read",
    date: "Nov 20, 2024",
    icon: Video,
    featured: false,
  },
  {
    id: 6,
    title: "Introducing Word-Level Subtitle Synchronization",
    excerpt: "Our latest feature brings pixel-perfect subtitle timing with word-by-word accuracy for the best viewing experience.",
    category: "Product Updates",
    readTime: "3 min read",
    date: "Nov 15, 2024",
    icon: Sparkles,
    featured: false,
  },
];

const categories = [
  { name: "All Posts", count: blogPosts.length },
  { name: "Tutorials", count: blogPosts.filter(p => p.category === "Tutorials").length },
  { name: "Product Updates", count: blogPosts.filter(p => p.category === "Product Updates").length },
  { name: "Industry Trends", count: blogPosts.filter(p => p.category === "Industry Trends").length },
  { name: "Use Cases", count: blogPosts.filter(p => p.category === "Use Cases").length },
];

export default function Blog() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Blog - AI Voice Technology Insights & Updates"
        description="Stay updated with the latest in AI voice technology, video dubbing tutorials, product updates, and success stories from the Dubbio community."
        keywords="AI voice blog, video dubbing news, translation technology, voice cloning updates"
      />
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
                <Newspaper className="w-3 h-3" />
                Blog
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Insights & Updates
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Stay up-to-date with the latest in AI voice technology, tutorials, 
                product updates, and success stories from our community.
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((category) => (
                <Badge
                  key={category.name}
                  variant={category.name === "All Posts" ? "default" : "secondary"}
                  className="cursor-pointer"
                >
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover-elevate cursor-pointer" data-testid={`card-blog-featured-${post.id}`}>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="gap-1">
                          <post.icon className="w-3 h-3" />
                          {post.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <CardTitle className="text-xl leading-tight">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{post.date}</span>
                        <Button variant="ghost" size="sm" className="gap-1" data-testid={`button-read-more-${post.id}`}>
                          Read More
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover-elevate cursor-pointer" data-testid={`card-blog-${post.id}`}>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{post.date}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="gap-2" data-testid="button-load-more">
                Load More Articles
                <ArrowRight className="w-4 h-4" />
              </Button>
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
                Subscribe to Our Newsletter
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Get the latest articles, tutorials, and product updates delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  data-testid="input-blog-email"
                />
                <Button className="gap-2" data-testid="button-blog-subscribe">
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
