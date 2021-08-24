import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

// import useTaskMutations from "./useTaskMutations";

// TODO: handle error from gql  https://www.apollographql.com/docs/react/data/queries/#caching-query-results
// TODO: implement mutations for the editor.


const useRecipes = () => {

  const { loading, error, data } = useAllRecipesInProject();

  return { loading, error, data };
};

export default useRecipes;

function useAllRecipesInProject() {
  let author = localStorage.getItem('realm_user');
  //need to find the current author


// You're not logged in yet!
  console.log("querying gql. Should be loged in by now, for sure: " + author)

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
