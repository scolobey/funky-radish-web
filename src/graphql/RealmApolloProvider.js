import React from "react";

import RealmService from '../services/RealmService'

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const realmService = new RealmService();

export const RealmApolloContext = React.createContext();

// Create an ApolloClient that connects to the provided Realm.App's GraphQL API
const createRealmApolloClient = (app) => {
  const link = new HttpLink({
     // TODO: Add your Realm App ID to the uri link to connect your app.
    uri: `https://realm.mongodb.com/api/client/v2.0/app/${app.id}/graphql`,
    // A custom fetch handler adds the logged in user's access token to GraphQL requests
    fetch: async (uri, options) => {
      if (!app.currentUser) {
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
  const [currentUser, setCurrentUser] = React.useState(app.currentUser);

  React.useEffect(() => {
    setClient(client);
  }, [app]);

  const wrapped = { ...app, currentUser, setCurrentUser };

  return <RealmApolloContext.Provider value={wrapped}>
    <ApolloProvider client={client} app={app} >
      {children}
    </ApolloProvider>
  </RealmApolloContext.Provider>;
}
