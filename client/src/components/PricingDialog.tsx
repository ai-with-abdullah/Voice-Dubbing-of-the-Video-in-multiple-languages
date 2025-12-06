import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { pricingPlans } from "@shared/schema";
import { isExpoMode } from "@/lib/config";

interface PricingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPlan?: (planId: string, isAnnual: boolean) => void;
}

export function PricingDialog({ open, onOpenChange, onSelectPlan }: PricingDialogProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  if (isExpoMode()) {
    return null;
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "free":
        return <Sparkles className="w-5 h-5" />;
      case "creator":
        return <Zap className="w-5 h-5" />;
      case "business":
        return <Crown className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getPrice = (plan: typeof pricingPlans[number]) => {
    if (plan.price === 0) return 0;
    return isAnnual ? (plan.priceAnnual || plan.price) : plan.price;
  };

  const getSavings = (plan: typeof pricingPlans[number]) => {
    if (plan.price === 0 || !plan.priceAnnual) return 0;
    return Math.round(((plan.price - plan.priceAnnual) / plan.price) * 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <div className="flex justify-center mb-3">
            <Badge variant="secondary" className="gap-1">
              <Users className="w-3 h-3" />
              Join 15,000+ creators worldwide
            </Badge>
          </div>
          <DialogTitle className="text-2xl lg:text-3xl">
            Choose Your Plan
          </DialogTitle>
          <DialogDescription className="text-base max-w-xl mx-auto">
            Start for free or upgrade for unlimited video conversions and premium voice cloning.
          </DialogDescription>
          
          <div className="flex items-center justify-center gap-3 pt-4">
            <Label htmlFor="billing-toggle" className={!isAnnual ? "font-semibold" : "text-muted-foreground"}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              data-testid="switch-billing-toggle"
            />
            <Label htmlFor="billing-toggle" className={isAnnual ? "font-semibold" : "text-muted-foreground"}>
              Annual
            </Label>
            {isAnnual && (
              <Badge variant="default" className="ml-2">
                Save up to 33%
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4 pt-4">
          {pricingPlans.map((plan, index) => {
            const isPopular = 'popular' in plan && plan.popular;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className={`relative h-full flex flex-col ${
                    isPopular ? "border-primary shadow-lg ring-1 ring-primary/20" : ""
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="gap-1">
                        <Zap className="w-3 h-3" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-2 pt-6">
                    <div className="flex justify-center mb-2 text-primary">
                      {getPlanIcon(plan.id)}
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {plan.id === "free" && "Perfect for trying out"}
                      {plan.id === "creator" && "For content creators"}
                      {plan.id === "business" && "For teams & agencies"}
                    </CardDescription>
                    <div className="mt-3">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-bold">
                          ${getPrice(plan)}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-muted-foreground text-sm">/month</span>
                        )}
                      </div>
                      {isAnnual && plan.price > 0 && 'annualTotal' in plan && (
                        <div className="text-xs text-muted-foreground mt-1">
                          ${plan.annualTotal}/year - Save {getSavings(plan)}%
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pb-4 flex-1">
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button
                      className="w-full"
                      variant={isPopular ? "default" : "outline"}
                      onClick={() => onSelectPlan?.(plan.id, isAnnual)}
                      data-testid={`button-select-${plan.id}`}
                    >
                      {plan.id === "free" ? "Start Free" : `Get ${plan.name}`}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center pt-4 border-t mt-4">
          <p className="text-xs text-muted-foreground">
            All plans include SSL security, automatic file cleanup, and 24/7 availability.
            <br />
            Cancel anytime. No hidden fees. 30-day money-back guarantee.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
