import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

import RealmService from '../services/RealmService'
const realmService = new RealmService();

const useRecipes = (author, watching) => {
  console.log("and then: " + watching)
  const { loading, error, data } = useAllRecipesInProject(author, watching);

  return { loading, error, data };
};

export default useRecipes;

function useAllRecipesInProject(author, watching) {

  console.log("author: " + author + " watching: " + watching)

  let RECIPE_QUERY = gql`
    query Recipes($author: String!, $watching: [String!]){
      recipes(query: {OR: [{ author: $author }, {_id_in: $watching}]}) {
        _id
        author
        title
      }
    }`;

  if (author == 'all') {
    RECIPE_QUERY = gql`
    query Recipes {
      recipes {
        _id
        author
        title
      }
    }`;
  }

  const { loading, error, data } = useQuery(RECIPE_QUERY, {
    variables: { author, watching },
    onCompleted: () => {console.log("query completed.")}
  });

  //TODO: Set the user and adjust the menu.
  return { loading, error, data};
}
