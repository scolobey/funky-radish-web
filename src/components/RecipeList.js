import React, { useState, useEffect } from "react";
import { connect, useSelector, useDispatch } from 'react-redux'

import useRecipes from "../graphql/useRecipes";
import { Link } from 'react-router-dom';

import { warning, toggleLoader } from "../actions/Actions";

import Loader from "./Loader";

function RecipeList(props) {

  const dispatch = useDispatch()
  let list = []

  if (props.author.customData && props.author.customData["recipes"] && props.author.customData["recipes"].length > 0) {
    list = props.author.customData["recipes"]
  }

  const { loading, error, data } = useRecipes(props.author.id, list);

  if (loading) {
    console.log("loading: " + loading)
    dispatch(toggleLoader(true))
  }

  if(error) {
    console.log("error: " + error)
    dispatch(warning(error.message))
  }

  if(data) {
    console.log("data")
    dispatch(toggleLoader(false))
  }

  let rec = data?.recipes.filter(function(recipe) {
    if(props.query && props.query.length > 0) {
      return recipe.title.toLowerCase().includes(props.query)
    } else {
      return true
    }
  })
  ?? []

  return (data?.recipes) ? (
    <div className="recipeView">

    { rec.length > 0 ?  (
      <ul>
        {rec.map((recipe) =>
          (recipe.author == props.author.id ?
            <li key={recipe._id.toString()}>
              <Link
                className="recipeListing"
                to={{ pathname: "/recipe/" + recipe._id}}
              > {recipe.title} </Link>
            </li> :
            <li key={recipe._id.toString()}>
                <Link
                  className="watchedRecipeListing"
                  to={{ pathname: "/recipe/" + recipe._id}}
                > {recipe.title} </Link>
            </li>)
        )}
      </ul> ) : (
      <div>
        { (props.query && props.query.length > 0) ?  (
          <div>
            Your book doesn't have any matching recipes. Hit enter on the search to check the FunkyRadish DB.
            <br></br>
            Or, click that '+' button at the lower right to add your own recipes.
          </div>
        ) : (
          <div>
            You don't have any recipes yet. Try search to check the FunkyRadish DB.
            <br></br>
            Or, click that '+' button at the lower right to add your own recipes.
          </div>
        ) }
      </div>
      ) }
    </div>
  ):(
    <div>
    </div>
  );
}

function mapStateToProps(state) {
  return { query: state.query };
}

export default connect(mapStateToProps)(RecipeList);
