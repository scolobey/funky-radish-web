import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

import RealmService from '../services/RealmService'
const realmService = new RealmService();

const useFeaturedRecipes = () => {
  console.log("and then: ")
  const { loading, error, data } = useAllFeaturedRecipes();

  return { loading, error, data };
};

export default useFeaturedRecipes;

function useAllFeaturedRecipes() {

  console.log("finding featured recipes")

  let FEATURED_RECIPE_QUERY = gql`
    query Recipes($author: String!){
      recipes(query: { author: "61b690c3f1273900d0fb6ca4" }, sortBy: LASTUPDATED_DESC, limit:10) {
        _id
        author
        title
      }
    }`;

  const { loading, error, data } = useQuery(FEATURED_RECIPE_QUERY, {
    onCompleted: () => {console.log("query completed.")}
  });

  //TODO: Set the user and adjust the menu.
  return { loading, error, data};
}
