import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { getBlogPostBySlug, blogPosts } from "@/data/blogPosts";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist.
            </p>
            <Link href="/blog">
              <Button className="gap-2" data-testid="button-back-to-blog">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentIndex = blogPosts.findIndex(p => p.id === post.id);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={`${post.title} - Dubbio Blog`}
        description={post.excerpt}
        keywords={`${post.category}, AI voice dubbing, video translation`}
      />
      <Header />
      <main className="flex-1">
        <article className="py-12 md:py-20">
          <div className="mx-auto max-w-4xl px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/blog">
                <Button variant="ghost" className="mb-8 gap-2" data-testid="button-back-to-blog">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Button>
              </Link>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge variant="secondary" className="gap-1">
                  <post.icon className="w-3 h-3" />
                  {post.category}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
                <span className="text-sm text-muted-foreground">{post.date}</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                {post.excerpt}
              </p>

              <div 
                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-ul:my-4 prose-ul:text-muted-foreground
                  prose-li:my-1
                  prose-ol:my-4 prose-ol:text-muted-foreground"
                data-testid="blog-post-content"
              >
                {post.content.split('\n').map((line, index) => {
                  const trimmedLine = line.trim();
                  
                  if (trimmedLine.startsWith('## ')) {
                    return <h2 key={index}>{trimmedLine.replace('## ', '')}</h2>;
                  }
                  if (trimmedLine.startsWith('### ')) {
                    return <h3 key={index}>{trimmedLine.replace('### ', '')}</h3>;
                  }
                  if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                    return <p key={index}><strong>{trimmedLine.replace(/\*\*/g, '')}</strong></p>;
                  }
                  if (trimmedLine.startsWith('- ')) {
                    return <li key={index}>{trimmedLine.replace('- ', '')}</li>;
                  }
                  if (/^\d+\.\s/.test(trimmedLine)) {
                    return <li key={index}>{trimmedLine.replace(/^\d+\.\s/, '')}</li>;
                  }
                  if (trimmedLine === '') {
                    return null;
                  }
                  return <p key={index}>{trimmedLine}</p>;
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-16 pt-8 border-t border-border"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                {prevPost ? (
                  <Link href={`/blog/${prevPost.slug}`}>
                    <Button variant="outline" className="gap-2 w-full sm:w-auto" data-testid="button-prev-post">
                      <ArrowLeft className="w-4 h-4" />
                      Previous Article
                    </Button>
                  </Link>
                ) : (
                  <div />
                )}
                {nextPost && (
                  <Link href={`/blog/${nextPost.slug}`}>
                    <Button variant="outline" className="gap-2 w-full sm:w-auto" data-testid="button-next-post">
                      Next Article
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>

            {relatedPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-16"
              >
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                      <Card className="h-full hover-elevate cursor-pointer" data-testid={`card-related-${relatedPost.id}`}>
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {relatedPost.category}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg leading-tight">{relatedPost.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
