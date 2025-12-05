import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, CreditCard } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { pricingPlans } from "@shared/schema";
import { isExpoMode } from "@/lib/config";
import PayPalButton from "@/components/PayPalButton";

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  if (isExpoMode()) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Pricing</h1>
            <p className="text-muted-foreground">
              Pricing is disabled in expo mode. All features are unlocked for demonstration.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSelectPlan = (planId: string) => {
    if (planId === "free") {
      window.location.href = "/convert";
      return;
    }
    setSelectedPlan(planId);
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Simple Pricing
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start for free or upgrade to Pro for unlimited video conversions and
              premium voice cloning technology.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`relative h-full ${
                    plan.id === "pro" ? "border-primary shadow-lg" : ""
                  }`}
                >
                  {plan.id === "pro" && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="gap-1">
                        <Zap className="w-3 h-3" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>
                      {plan.id === "free"
                        ? "Perfect for trying out"
                        : "For power users and creators"}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-5xl font-bold">${plan.price}</span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pb-6">
                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full"
                      size="lg"
                      variant={plan.id === "pro" ? "default" : "outline"}
                      onClick={() => handleSelectPlan(plan.id)}
                      data-testid={`button-select-${plan.id}`}
                    >
                      {plan.id === "free" ? "Get Started Free" : "Upgrade to Pro"}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Secure payment via PayPal
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              All plans include SSL security, automatic file cleanup, and 24/7 availability.
              <br />
              Cancel anytime. No hidden fees.
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              Subscribe to the Pro plan for $10/month and unlock all features.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="p-4 bg-muted rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <span className="font-medium">Pro Plan</span>
                <span className="text-lg font-bold">$10/month</span>
              </div>
            </div>
            <PayPalButton
              amount="10.00"
              currency="USD"
              intent="CAPTURE"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
