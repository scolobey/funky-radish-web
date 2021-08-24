import React from "react";
import { useRealmApp } from "../RealmApp";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

// Create an ApolloClient that connects to the provided Realm.App's GraphQL API
const createRealmApolloClient = (app) => {
  const link = new HttpLink({
     // TODO: Add your Realm App ID to the uri link to connect your app.
    uri: `https://realm.mongodb.com/api/client/v2.0/app/${app.id}/graphql`,
    // A custom fetch handler adds the logged in user's access token to GraphQL requests
    fetch: async (uri, options) => {
      if (!app.currentUser) {
        console.log( "app: " + app)
        console.log( "app id: " + app.id)
        console.log("the apollo client is not logged in.")
        throw new Error(`Must be logged in to get recipes: ` + app);
      }

      console.log( "app i is there: " + app)
      console.log( "app id: " + app.id)
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
  const app = useRealmApp();

  const [client, setClient] = React.useState(createRealmApolloClient(app))


  React.useEffect(() => {
    console.log("apollo provider creation. App id: " + app.id)
    setClient(createRealmApolloClient(app));
  }, [app]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
