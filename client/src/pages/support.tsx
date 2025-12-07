import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Headphones,
  Mail,
  MessageSquare,
  Clock,
  BookOpen,
  ArrowRight,
  Send,
  CheckCircle2,
  HelpCircle,
  Zap,
  Shield,
} from "lucide-react";

const supportOptions = [
  {
    title: "Documentation",
    description: "Browse our comprehensive guides and tutorials.",
    icon: BookOpen,
    href: "/docs",
    action: "View Docs",
  },
  {
    title: "Email Support",
    description: "Get help from our support team within 24 hours.",
    icon: Mail,
    href: "#contact",
    action: "Send Email",
  },
  {
    title: "Live Chat",
    description: "Chat with our team for immediate assistance.",
    icon: MessageSquare,
    href: "#contact",
    action: "Start Chat",
  },
];

const popularTopics = [
  {
    title: "Getting Started",
    description: "Learn how to upload and convert your first video.",
    icon: Zap,
  },
  {
    title: "Billing & Subscriptions",
    description: "Manage your plan, payments, and invoices.",
    icon: Shield,
  },
  {
    title: "Troubleshooting",
    description: "Common issues and how to resolve them.",
    icon: HelpCircle,
  },
];

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  subject: z.string().optional(),
  category: z.string().optional(),
  message: z.string().min(1, "Message is required").min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Support() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Support Center - Get Help"
        description="Get help with Dubbio's AI video dubbing platform. Browse documentation, contact our support team, or start a live chat for immediate assistance."
        keywords="Dubbio support, customer service, help center, contact support, video dubbing help"
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
                <Headphones className="w-3 h-3" />
                Support Center
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                How Can We Help?
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our team is here to help you succeed. Browse our resources or 
                reach out directly for personalized assistance.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {supportOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {option.href.startsWith("/") ? (
                    <Link href={option.href}>
                      <Card className="h-full hover-elevate cursor-pointer text-center" data-testid={`card-support-${option.title.toLowerCase().replace(" ", "-")}`}>
                        <CardHeader>
                          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <option.icon className="w-6 h-6 text-primary" />
                          </div>
                          <CardTitle className="text-lg">{option.title}</CardTitle>
                          <CardDescription>{option.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="gap-2" data-testid={`button-support-${option.title.toLowerCase().replace(" ", "-")}`}>
                            {option.action}
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ) : (
                    <a href={option.href}>
                      <Card className="h-full hover-elevate cursor-pointer text-center" data-testid={`card-support-${option.title.toLowerCase().replace(" ", "-")}`}>
                        <CardHeader>
                          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <option.icon className="w-6 h-6 text-primary" />
                          </div>
                          <CardTitle className="text-lg">{option.title}</CardTitle>
                          <CardDescription>{option.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="gap-2" data-testid={`button-support-${option.title.toLowerCase().replace(" ", "-")}`}>
                            {option.action}
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Popular Help Topics</h2>
              <p className="text-muted-foreground">
                Quick answers to common questions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {popularTopics.map((topic, index) => (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full" data-testid={`card-topic-${topic.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <topic.icon className="w-5 h-5 text-primary" />
                        <CardTitle className="text-base">{topic.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{topic.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-12 md:py-16 bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-4 gap-1">
                  <Send className="w-3 h-3" />
                  Contact Us
                </Badge>
                <h2 className="text-2xl font-bold mb-4">Send Us a Message</h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Your name" 
                                  {...field} 
                                  data-testid="input-contact-name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="your@email.com" 
                                  {...field} 
                                  data-testid="input-contact-email"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Brief description" 
                                  {...field} 
                                  data-testid="input-contact-subject"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-contact-category">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="general">General Inquiry</SelectItem>
                                  <SelectItem value="technical">Technical Support</SelectItem>
                                  <SelectItem value="billing">Billing & Payments</SelectItem>
                                  <SelectItem value="feature">Feature Request</SelectItem>
                                  <SelectItem value="bug">Bug Report</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your issue or question in detail..."
                                rows={5}
                                {...field}
                                data-testid="textarea-contact-message"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full gap-2"
                        disabled={form.formState.isSubmitting}
                        data-testid="button-contact-submit"
                      >
                        {form.formState.isSubmitting ? (
                          <>Processing...</>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <div className="mt-8 text-center">
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Response within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Priority support for paid plans</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
