import React, { Suspense, lazy } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { externalRecipeSearch } from "../actions/Actions";

const ExternalRecipeList = lazy(() => import("./ExternalRecipeList"));
const RecipeRequestView = lazy(() => import("./RecipeRequestView"));

const Loading = () => <div></div>;

export default function SearchLandingPage(props) {
  let searchQuery = props.match.params.searchQuery

  var externalRecipes = useSelector((state) => state.externalRecipes)
  const dispatch = useDispatch()

  React.useEffect(() => {
    console.log("search page: " + searchQuery)
    dispatch(externalRecipeSearch(searchQuery))
  }, []);

  return (
    <div className="RecipeListContainer">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Funky Radish</title>
        <meta name="description" content= "Welcome to FunkyRadish. Find a recipe." />
      </Helmet>

      <Suspense fallback={Loading}>
        <ExternalRecipeList externalRecipes={externalRecipes}/>
        <RecipeRequestView/>
      </Suspense>

      <div className="create-button"><a href="./builder">+</a></div>
    </div>
  );

}
