import { useState, useEffect } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StripePaymentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

function StripePaymentForm({ onSuccess, onCancel }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout?success=true`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment failed",
          description: error.message || "Something went wrong with your payment.",
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast({
          title: "Payment successful!",
          description: "Your subscription has been activated.",
        });
        onSuccess();
      }
    } catch (err: any) {
      toast({
        title: "Payment error",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isProcessing}
          data-testid="button-cancel-stripe"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={!stripe || isProcessing}
          data-testid="button-pay-stripe"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Pay Now"
          )}
        </Button>
      </div>
    </form>
  );
}

interface StripePaymentButtonProps {
  planId: string;
  isAnnual: boolean;
  onSuccess?: () => void;
}

export default function StripePaymentButton({ planId, isAnnual, onSuccess }: StripePaymentButtonProps) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/stripe/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.configured && data.publishableKey) {
          setStripePromise(loadStripe(data.publishableKey));
        } else {
          setError("Stripe is not configured");
        }
      })
      .catch((err) => {
        console.error("Failed to load Stripe config:", err);
        setError("Failed to load payment system");
      });
  }, []);

  const handlePayWithCard = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, isAnnual }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        toast({
          title: "Payment setup failed",
          description: data.error,
          variant: "destructive",
        });
      } else if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowForm(true);
      }
    } catch (err: any) {
      setError("Failed to initialize payment");
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setClientSecret(null);
    onSuccess?.();
  };

  const handleCancel = () => {
    setShowForm(false);
    setClientSecret(null);
  };

  if (error && !showForm) {
    return (
      <div className="text-center p-4 text-muted-foreground text-sm">
        Credit card payments are not available. Please use PayPal.
      </div>
    );
  }

  if (showForm && clientSecret && stripePromise) {
    return (
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#6366f1",
              borderRadius: "8px",
            },
          },
        }}
      >
        <StripePaymentForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </Elements>
    );
  }

  return (
    <Button
      onClick={handlePayWithCard}
      disabled={isLoading || !stripePromise}
      className="w-full"
      variant="outline"
      data-testid="button-pay-card"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading...
        </>
      ) : (
        "Pay with Credit Card"
      )}
    </Button>
  );
}
