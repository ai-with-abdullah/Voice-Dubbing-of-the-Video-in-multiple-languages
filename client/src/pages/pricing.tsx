import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Shield, Users, Star } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { pricingPlans, TRANSACTION_FEE_PERCENT } from "@shared/schema";
import { isExpoMode } from "@/lib/config";

export default function Pricing() {
  const [, setLocation] = useLocation();
  const [isAnnual, setIsAnnual] = useState(true);

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
      setLocation("/convert");
      return;
    }
    setLocation(`/checkout?plan=${planId}&billing=${isAnnual ? "annual" : "monthly"}`);
  };

  const getPrice = (plan: typeof pricingPlans[number]) => {
    if (plan.price === 0) return 0;
    return isAnnual ? (plan.priceAnnual || plan.price) : plan.price;
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "free": return Sparkles;
      case "creator": return Zap;
      case "business": return Users;
      default: return Sparkles;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4 gap-1">
              <Sparkles className="w-3 h-3" />
              Simple, Transparent Pricing
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Start for free or upgrade to unlock unlimited video conversions,
              premium voice cloning, and priority processing.
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <Label htmlFor="pricing-toggle" className={`text-sm ${!isAnnual ? 'font-medium' : 'text-muted-foreground'}`}>
                Monthly
              </Label>
              <Switch
                id="pricing-toggle"
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                data-testid="switch-pricing-toggle"
              />
              <Label htmlFor="pricing-toggle" className={`text-sm flex items-center gap-2 ${isAnnual ? 'font-medium' : 'text-muted-foreground'}`}>
                Annual
                <Badge variant="default" className="text-xs">Save up to 33%</Badge>
              </Label>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {pricingPlans.map((plan, index) => {
              const PlanIcon = getPlanIcon(plan.id);
              const price = getPrice(plan);
              const isPopular = 'popular' in plan && plan.popular;
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="gap-1 shadow-lg">
                        <Star className="w-3 h-3" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <Card
                    className={`relative h-full flex flex-col ${
                      isPopular ? "border-primary shadow-lg ring-1 ring-primary/20" : ""
                    }`}
                  >
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <PlanIcon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription>
                        {'description' in plan ? plan.description : ""}
                      </CardDescription>
                      <div className="mt-4">
                        <span className="text-5xl font-bold">
                          ${price === 0 ? "0" : price.toFixed(2)}
                        </span>
                        {price > 0 && (
                          <span className="text-muted-foreground">/month</span>
                        )}
                      </div>
                      {isAnnual && 'annualTotal' in plan && plan.annualTotal && (
                        <p className="text-sm text-muted-foreground mt-1">
                          ${plan.annualTotal.toFixed(2)} billed annually
                        </p>
                      )}
                      {'savings' in plan && plan.savings && isAnnual && (
                        <Badge variant="secondary" className="mt-2">
                          {plan.savings}
                        </Badge>
                      )}
                    </CardHeader>

                    <CardContent className="pb-6 flex-1">
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="pt-0">
                      <Button
                        className="w-full"
                        size="lg"
                        variant={isPopular ? "default" : plan.id === "business" ? "outline" : "secondary"}
                        onClick={() => handleSelectPlan(plan.id)}
                        data-testid={`button-select-${plan.id}`}
                      >
                        {plan.id === "free" ? "Start Free Trial" : `Get ${plan.name}`}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Why Choose Dubbio?</h2>
              <p className="text-muted-foreground">Trusted by creators worldwide</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">SSL encrypted via PayPal</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Instant Access</h3>
                <p className="text-sm text-muted-foreground">Start converting immediately</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">200+ Languages</h3>
                <p className="text-sm text-muted-foreground">Global reach for your content</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Money-Back Guarantee</h3>
                <p className="text-sm text-muted-foreground">Risk-free purchase</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-12 p-6 bg-muted/50 rounded-lg"
          >
            <p className="text-sm text-muted-foreground">
              All paid plans include a {TRANSACTION_FEE_PERCENT}% transaction fee at checkout.
              <br />
              Cancel anytime. No hidden fees. 24/7 availability.
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
