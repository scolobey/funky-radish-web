import React, { Suspense, lazy } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from "react-router-dom";
import { perfectRecipeSearch } from "../actions/Actions";

const DuplicateRecipeList = lazy(() => import("./DuplicateRecipeList"));

const Loading = () => <div></div>;

export default function PerfectSearchPage(props) {

  let searchQuery = props.match.params.searchQuery

  var externalRecipes = useSelector((state) => state.externalRecipes)
  var searchConfig = useSelector((state) => state.searchConfig)

  const dispatch = useDispatch()

  React.useEffect(() => {
    console.log("search page: " + searchQuery)
    dispatch(perfectRecipeSearch("Guacamole"))
  }, []);

  return (
    <div className="RecipeListContainer">

      <h1> {searchQuery}</h1>

      <Suspense fallback=<Loading/>>
        <DuplicateRecipeList duplicateRecipes={externalRecipes}/>
      </Suspense>

      <div className="create-button"><a href="/builder">+</a></div>
    </div>
  );

}
