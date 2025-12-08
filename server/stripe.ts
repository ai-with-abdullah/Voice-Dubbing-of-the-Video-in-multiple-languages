import Stripe from "stripe";
import type { Request, Response } from "express";
import { pricingPlans, TRANSACTION_FEE_PERCENT } from "../shared/schema";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function createPaymentIntent(req: Request, res: Response) {
  try {
    const { planId, isAnnual = false } = req.body;

    if (!planId || typeof planId !== "string") {
      return res.status(400).json({ error: "Plan ID is required" });
    }

    const plan = pricingPlans.find(p => p.id === planId);
    if (!plan) {
      return res.status(400).json({ error: "Invalid plan selected" });
    }

    if (plan.price === 0) {
      return res.status(400).json({ error: "Cannot create payment for free plan" });
    }

    if (!stripe) {
      return res.status(500).json({ 
        error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables." 
      });
    }

    const totalForPeriod = isAnnual ? plan.price * 12 : plan.price;
    const transactionFee = totalForPeriod * (TRANSACTION_FEE_PERCENT / 100);
    const totalAmount = totalForPeriod + transactionFee;
    const amountInCents = Math.round(totalAmount * 100);

    if (amountInCents < 50) {
      return res.status(400).json({ error: "Amount must be at least $0.50" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        planId: plan.id,
        planName: plan.name,
        isAnnual: isAnnual.toString(),
        basePrice: plan.price.toString(),
        totalAmount: totalAmount.toFixed(2),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      calculatedAmount: totalAmount.toFixed(2),
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: error.message || "Failed to create payment intent" });
  }
}

export async function getStripeConfig(req: Request, res: Response) {
  const publishableKey = process.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    return res.status(500).json({ 
      error: "Stripe publishable key not configured",
      configured: false
    });
  }

  res.json({
    publishableKey,
    configured: true,
  });
}

export function isStripeConfigured(): boolean {
  return !!(process.env.STRIPE_SECRET_KEY && process.env.VITE_STRIPE_PUBLISHABLE_KEY);
}
