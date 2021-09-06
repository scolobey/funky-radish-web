import React from "react";
import * as Realm from "realm-web";

import RealmService from './services/RealmService'
const realmService = new RealmService();

export const RealmAppContext = React.createContext();

export const useRealmApp = () => {
  console.log("using that realm app baby")
  const app = React.useContext(RealmAppContext);
  if (!app) {
    throw new Error(
      `You must call useRealmApp() inside of a <RealmAppProvider />`
    );
  }
  return app;
};

export const RealmAppProvider = ({ appId, children }) => {
  const [app, setApp] = React.useState(realmService.getRealm);
  // Wrap the Realm.App object's user state with React state
  console.log("setting realm: " + app.id)
  for (const x in app.users) {
    console.log("user" + x + ": " + app.users[x].id)
  }

  const [currentUser, setCurrentUser] = React.useState(app.currentUser);

  React.useEffect(() => {
    console.log("setting the realm app")
    setApp(realmService.getRealm);
  }, [appId]);

  const wrapped = { ...app, currentUser, setCurrentUser };

  return (
    <RealmAppContext.Provider value={wrapped}>
      {children}
    </RealmAppContext.Provider>
  );
};
