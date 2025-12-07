import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, Calendar, Mail } from "lucide-react";

const sections = [
  {
    title: "Information We Collect",
    content: `We collect information you provide directly to us, including:

- Account information such as your name, email address, and password when you register
- Payment information when you subscribe to our services (processed securely by our payment providers)
- Video content you upload for processing (temporarily stored and automatically deleted after processing)
- Usage data including how you interact with our services
- Communication preferences and support inquiries

We also automatically collect certain technical information when you use our services, including your IP address, browser type, device information, and usage patterns.`,
  },
  {
    title: "How We Use Your Information",
    content: `We use the information we collect to:

- Provide, maintain, and improve our AI voice dubbing services
- Process your video conversions and deliver results
- Process transactions and send related information
- Send you technical notices, updates, and support messages
- Respond to your comments, questions, and customer service requests
- Monitor and analyze trends, usage, and activities
- Detect, investigate, and prevent fraudulent transactions and abuse
- Personalize and improve your experience with our services

We do not sell your personal information to third parties.`,
  },
  {
    title: "Video Content and Processing",
    content: `When you upload videos to our platform:

- Videos are processed on secure servers using industry-standard encryption
- Temporary files are automatically deleted within 24 hours of processing completion
- We do not store, share, or use your video content for any purpose other than providing the requested service
- AI processing is performed in isolated environments to protect your content
- You retain all rights to your original and processed video content

For premium voice cloning features, voice samples are processed in real-time and are not stored after the session ends.`,
  },
  {
    title: "Data Security",
    content: `We implement appropriate technical and organizational security measures to protect your information:

- All data transmission is encrypted using TLS/SSL protocols
- Passwords are hashed using industry-standard algorithms
- Regular security audits and vulnerability assessments
- Access controls and authentication for all systems
- Secure data centers with physical security measures
- Employee training on data protection and privacy

While we strive to protect your personal information, no method of transmission over the Internet is 100% secure.`,
  },
  {
    title: "Data Retention",
    content: `We retain your information for as long as your account is active or as needed to provide you services:

- Account data is retained until you request deletion
- Processed video files are deleted within 24 hours
- Payment records are retained as required by law (typically 7 years)
- Usage logs are retained for 90 days for security and analytics
- Support communications are retained for 2 years

You can request deletion of your data at any time by contacting our support team.`,
  },
  {
    title: "Your Rights and Choices",
    content: `Depending on your location, you may have certain rights regarding your personal information:

- Access: Request a copy of the personal information we hold about you
- Correction: Request that we correct inaccurate information
- Deletion: Request that we delete your personal information
- Portability: Request a copy of your data in a portable format
- Opt-out: Unsubscribe from marketing communications at any time
- Restrict Processing: Request limitations on how we use your data

To exercise any of these rights, please contact us at privacy@dubbio.ai.`,
  },
  {
    title: "Cookies and Tracking",
    content: `We use cookies and similar tracking technologies to:

- Keep you logged in to your account
- Remember your preferences and settings
- Analyze how our services are used
- Deliver relevant content and advertisements

You can control cookies through your browser settings. For more information, please see our Cookie Policy.`,
  },
  {
    title: "Third-Party Services",
    content: `We may share your information with third-party service providers who assist us in operating our services:

- Cloud hosting providers (Google Cloud Platform)
- Payment processors (PayPal, Stripe)
- AI service providers (Google Cloud AI, ElevenLabs)
- Analytics providers
- Customer support tools

These providers are bound by confidentiality obligations and are only permitted to use your data as necessary to provide services to us.`,
  },
  {
    title: "International Data Transfers",
    content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers, including:

- Standard contractual clauses approved by relevant authorities
- Data processing agreements with all service providers
- Compliance with applicable data protection laws

By using our services, you consent to the transfer of your information to countries that may have different data protection laws than your country of residence.`,
  },
  {
    title: "Children's Privacy",
    content: `Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of any changes by:

- Posting the new Privacy Policy on this page
- Updating the "Last Updated" date at the top of this policy
- Sending you an email notification for material changes

We encourage you to review this Privacy Policy periodically for any changes.`,
  },
  {
    title: "Contact Us",
    content: `If you have any questions about this Privacy Policy or our data practices, please contact us:

Email: privacy@dubbio.ai
Support: support@dubbio.ai

We will respond to your inquiry within 30 days.`,
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Privacy Policy"
        description="Learn how Dubbio collects, uses, and protects your personal information. Our commitment to your privacy and data security."
        keywords="Dubbio privacy policy, data protection, personal information, GDPR compliance"
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
                <Shield className="w-3 h-3" />
                Legal
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Privacy Policy
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                Your privacy is important to us. This policy explains how we collect, 
                use, and protect your personal information.
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
            <div className="space-y-8">
              {sections.map((section, index) => (
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
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                          {section.content}
                        </p>
                      </div>
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
                    <span className="font-semibold">Questions about your privacy?</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Contact our privacy team at privacy@dubbio.ai
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>
                    <span className="text-muted-foreground">|</span>
                    <Link href="/cookies" className="text-primary hover:underline">
                      Cookie Policy
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
