// subscription.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { API } from "aws-amplify";
import { loadStripe } from "@stripe/stripe-js";
import { createSubscription } from "@functions/users/createSubscription";
import { getSubscription } from "@functions/users/getSubscription";
import { updatePaymentMethod } from "@functions/src/users/updatePaymentMethod";

// Mock AWS Amplify API
vi.mock("aws-amplify");

// Mock Stripe
vi.mock("@stripe/stripe-js");

describe("Subscription Feature", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("createSubscription", () => {
    it("should create a subscription successfully", async () => {
      const mockSubscriptionData = {
        setupIntentId: "si_123",
        priceId: "price_123",
        planName: "Pro",
        isAnnual: true,
      };

      const mockResponse = {
        subscriptionId: "sub_123",
        subscriptionStatus: "active",
        planName: "Pro",
        isAnnual: true,
      };

      vi.mocked(API.post).mockResolvedValue(mockResponse);

      const result = await createSubscription(mockSubscriptionData);

      expect(result).toEqual(mockResponse);
      expect(API.post).toHaveBeenCalledWith("users", "/users/create-subscription", {
        body: mockSubscriptionData,
      });
    });

    it("should throw an error if creation fails", async () => {
      const mockSubscriptionData = {
        setupIntentId: "si_123",
        priceId: "price_123",
        planName: "Pro",
        isAnnual: true,
      };

      vi.mocked(API.post).mockRejectedValue(new Error("Subscription creation failed"));

      await expect(createSubscription(mockSubscriptionData)).rejects.toThrow("Subscription creation failed");
    });
  });

  describe("getSubscription", () => {
    it("should retrieve subscription details successfully", async () => {
      const mockSubscriptionDetails = {
        isSubscribed: true,
        subscriptionStatus: "active",
        planId: "price_123",
        planName: "Pro",
        isAnnual: true,
        currentPeriodEnd: 1234567890,
      };

      vi.mocked(API.get).mockResolvedValue(mockSubscriptionDetails);

      const result = await getSubscription();

      expect(result).toEqual(mockSubscriptionDetails);
      expect(API.get).toHaveBeenCalledWith("users", "/users/subscription", {});
    });

    it("should return isSubscribed as false if no subscription exists", async () => {
      vi.mocked(API.get).mockResolvedValue({ isSubscribed: false });

      const result = await getSubscription();

      expect(result).toEqual({ isSubscribed: false });
    });
  });

  describe("updatePaymentMethod", () => {
    it("should update payment method successfully", async () => {
      const mockSetupIntent = "seti_123";
      const mockResponse = { status: "success" };

      vi.mocked(API.post).mockResolvedValue(mockResponse);

      const result = await updatePaymentMethod(mockSetupIntent);

      expect(result).toEqual(mockResponse);
      expect(API.post).toHaveBeenCalledWith("users", "/users/update-payment-method", {
        body: { setupIntent: mockSetupIntent },
      });
    });

    it("should throw an error if update fails", async () => {
      const mockSetupIntent = "seti_123";

      vi.mocked(API.post).mockRejectedValue(new Error("Payment method update failed"));

      await expect(updatePaymentMethod(mockSetupIntent)).rejects.toThrow("Payment method update failed");
    });
  });
});