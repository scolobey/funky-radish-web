import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import useRecipeMutations from "./useRecipeMutations";

// TODO: handle error from gql  https://www.apollographql.com/docs/react/data/queries/#caching-query-results
// TODO: implement mutations for the editor.

const useNewRecipe = (rec) => {
  // const { loading, error, data } = useRecipeInProject(rec);

  const { addRecipe, updateRecipe, deleteRecipe } = useRecipeMutations(rec);

  return { addRecipe, updateRecipe };
};

export default useNewRecipe;

// function useRecipeInProject(thisRecipe) {

  // // Terribly annoying that this is necesarry. We need to do this, either to convert the id to a const string?
  // // Or because somehow the query expects a parameter called id?
  // // let id = thisRecipe._id
  //
  //
  // const RECIPE_QUERY = gql`
  //   query Recipe($id: String!){
  //     recipe(query: { _id: $id }) {
  //       title
  //       ingredients {
  //         name
  //       }
  //       directions {
  //         text
  //       }
  //     }
  //   }`;
  //
  // const { loading, error, data } = useQuery(RECIPE_QUERY, {
  //   variables: { id },
  // });
  //
  // const recipe = data ? data.recipe : null;
  //
  // if (recipe) {
  //   console.log("returned recipe: " + recipe.directions)
  // }
  //
  // //TODO: Set the user and adjust the menu.


//   return { null, null, data: {author: "60e1376b5b3ed43677ea58d2", title: "turd wagon"}};
// }
