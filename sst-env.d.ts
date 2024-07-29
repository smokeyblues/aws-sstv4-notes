/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
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
