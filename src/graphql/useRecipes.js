import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

// import useTaskMutations from "./useTaskMutations";

// TODO: handle error from gql  https://www.apollographql.com/docs/react/data/queries/#caching-query-results
// TODO: implement mutations for the editor.

const useRecipes = (project) => {
  const { loading, error, data } = useAllRecipesInProject();
  return { loading, error, data };
};

export default useRecipes;

function useAllRecipesInProject() {
  let author = "60e1376b5b3ed43677ea58d2"

  console.log("querying gql")

  const RECIPE_QUERY = gql`
    query Recipes($author: String!){
      recipes(query: { author: $author }) {
        _id
        author
        title
      }
    }`;

  const { loading, error, data } = useQuery(RECIPE_QUERY, {
    variables: { author },
  });

  //TODO: Set the user and adjust the menu.
  return { loading, error, data};
}
