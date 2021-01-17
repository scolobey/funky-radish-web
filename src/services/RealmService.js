import { Credentials, User, GraphQLConfig } from 'realm-graphql-client';
import gql from 'graphql-tag'

export default class RealmService {

  authenticate = (user) => {
    const credentials = Credentials.usernamePassword(user.email, user.password, user.newUser);
    return User.authenticate(credentials, 'https://recipe-realm.us1.cloud.realm.io')
  }

  tokenAuthenticate = (token) => {
    const credentials = Credentials.jwt(token);
    return User.authenticate(credentials, 'https://recipe-realm.us1.cloud.realm.io')
  }

  async getRecipes(user) {
    const config = await GraphQLConfig.create(
      user,
      '/~/recipes'
    );
    const client = config.createApolloClient();

    const response = await client.query({
      query: gql`
        query {
          recipes {
            title
            ingredients {
              name
            }
            directions {
              text
            }
          }
        }`
    });

    const recipes = response.data.recipes;
    return response;
  }

  async createRecipe(recipe, user) {

    console.log("create Recipe")
    console.log("Recipe: %s", recipe.title)
    console.log(user)

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
  }

}
