import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "Email Sent",
          description: "Check your inbox for password reset instructions",
        });
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to send reset email",
          variant: "destructive",
        });
      }
    } catch {
      setIsSubmitted(true);
      toast({
        title: "Email Sent",
        description: "If an account exists with this email, you will receive reset instructions",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {isSubmitted ? "Check Your Email" : "Reset Password"}
              </CardTitle>
              <CardDescription>
                {isSubmitted
                  ? "We've sent password reset instructions to your email"
                  : "Enter your email address and we'll send you a link to reset your password"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isSubmitted ? (
                <div className="space-y-6" data-testid="container-success">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" data-testid="icon-success" />
                    </div>
                  </div>
                  <p className="text-center text-sm text-muted-foreground" data-testid="text-reset-help">
                    Didn't receive the email? Check your spam folder or{" "}
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-primary hover:underline font-medium"
                      data-testid="button-try-again"
                    >
                      try again
                    </button>
                  </p>
                  <Link href="/login">
                    <Button variant="outline" className="w-full gap-2" data-testid="button-back-to-login">
                      <ArrowLeft className="w-4 h-4" />
                      Back to Login
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        data-testid="input-forgot-email"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={isLoading}
                    data-testid="button-reset-submit"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>

                  <Link href="/login">
                    <Button variant="ghost" className="w-full gap-2" data-testid="button-back-login">
                      <ArrowLeft className="w-4 h-4" />
                      Back to Login
                    </Button>
                  </Link>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
