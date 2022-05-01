import React, { Suspense, lazy } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { externalRecipeSearch } from "../actions/Actions";

const RecipeRequestView = lazy(() => import("./RecipeRequestView"));
const ExternalRecipeList = lazy(() => import("./ExternalRecipeList"));
const SearchTrail = lazy(() => import("./SearchTrail"));

const Loading = () => <div></div>;



export default function SearchLandingPage(props) {
  let searchQuery = props.match.params.searchQuery

  var externalRecipes = useSelector((state) => state.externalRecipes)
  var searchDescription = useSelector((state) => state.searchDescription)
  const dispatch = useDispatch()

  const [ revealDescription, setRevealDescription ] = React.useState(false)

  React.useEffect(() => {
    console.log("search page: " + searchQuery)
    dispatch(externalRecipeSearch(searchQuery))
  }, []);

  return (
    <div className="RecipeListContainer">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{searchQuery + " recipes"}</title>
        <meta name="description" content= {searchQuery + " recipes from FunkyRadish.com"} />

        // https://schema.org/SearchResultsPage
        <script type="application/ld+json">{`
          {
            "@context": "http://schema.org",
            "@type": "SearchResultsPage",
            "headline": "${"Recipes for " + searchQuery.replace("-", " ") + " from FunkyRadish.com"}",
            "url": "${"https://www.funkyradish.com/recipes/" + searchQuery}"
          }
        `}</script>
      </Helmet>

      { searchDescription ? (
        <img className="info_button" src="/info_icon.svg" alt="Info" onClick={e => {
          e.preventDefault();
          setRevealDescription(!revealDescription)
        }}/>
      ) : (
        <div>
        </div>
      ) }

      { revealDescription ? (
        <div className="search_description">
          {searchDescription}
        </div>
      ) : (
        <div>
        </div>
      ) }

      <Suspense fallback=<Loading/>>
        <ExternalRecipeList externalRecipes={externalRecipes}/>
      </Suspense>

      <div className="create-button"><a href="/builder">+</a></div>
    </div>
  );

}
