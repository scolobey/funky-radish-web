import * as Realm from "realm-web";
import { REALM_APP_ID } from "../constants/api";

const realmApp = new Realm.App({ id: REALM_APP_ID });

export default class RealmService {

  authenticate = (token) => {
    console.log("authenticating with token. : " + token)
    //Try to extract this to a class
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

  // tokenAuthenticate = (token) => {
  //   const credentials = Credentials.jwt(token);
  //   return User.authenticate(credentials, 'https://recipe-realm.us1.cloud.realm.io')
  // }
  //
  // async getRecipes(user) {
  //   const config = await GraphQLConfig.create(
  //     user,
  //     '/~/recipes'
  //   );
  //   const client = config.createApolloClient();
  //
  //   const response = await client.query({
  //     query: gql`
  //       query {
  //         recipes {
  //           title
  //           ingredients {
  //             name
  //           }
  //           directions {
  //             text
  //           }
  //         }
  //       }`
  //   });
  //
  //   const recipes = response.data.recipes;
  //   return response;
  // }
  //
  // async createRecipe(recipe, user) {
  //
  //   console.log("create Recipe")
  //   console.log("Recipe: %s", recipe.title)
  //   console.log(user)

    // const config = await GraphQLConfig.create(
    //   user,
    //   '/~/recipes'
    // );
    //
    // const client = config.createApolloClient();
    //
    // const response = await client.mutate({
    //   mutation: gql`
    //     mutation CreateReview($review: ReviewInput!) {
    //       createReview(input: $review) {
    //         commentary
    //         stars
    //       }
    //     }
    //   `,
    //   variables: {
    //     "review": {
    //       "stars": 5,
    //       "commentary": "This is a great movie!"
    //     }
    //   }
    // });
    //
    // console.log(response)
    //
    // const addedCompany = response.data.result;
  // }

}
