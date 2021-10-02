import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
// import useTaskMutations from "./useTaskMutations";

// TODO: handle error from gql  https://www.apollographql.com/docs/react/data/queries/#caching-query-results
// TODO: implement mutations for the editor.

const useRecipe = (recId) => {
  console.log("let's collect the recipe with ID: " + recId)

  const { loading, error, data } = useRecipeInProject(recId);

  return { loading, error, data };
};

export default useRecipe;

function useRecipeInProject(recId) {

  // Terribly annoying that this is necesarry. We need to do this, either to convert the id to a const string?
  // Or because somehow the query expects a parameter called id?
  let id = recId


  const RECIPE_QUERY = gql`
    query Recipe($id: String!){
      recipe(query: { _id: $id }) {
        title
        ingredients {
          _id
          name
        }
        directions {
          _id
          text
        }
      }
    }`;

  const { loading, error, data } = useQuery(RECIPE_QUERY, {
    variables: { id },
  });

  const recipe = data ? data.recipe : null;
  if (recipe) {
    console.log("returned recipe: " + recipe.directions)
  }

  //TODO: Set the user and adjust the menu.
  return { loading, error, data};
}
