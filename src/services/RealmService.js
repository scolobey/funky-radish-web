import * as Realm from "realm-web";
import { REALM_APP_ID } from "../constants/api";

const realmApp = new Realm.App({ id: REALM_APP_ID });

export default class RealmService {

  authenticate = (email, password) => {
    const credentials = Realm.Credentials.emailPassword(
      email,
      password
    )

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

  changePassword = (password, token, tokenId) => {
    // this.logoutRealm()
    console.log("cool dawg: " + password + " token: " + token + " tokenId: " + tokenId)


    realmApp.emailPasswordAuth.resetPassword(token, tokenId, password)
    .then(res => {
      // If succesful, also change the freakin other password.
      console.log("resp: " + res)
    })
    .catch(err => {
      console.log("err: " + err)
    })
  }

  customLogin = (payload) => {
    console.log("payload: " + payload)

    const credentials = Realm.Credentials.function(payload);
    try {
      // Authenticate the user
      realmApp.logIn(credentials)
      .then(user => {
        console.log("user returned: " + JSON.stringify(user))
        if (user.id === realmApp.currentUser.id) {
          console.log("yes")
        } else {
          console.log("no")
        }
        return user;
      })
      .catch(err => {
        console.log("err: " + err)
      })
    } catch (err) {
      console.error("Failed to log in", err);
    }
  }

  sendPasswordResetEmail = (email) => {
    // this.logoutRealm()
    console.log("sending email: " + email)

    realmApp.emailPasswordAuth.sendResetPasswordEmail(email)
    .then(res => {
      console.log("resp: " + res)
    })
    .catch(err => {
      console.log("err: " + err)
    })
  }

  emailAuthenticate = (email, password) => {


    const credentials = Realm.Credentials.emailPassword(
      email,
      password
    )

    return realmApp.logIn(credentials)
  }

  emailRegister = (email, password) => {
    console.log("attempt to register: " + email + " password: " + password)

    return realmApp.emailPasswordAuth.registerUser(email, password)

  }

}
