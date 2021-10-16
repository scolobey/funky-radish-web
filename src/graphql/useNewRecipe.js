import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import useRecipeMutations from "./useRecipeMutations";

// TODO: handle error from gql  https://www.apollographql.com/docs/react/data/queries/#caching-query-results

const useNewRecipe = (rec) => {
  const { addRecipe, updateRecipe, deleteRecipe } = useRecipeMutations(rec);
  return { addRecipe, updateRecipe, deleteRecipe };
};

export default useNewRecipe;
