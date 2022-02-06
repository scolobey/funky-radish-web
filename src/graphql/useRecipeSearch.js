// Deprecated

// import { useQuery } from "@apollo/client";
// import gql from "graphql-tag";
//
// import RealmService from '../services/RealmService'
// const realmService = new RealmService();
//
// const useRecipeSearch = (query) => {
//   const { loading, error, data } = useRecipeSearchQuery(query);
//   return { loading, error, data };
// };
//
// export default useRecipeSearch;
//
// function useRecipeSearchQuery(query) {
//
//   console.log("rec search query: " + query)
//
//   const RECIPE_SEARCH_QUERY = gql`
//     query Recipes($author: String!, $query: String!){
//       recipes(query: {AND: [{ author: $author }, {_id_in: $query}]}) {
//         _id
//         author
//         title
//       }
//     }`;
//
//   const user = "61e1e4cafbb17b00164fc738"
//
//   const { loading, error, data } = useQuery(RECIPE_SEARCH_QUERY, {
//     variables: { user, query },
//     onCompleted: () => { console.log("query completed.") }
//   });
//
//   //TODO: Set the user and adjust the menu.
//   return { loading, error, data };
// }
