import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Cookie, Calendar, Mail, Settings } from "lucide-react";

const cookieTypes = [
  {
    name: "Essential Cookies",
    description: "These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions made by you, such as setting your privacy preferences, logging in, or filling in forms.",
    examples: [
      { name: "session_id", purpose: "Maintains your login session", duration: "Session" },
      { name: "csrf_token", purpose: "Prevents cross-site request forgery", duration: "Session" },
      { name: "cookie_consent", purpose: "Stores your cookie preferences", duration: "1 year" },
    ],
    required: true,
  },
  {
    name: "Functional Cookies",
    description: "These cookies enable personalized features and functionality. They may be set by us or by third-party providers whose services we have added to our pages.",
    examples: [
      { name: "theme_preference", purpose: "Remembers your dark/light mode choice", duration: "1 year" },
      { name: "language", purpose: "Stores your language preference", duration: "1 year" },
      { name: "recent_projects", purpose: "Remembers your recent video projects", duration: "30 days" },
    ],
    required: false,
  },
  {
    name: "Analytics Cookies",
    description: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular.",
    examples: [
      { name: "_ga", purpose: "Google Analytics - distinguishes users", duration: "2 years" },
      { name: "_gid", purpose: "Google Analytics - distinguishes users", duration: "24 hours" },
      { name: "_gat", purpose: "Google Analytics - throttles request rate", duration: "1 minute" },
    ],
    required: false,
  },
  {
    name: "Marketing Cookies",
    description: "These cookies may be set through our site by our advertising partners. They may be used to build a profile of your interests and show you relevant adverts on other sites.",
    examples: [
      { name: "_fbp", purpose: "Facebook - tracks visits across websites", duration: "3 months" },
      { name: "_gcl_au", purpose: "Google Ads - conversion tracking", duration: "3 months" },
    ],
    required: false,
  },
];

const sections = [
  {
    title: "What Are Cookies?",
    content: `Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.

Cookies can be "persistent" or "session" cookies:
- Persistent cookies remain on your device after you close your browser
- Session cookies are deleted when you close your browser

We use both types of cookies on our platform to provide you with the best possible experience.`,
  },
  {
    title: "How We Use Cookies",
    content: `We use cookies for the following purposes:

- Authentication: To keep you signed in to your account
- Preferences: To remember your settings and preferences
- Security: To protect your account and prevent fraud
- Analytics: To understand how visitors use our website
- Performance: To optimize our services and load times
- Marketing: To deliver relevant advertisements (with your consent)

We do not use cookies to collect personally identifiable information beyond what is necessary for these purposes.`,
  },
  {
    title: "Third-Party Cookies",
    content: `Some cookies on our site are set by third-party services. These include:

- Google Analytics: For understanding website usage
- Google Cloud: For service delivery and security
- Payment Providers: For secure payment processing
- Social Media: For sharing features (when you choose to use them)

These third parties may use their own cookies according to their privacy policies. We encourage you to review their policies for more information.`,
  },
  {
    title: "Managing Your Cookie Preferences",
    content: `You have several options for managing cookies:

Browser Settings: Most browsers allow you to control cookies through their settings. You can:
- Block all cookies
- Accept only first-party cookies
- Delete cookies when you close your browser
- Clear existing cookies

Our Cookie Settings: Use our cookie preference center (accessible via the cookie banner or settings) to customize which non-essential cookies you accept.

Please note that blocking essential cookies may prevent you from using certain features of our service.`,
  },
  {
    title: "Do Not Track Signals",
    content: `Some browsers include a "Do Not Track" (DNT) feature that signals to websites you visit that you do not want to be tracked. Our website currently does not respond to DNT signals.

However, you can opt out of tracking by adjusting your cookie preferences or using browser extensions designed to limit tracking.`,
  },
  {
    title: "Updates to This Policy",
    content: `We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons.

When we make changes, we will update the "Last Updated" date at the top of this policy. We encourage you to review this policy periodically.`,
  },
  {
    title: "Contact Us",
    content: `If you have questions about our use of cookies or other tracking technologies, please contact us:

Email: privacy@dubbio.ai
Support: support@dubbio.ai

You may also visit our Privacy Policy for more information about how we handle your personal data.`,
  },
];

export default function Cookies() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Cookie Policy"
        description="Learn about how Dubbio uses cookies and similar technologies to provide, protect, and improve our AI video dubbing services."
        keywords="Dubbio cookie policy, website cookies, tracking technologies, cookie preferences"
      />
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-4xl px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <Badge variant="secondary" className="mb-4 gap-1">
                <Cookie className="w-3 h-3" />
                Legal
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Cookie Policy
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                This policy explains how we use cookies and similar technologies 
                to provide, protect, and improve our services.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Last Updated: December 1, 2024</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-4xl px-4 lg:px-8">
            <div className="space-y-8 mb-16">
              {sections.slice(0, 2).map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                        {section.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-4 gap-1">
                  <Settings className="w-3 h-3" />
                  Cookie Categories
                </Badge>
                <h2 className="text-2xl font-bold mb-4">Types of Cookies We Use</h2>
                <p className="text-muted-foreground">
                  Below is a detailed breakdown of the cookies used on our platform.
                </p>
              </div>

              <div className="space-y-6">
                {cookieTypes.map((type, index) => (
                  <motion.div
                    key={type.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <CardTitle className="text-lg">{type.name}</CardTitle>
                          <Badge variant={type.required ? "default" : "secondary"}>
                            {type.required ? "Required" : "Optional"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{type.description}</p>
                        <div className="bg-muted/50 rounded-md overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="text-left p-3 font-medium">Cookie Name</th>
                                <th className="text-left p-3 font-medium">Purpose</th>
                                <th className="text-left p-3 font-medium">Duration</th>
                              </tr>
                            </thead>
                            <tbody>
                              {type.examples.map((cookie) => (
                                <tr key={cookie.name} className="border-b border-border last:border-0">
                                  <td className="p-3 font-mono text-xs">{cookie.name}</td>
                                  <td className="p-3 text-muted-foreground">{cookie.purpose}</td>
                                  <td className="p-3 text-muted-foreground">{cookie.duration}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="space-y-8">
              {sections.slice(2).map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                        {section.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Questions about cookies?</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Contact our privacy team at privacy@dubbio.ai
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    <span className="text-muted-foreground">|</span>
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>
                    <span className="text-muted-foreground">|</span>
                    <Link href="/support" className="text-primary hover:underline">
                      Contact Support
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
