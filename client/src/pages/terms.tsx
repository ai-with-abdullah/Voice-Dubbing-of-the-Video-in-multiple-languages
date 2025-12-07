import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { FileText, Calendar, Mail } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using Dubbio's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.

These Terms of Service apply to all users of the service, including without limitation users who are browsers, customers, merchants, and contributors of content.`,
  },
  {
    title: "2. Description of Services",
    content: `Dubbio provides AI-powered video voice dubbing and translation services, including:

- Video upload and processing for voice dubbing
- AI-powered translation to over 200 languages
- Voice cloning and synthesis technology
- Subtitle generation and export
- Voice Studio for audio recording and processing

We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without prior notice.`,
  },
  {
    title: "3. User Accounts",
    content: `To access certain features of our services, you may be required to create an account. You agree to:

- Provide accurate, current, and complete information during registration
- Maintain and promptly update your account information
- Keep your password secure and confidential
- Accept responsibility for all activities that occur under your account
- Notify us immediately of any unauthorized use of your account

We reserve the right to suspend or terminate accounts that violate these terms or are inactive for extended periods.`,
  },
  {
    title: "4. User Content and Rights",
    content: `You retain all rights to the content you upload to our platform. By using our services, you grant us a limited, non-exclusive license to:

- Process your videos and audio for the purpose of providing our services
- Temporarily store your content on our servers during processing
- Generate dubbed versions and subtitles as requested

You represent and warrant that:
- You own or have the necessary rights to all content you upload
- Your content does not infringe on any third-party intellectual property rights
- Your content does not violate any applicable laws or regulations`,
  },
  {
    title: "5. Prohibited Uses",
    content: `You agree not to use our services to:

- Upload content that is illegal, harmful, threatening, abusive, or otherwise objectionable
- Infringe upon the intellectual property rights of others
- Distribute malware, viruses, or other harmful code
- Attempt to gain unauthorized access to our systems or other users' accounts
- Engage in any activity that interferes with or disrupts our services
- Use our services for any commercial purpose without authorization
- Scrape, harvest, or collect user data without consent
- Upload content depicting minors or exploitative material
- Bypass any measures we may use to prevent or restrict access to our services

Violation of these prohibited uses may result in immediate termination of your account.`,
  },
  {
    title: "6. Intellectual Property",
    content: `The Dubbio name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Dubbio or its affiliates. You may not use these marks without our prior written permission.

Our services, including their design, features, and functionality, are owned by Dubbio and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.

The AI models, algorithms, and technology used in our services remain our exclusive property and may not be copied, modified, or reverse-engineered.`,
  },
  {
    title: "7. Payment and Subscription Terms",
    content: `For paid services:

- All prices are listed in US dollars unless otherwise specified
- Subscription fees are billed in advance on a monthly or annual basis
- Annual subscriptions provide a discount but are non-refundable
- We may change our prices at any time with 30 days' notice
- Failed payments may result in service suspension
- You are responsible for all applicable taxes

Refund Policy:
- Monthly subscriptions may be cancelled at any time with no refund for the current period
- Annual subscriptions are eligible for a prorated refund within the first 14 days
- Unused credits do not carry over and are non-refundable`,
  },
  {
    title: "8. Service Availability and Modifications",
    content: `We strive to maintain service availability but do not guarantee uninterrupted access. We may:

- Perform maintenance that temporarily affects service availability
- Modify or discontinue features with or without notice
- Limit service access in certain geographic regions
- Implement usage limits to ensure fair access for all users

We are not liable for any modification, suspension, or discontinuation of services.`,
  },
  {
    title: "9. Limitation of Liability",
    content: `To the fullest extent permitted by law:

- Dubbio is provided "as is" without warranties of any kind
- We do not warrant that our services will be error-free or uninterrupted
- We are not liable for any indirect, incidental, special, or consequential damages
- Our total liability shall not exceed the amount you paid us in the past 12 months
- We are not responsible for any third-party content or services

Some jurisdictions do not allow limitations on implied warranties or liability, so some of these limitations may not apply to you.`,
  },
  {
    title: "10. Indemnification",
    content: `You agree to indemnify, defend, and hold harmless Dubbio and its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys' fees) arising from:

- Your use of our services
- Your violation of these Terms of Service
- Your violation of any third-party rights
- Any content you submit or share through our services`,
  },
  {
    title: "11. Privacy and Data Protection",
    content: `Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms of Service by reference.

By using our services, you consent to the collection, use, and sharing of your information as described in our Privacy Policy.`,
  },
  {
    title: "12. Dispute Resolution",
    content: `Any disputes arising from these Terms of Service or your use of our services shall be:

- First attempted to be resolved through informal negotiation
- If unresolved, submitted to binding arbitration
- Governed by the laws of the State of California, USA
- Subject to the exclusive jurisdiction of courts in San Francisco County

You waive any right to a jury trial or to participate in a class action lawsuit.`,
  },
  {
    title: "13. Termination",
    content: `We may terminate or suspend your access to our services immediately, without prior notice, for any reason, including:

- Violation of these Terms of Service
- Suspected fraudulent, abusive, or illegal activity
- Non-payment of fees
- Extended inactivity

Upon termination, your right to use our services will cease immediately. Provisions that by their nature should survive termination shall remain in effect.`,
  },
  {
    title: "14. Changes to Terms",
    content: `We reserve the right to modify these Terms of Service at any time. We will notify users of material changes by:

- Posting the updated terms on our website
- Sending an email to registered users
- Displaying a notice within our application

Your continued use of our services after changes take effect constitutes acceptance of the new terms.`,
  },
  {
    title: "15. Contact Information",
    content: `For questions about these Terms of Service, please contact us:

Email: legal@dubbio.ai
Support: support@dubbio.ai

We will respond to inquiries within 30 business days.`,
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Terms of Service"
        description="Read the terms and conditions for using Dubbio's AI video dubbing services. Understand your rights and responsibilities as a user."
        keywords="Dubbio terms of service, user agreement, service terms, legal terms"
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
                <FileText className="w-3 h-3" />
                Legal
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Terms of Service
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                Please read these terms carefully before using our services. 
                By using Dubbio, you agree to be bound by these terms.
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
                  transition={{ duration: 0.5, delay: index * 0.03 }}
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
                    <span className="font-semibold">Questions about these terms?</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Contact our legal team at legal@dubbio.ai
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
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
