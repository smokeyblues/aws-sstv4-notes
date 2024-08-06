// createSubscription.ts
import Stripe from "stripe";
import { Resource } from "sst";
import { Util } from "@aws-sst-v4-notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ReturnValue } from "@aws-sdk/client-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const data = JSON.parse(event.body || "{}");
  const { setupIntentId, priceId, planName, isAnnual } = data;

  if (!setupIntentId || !priceId || !planName || isAnnual === undefined) {
    throw new Error("Missing required parameters");
  }

  const userId = event.requestContext.authorizer?.iam.cognitoIdentity.identityId;

  // Get the user's data from DynamoDB
  const getUserParams = {
    TableName: Resource.Users.name,
    Key: {
      userId: userId,
    },
  };

  const userResult = await dynamoDb.send(new GetCommand(getUserParams));
  const user = userResult.Item;

  if (!user || !user.customerId) {
    throw new Error("User not found or doesn't have a Stripe customer ID");
  }

  // Initialize Stripe
  const stripe = new Stripe(Resource.StripeSecretKey.value, {
    apiVersion: "2024-06-20",
  });

  // Retrieve the SetupIntent to get the payment method
  const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
  if (setupIntent.status !== 'succeeded' || !setupIntent.payment_method) {
    throw new Error("Invalid SetupIntent");
  }

  // Create a new subscription
  const subscription = await stripe.subscriptions.create({
    customer: user.customerId,
    items: [{ price: priceId }],
    default_payment_method: setupIntent.payment_method as string,
  });

  // Update the user data in DynamoDB
  const updateParams = {
    TableName: Resource.Users.name,
    Key: { userId: userId },
    UpdateExpression: "SET subscriptionId = :subscriptionId, subscriptionStatus = :subscriptionStatus, planName = :planName, isAnnual = :isAnnual",
    ExpressionAttributeValues: {
      ":subscriptionId": subscription.id,
      ":subscriptionStatus": subscription.status,
      ":planName": planName,
      ":isAnnual": isAnnual,
    },
    ReturnValues: "ALL_NEW" as ReturnValue,
  };

  const updatedUser = await dynamoDb.send(new UpdateCommand(updateParams));

  return JSON.stringify({
    userId: userId,
    email: user.email,
    customerId: user.customerId,
    subscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    planName: planName,
    isAnnual: isAnnual,
  });
});