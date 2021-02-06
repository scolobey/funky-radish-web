import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
// import useTaskMutations from "./useTaskMutations";


const useRecipes = (project) => {
  const { loading, data } = useAllRecipesInProject();

  return { loading, data };
};

export default useRecipes;

function useAllRecipesInProject() {

  console.log("using recipes")
  const { loading, data } = useQuery(
    gql`
      query {
        recipes {
          _id
          author
          title
        }
      }
    `
  );

// console.log( "data: " + data.clone().json())

  // if (error) {
  //   console.log(error)
  // }

  // const recipes = data?.recipes ?? [ {title: "butter", _id: 12}];

  const movie = data ? data.recipes : null;
  if (movie) {
    console.log(movie)
  }


  return { loading, data};

  // return <MovieList movies={data.movies} />


}
