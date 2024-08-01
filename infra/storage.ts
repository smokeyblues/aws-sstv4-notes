// Create a secret for Stripe
export const stripeSecretKey = new sst.Secret("StripeSecretKey");
export const stripePublicKey = new sst.Secret("StripePublicKey");

// price ids for the subscription
export const basicMonthlyPriceId = new sst.Secret("BasicMonthlyPriceId");
export const basicAnnualPriceId = new sst.Secret("BasicAnnualPriceId");
export const proMonthlyPriceId = new sst.Secret("ProMonthlyPriceId");
export const proAnnualPriceId = new sst.Secret("ProAnnualPriceId");
export const enterpriseMonthlyPriceId = new sst.Secret("EnterpriseMonthlyPriceId");
export const enterpriseAnnualPriceId = new sst.Secret("EnterpriseAnnualPriceId");

// Create an S3 bucket
export const bucket = new sst.aws.Bucket("Uploads");

export const usersTable = new sst.aws.Dynamo("Users", {
    fields: {
      userId: "string",
    },
    primaryIndex: { hashKey: "userId" },
  });

// Create the DynamoDB table for notes
export const notesTable = new sst.aws.Dynamo("Notes", {
    fields: {
      userId: "string",
      noteId: "string",
    },
    primaryIndex: { hashKey: "userId", rangeKey: "noteId" },
  });