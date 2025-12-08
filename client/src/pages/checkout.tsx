import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Shield, Clock, CreditCard, Info } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { pricingPlans, TRANSACTION_FEE_PERCENT } from "@shared/schema";
import PayPalButton from "@/components/PayPalButton";
import StripePaymentButton from "@/components/StripePaymentButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiPaypal } from "react-icons/si";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [isAnnual, setIsAnnual] = useState(false);
  const [step, setStep] = useState<"review" | "payment">("review");
  
  const params = new URLSearchParams(window.location.search);
  const planId = params.get("plan") || "creator";
  const billingParam = params.get("billing");
  
  useEffect(() => {
    if (billingParam === "annual") {
      setIsAnnual(true);
    }
  }, [billingParam]);

  const plan = pricingPlans.find((p) => p.id === planId);

  if (!plan || plan.id === "free") {
    setLocation("/pricing");
    return null;
  }

  const basePrice = isAnnual ? (plan.priceAnnual || plan.price) : plan.price;
  const billingPeriod = isAnnual ? "year" : "month";
  const totalForPeriod = isAnnual && 'annualTotal' in plan && plan.annualTotal ? plan.annualTotal : basePrice;
  const transactionFee = Number(((totalForPeriod || 0) * TRANSACTION_FEE_PERCENT / 100).toFixed(2));
  const totalAmount = Number(((totalForPeriod || 0) + transactionFee).toFixed(2));

  const handleContinueToPayment = () => {
    setStep("payment");
  };

  const handleBack = () => {
    if (step === "payment") {
      setStep("review");
    } else {
      setLocation("/pricing");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6 gap-2"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === "payment" ? "Back to Review" : "Back to Pricing"}
          </Button>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "review" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                1
              </div>
              <span className={step === "review" ? "font-medium" : "text-muted-foreground"}>
                Review Order
              </span>
            </div>
            <div className="flex-1 h-px bg-border" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                2
              </div>
              <span className={step === "payment" ? "font-medium" : "text-muted-foreground"}>
                Payment
              </span>
            </div>
          </div>

          {step === "review" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Review Your Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start justify-between gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{plan.name} Plan</h3>
                        {'popular' in plan && plan.popular && (
                          <Badge variant="default">Most Popular</Badge>
                        )}
                      </div>
                      {'description' in plan && (
                        <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                      )}
                      <ul className="space-y-1.5">
                        {plan.features.slice(0, 5).map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                        {plan.features.length > 5 && (
                          <li className="text-sm text-muted-foreground">
                            +{plan.features.length - 5} more features
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Billing Cycle</p>
                        <p className="text-sm text-muted-foreground">
                          {isAnnual ? "Billed annually" : "Billed monthly"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Label htmlFor="billing-toggle" className="text-sm">Monthly</Label>
                      <Switch
                        id="billing-toggle"
                        checked={isAnnual}
                        onCheckedChange={setIsAnnual}
                        data-testid="switch-billing-toggle"
                      />
                      <Label htmlFor="billing-toggle" className="text-sm">
                        Annual
                        {'savings' in plan && plan.savings && (
                          <Badge variant="secondary" className="ml-2">
                            {plan.savings}
                          </Badge>
                        )}
                      </Label>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>{plan.name} Plan ({isAnnual ? "Annual" : "Monthly"})</span>
                      <span>${totalForPeriod.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        Transaction Fee ({TRANSACTION_FEE_PERCENT}%)
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-xs">
                              A small processing fee to cover payment gateway costs
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </span>
                      <span>${transactionFee.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${totalAmount.toFixed(2)} / {billingPeriod}</span>
                    </div>
                    {isAnnual && (
                      <p className="text-sm text-muted-foreground text-right">
                        That's ${(totalAmount / 12).toFixed(2)}/month
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {'features' in plan && plan.features.some(f => f.includes('money-back')) 
                        ? plan.features.find(f => f.includes('money-back'))
                        : "Cancel anytime. No hidden fees."}
                    </p>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleContinueToPayment}
                    data-testid="button-continue-payment"
                  >
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Complete Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{plan.name} Plan</span>
                      <Badge variant="secondary">{isAnnual ? "Annual" : "Monthly"}</Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${totalForPeriod.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transaction Fee ({TRANSACTION_FEE_PERCENT}%)</span>
                        <span>${transactionFee.toFixed(2)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Choose Payment Method</span>
                    </div>
                    
                    <Tabs defaultValue="card" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="card" className="gap-2" data-testid="tab-card">
                          <CreditCard className="w-4 h-4" />
                          Credit Card
                        </TabsTrigger>
                        <TabsTrigger value="paypal" className="gap-2" data-testid="tab-paypal">
                          <SiPaypal className="w-4 h-4" />
                          PayPal
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="card" className="mt-4">
                        <div className="p-4 border rounded-lg space-y-3">
                          <p className="text-sm text-muted-foreground mb-3">
                            Pay securely with your credit or debit card
                          </p>
                          <StripePaymentButton
                            planId={plan.id}
                            isAnnual={isAnnual}
                            onSuccess={() => {
                              setLocation("/convert?subscribed=true");
                            }}
                          />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="paypal" className="mt-4">
                        <div className="p-4 border rounded-lg">
                          <p className="text-sm text-muted-foreground mb-3">
                            Pay securely with your PayPal account
                          </p>
                          <PayPalButton
                            amount={totalAmount.toFixed(2)}
                            currency="USD"
                            intent="CAPTURE"
                          />
                        </div>
                      </TabsContent>
                    </Tabs>

                    <p className="text-xs text-center text-muted-foreground">
                      By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                      Your subscription will automatically renew until cancelled.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span>SSL Secured</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="w-4 h-4" />
                      <span>Money-back Guarantee</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Cancel Anytime</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
