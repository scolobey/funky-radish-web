import * as Realm from "realm-web";
import { REALM_APP_ID } from "../constants/api";

const realmApp = new Realm.App({ id: REALM_APP_ID });

export default class RealmService {

  authenticate = (token) => {
    //Try to extract this to a class
    console.log("sending: " + token)
    const credentials = Realm.Credentials.jwt(token);
    return realmApp.logIn(credentials)
  }

  getRealm = () => {
    return realmApp
  }

  logoutRealm = () => {
    const user = realmApp.currentUser;
    realmApp.removeUser(user);
    return
  }

  getUser = () => {
    const user = realmApp.currentUser
    return user
  }

  changePassword = (email, password) => {
    console.log("cool dawg: " + email + ", " + password )

    realmApp.emailPasswordAuth.callResetPasswordFunction(email, password, {});
  }

}
