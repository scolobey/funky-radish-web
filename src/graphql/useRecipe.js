import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
// import useTaskMutations from "./useTaskMutations";

// TODO: handle error from gql  https://www.apollographql.com/docs/react/data/queries/#caching-query-results
// TODO: implement mutations for the editor.

const useRecipe = (project) => {
  console.log("here, we've at least called the method.")
  const { loading, error, data } = useRecipeInProject();

  return { loading, error, data };
};

export default useRecipe;

function useRecipeInProject() {

  console.log("gql recipe request.")

  let id = "60e396cde6c060bf7f0fb294"

  const RECIPE_QUERY = gql`
    query Recipe($id: String!){
      recipe(query: { _id: $id }) {
        title
        ingredients {
          name
        }
        directions {
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
