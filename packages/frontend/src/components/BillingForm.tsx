// BillingForm.tsx
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import LoaderButton from "../components/LoaderButton";
import "./BillingForm.css";

export interface BillingFormType {
  isLoading: boolean;
  planName: string;
  isAnnual: boolean;
  onSubmit: (
    setupIntent: string
  ) => Promise<void>;
}

export function BillingForm({ isLoading, planName, isAnnual, onSubmit }: BillingFormType) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const result = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/subscription-confirmed`,
      },
    });

    if (result.error) {
      alert(result.error.message);
      setIsProcessing(false);
    } else {
      // The SetupIntent was confirmed successfully
      onSubmit(result.setupIntent.id);
    }
  }

  return (
    <Form className="BillingForm" onSubmit={handleSubmit}>
      <PaymentElement />
      <LoaderButton
        block
        size="lg"
        type="submit"
        isLoading={isLoading || isProcessing}
        disabled={!stripe || !elements}
      >
        Subscribe to {planName} Plan ({isAnnual ? 'Annual' : 'Monthly'})
      </LoaderButton>
    </Form>
  );
}