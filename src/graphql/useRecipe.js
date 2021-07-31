import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
// import useTaskMutations from "./useTaskMutations";

// TODO: handle error from gql  https://www.apollographql.com/docs/react/data/queries/#caching-query-results
// TODO: implement mutations for the editor.

const useRecipe = (project) => {
  const { loading, data } = useRecipeInProject();

  return { loading, data };
};

export default useRecipe;

function useRecipeInProject() {

  console.log("gql recipe request.")

  let id = "60e396cde6c060bf7f0fb294"

  const RECIPE_QUERY = gql`
    query Recipe($_id: String!){
      recipe(query: { id: $id }) {
        title
        ingredients
        directions
      }
    }`;

  const { loading, data } = useQuery(RECIPE_QUERY, {
    variables: { id },
  });

  const recipe = data ? data.recipe : null;
  if (recipe) {
    console.log("returned recipe: " + recipe)
  }

  //TODO: Set the user and adjust the menu.
  return { loading, data};
}
