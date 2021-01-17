// import * as React from "react";
// import * as RealmWeb from "realm-web";
// import { Credentials, User, GraphQLConfig } from 'realm-graphql-client';
//
// import {
//   REALM_APP_ID
// } from "../constants/api";
//
// const app = new RealmWeb.App({ id: REALM_APP_ID })
//
// export default class RealmApp {
//
//   async registerUser(user) {
//     return await app.auth.emailPassword.registerUser(user.email, user.password);
//   }
//
//   async login(user) {
//     const credentials = RealmWeb.Credentials.emailPassword(user.email, user.password);
//     await app.logIn(credentials);
//     setUser(app.currentUser);
//   }
//
//   async logout() {
//     await app.logOut();
//     setUser(app.currentUser);
//   }
//
// }
