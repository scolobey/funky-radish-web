import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
// import useTaskMutations from "./useTaskMutations";

const useRecipes = (project) => {
  const { recipes, loading, error } = useAllRecipesInProject();

  return { loading, recipes, error };
};

export default useRecipes;

function useAllRecipesInProject() {
  const { data, loading, error } = useQuery(
    gql`
      query {
        recipe {
          _id
          author
          title
        }
      }
    `
  );

  if (error) {
    console.log(error)
  }

  const recipes = data?.recipes ?? [ {title: "butter", _id: 12}];
  return { recipes, loading, error };
}
