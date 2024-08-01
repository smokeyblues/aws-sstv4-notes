import { useState } from "react";
import { API } from "aws-amplify";
import { onError } from "../lib/errorLib";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { BillingForm } from "./BillingForm";
import config from "../config";
import "./PlanPicker.css";

const stripePromise = loadStripe(config.STRIPE_KEY);

const plans = [
  { name: "Basic", monthlyPriceId: "price_monthly_basic", annualPriceId: "price_annual_basic", monthlyPrice: 9.99, annualPrice: 99.99 },
  { name: "Pro", monthlyPriceId: "price_monthly_pro", annualPriceId: "price_annual_pro", monthlyPrice: 19.99, annualPrice: 199.99 },
  { name: "Enterprise", monthlyPriceId: "price_monthly_enterprise", annualPriceId: "price_annual_enterprise", monthlyPrice: 49.99, annualPrice: 499.99 },
];

export default function PlanPicker() {
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [isAnnual, setIsAnnual] = useState(false);

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
  };

  const handleBillingCycleChange = (event) => {
    setIsAnnual(event.target.checked);
  };

  const handleFormSubmit: BillingFormType["onSubmit"] = async (token, error) => {
    if (error) {
      onError(error);
      return;
    }

    setIsLoading(true);

    try {
      // Add the payment method to the customer
      await API.post("users", "/users/add-payment-method", {
        body: { token: token?.id },
      });

      // Create the subscription
      await API.post("users", "/users/create-subscription", {
        body: { 
          planName: selectedPlan.name,
          isAnnual: isAnnual,
        },
      });

      alert("Your subscription has been created successfully!");
      nav("/");
    } catch (e) {
      onError(e);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="PlanPicker">
      <h2>Choose Your Plan</h2>
      <div className="plans">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`plan ${selectedPlan.name === plan.name ? "selected" : ""}`}
            onClick={() => handlePlanChange(plan)}
          >
            <h3>{plan.name}</h3>
            <p>{isAnnual ? `$${plan.annualPrice}/year` : `$${plan.monthlyPrice}/month`}</p>
          </div>
        ))}
      </div>
      <div className="billing-cycle">
        <label>
          <input
            type="checkbox"
            checked={isAnnual}
            onChange={handleBillingCycleChange}
          />
          Bill annually (save 17%)
        </label>
      </div>
      <Elements
        stripe={stripePromise}
        options={{
          fonts: [
            {
              cssSrc:
                "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800",
            },
          ],
        }}
      >
        <BillingForm 
          isLoading={isLoading}
          planName={selectedPlan.name}
          isAnnual={isAnnual}
          onSubmit={handleFormSubmit}
        />
      </Elements>
    </div>
  );
}