import { notesTable, usersTable, secret } from "./storage";

// Create the API
export const notesApi = new sst.aws.ApiGatewayV2("NotesApi", {
  transform: {
    route: {
      handler: {
        link: [notesTable, secret],
      },
      args: {
        auth: { iam: true }
      },
    }
  }
});

// Create a new API for users
export const usersApi = new sst.aws.ApiGatewayV2("UsersApi", {
  transform: {
    route: {
      handler: {
        link: [usersTable],
      },
      args: {
        auth: { iam: true }
      },
    }
  }
});

// Existing routes for notes API
notesApi.route("POST /notes", "packages/functions/src/notes/create.main");
notesApi.route("GET /notes/{id}", "packages/functions/src/notes/get.main");
notesApi.route("GET /notes", "packages/functions/src/notes/list.main");
notesApi.route("PUT /notes/{id}", "packages/functions/src/notes/update.main");
notesApi.route("DELETE /notes/{id}", "packages/functions/src/notes/delete.main");
notesApi.route("POST /billing", "packages/functions/src/billing.main");

// New routes for users API
usersApi.route("POST /users", "packages/functions/src/users/create.main");
usersApi.route("GET /users/{id}", "packages/functions/src/users/get.main");
usersApi.route("PUT /users/{id}", "packages/functions/src/users/update.main");
usersApi.route("DELETE /users/{id}", "packages/functions/src/users/delete.main");