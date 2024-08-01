/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    BasicAnnualPriceId: {
      type: "sst.sst.Secret"
      value: string
    }
    BasicMonthlyPriceId: {
      type: "sst.sst.Secret"
      value: string
    }
    EnterpriseAnnualPriceId: {
      type: "sst.sst.Secret"
      value: string
    }
    EnterpriseMonthlyPriceId: {
      type: "sst.sst.Secret"
      value: string
    }
    Frontend: {
      type: "sst.aws.StaticSite"
      url: string
    }
    IdentityPool: {
      id: string
      type: "sst.aws.CognitoIdentityPool"
    }
    Notes: {
      name: string
      type: "sst.aws.Dynamo"
    }
    NotesApi: {
      type: "sst.aws.ApiGatewayV2"
      url: string
    }
    ProAnnualPriceId: {
      type: "sst.sst.Secret"
      value: string
    }
    ProMonthlyPriceId: {
      type: "sst.sst.Secret"
      value: string
    }
    StripePublicKey: {
      type: "sst.sst.Secret"
      value: string
    }
    StripeSecretKey: {
      type: "sst.sst.Secret"
      value: string
    }
    Uploads: {
      name: string
      type: "sst.aws.Bucket"
    }
    UserPool: {
      id: string
      type: "sst.aws.CognitoUserPool"
    }
    UserPoolClient: {
      id: string
      secret: string
      type: "sst.aws.CognitoUserPoolClient"
    }
    Users: {
      name: string
      type: "sst.aws.Dynamo"
    }
    UsersApi: {
      type: "sst.aws.ApiGatewayV2"
      url: string
    }
  }
}
export {}
