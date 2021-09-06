import React from "react";
import { useRealmApp } from "../RealmApp";

import RealmService from '../services/RealmService'

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const realmService = new RealmService();

// Create an ApolloClient that connects to the provided Realm.App's GraphQL API
const createRealmApolloClient = (app) => {
  console.log("setting up realm app from provider: " + app.id)

  // Why when you login, is the 'currentUser' not set?

  if (app.currentUser) {
    console.log("realm app user: " + Object.keys(app.currentUser))
    console.log("realm app user id: " + app.currentUser.id)
    console.log("realm app user app: " + app.currentUser.app.id)
  }
  else {
    console.log("currentUser isn't set? App: " + app )
  }

  const link = new HttpLink({
     // TODO: Add your Realm App ID to the uri link to connect your app.
    uri: `https://realm.mongodb.com/api/client/v2.0/app/${app.id}/graphql`,
    // A custom fetch handler adds the logged in user's access token to GraphQL requests
    fetch: async (uri, options) => {
      if (!app.currentUser) {
        console.log( "app: " + JSON.stringify(app))
        console.log( "app id: " + app.id)
        console.log("the apollo client is not logged in.")
        throw new Error(`Must be logged in to get recipes: ` + app);
      }

      // Refreshing a user's custom data also refreshes their access token
      await app.currentUser.refreshCustomData();
      options.headers.Authorization = `Bearer ${app.currentUser.accessToken}`;

      return fetch(uri, options);
    },
  });

  const cache = new InMemoryCache();

  return new ApolloClient({ link, cache });
};

export default function RealmApolloProvider({ children }) {
  const [app, setApp] = React.useState(realmService.getRealm)
  const [client, setClient] = React.useState(createRealmApolloClient(app))

  React.useEffect(() => {
    console.log("apollo provider creation. App id: " + app.id)
    setClient(createRealmApolloClient(app));
  }, [app]);

  return <ApolloProvider client={client} app={app} >{children}</ApolloProvider>;
}
