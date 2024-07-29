import Stripe from "stripe";
import { Resource } from "sst";
import { Util } from "@aws-sst-v4-notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ReturnValue } from "@aws-sdk/client-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const data = JSON.parse(event.body || "{}");
  const { priceId } = data;

  if (!priceId) {
    throw new Error("Price ID is required");
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

  // Create a new subscription
  const subscription = await stripe.subscriptions.create({
    customer: user.customerId,
    items: [{ price: priceId }],
  });

  // Update the user data in DynamoDB
  const updateParams = {
    TableName: Resource.Users.name,
    Key: { userId: userId },
    UpdateExpression: "SET subscriptionId = :subscriptionId, subscriptionStatus = :subscriptionStatus",
    ExpressionAttributeValues: {
      ":subscriptionId": subscription.id,
      ":subscriptionStatus": subscription.status,
    },
    ReturnValues: "ALL_NEW" as ReturnValue,
  };

  await dynamoDb.send(new UpdateCommand(updateParams));

  return JSON.stringify({
    userId: userId,
    email: user.email,
    customerId: user.customerId,
    subscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
  });
});