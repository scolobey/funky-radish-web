import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const useRecipes = (author) => {
  const { loading, error, data } = useAllRecipesInProject(author);
  return { loading, error, data };
};

export default useRecipes;

function useAllRecipesInProject(author) {
  console.log("running gql query with: " + author)

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
    onCompleted: () => {console.log("query completed.")}
  });

  //TODO: Set the user and adjust the menu.
  return { loading, error, data};
}
