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
    console.log("loading...")
    dispatch(toggleLoader(true))
  }

  if(error) {
    dispatch(warning(error.message))
  }

  if(data) {
    console.log("data arrived")
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

  return data?.recipes? (
    <div className="recipeView">

    { rec.length > 0 ?  (
      <ul>
        {rec.map((recipe) =>
          (recipe.author == props.author.id ?
            <li key={recipe._id.toString()}>
              <Link
                className="recipeListing"
                to={{ pathname: "/myrecipes/" + recipe._id}}
              > {recipe.title} </Link>
            </li> :
            <li key={recipe._id.toString()}>
                <Link
                  className="watchedRecipeListing"
                  to={{ pathname: "/myrecipes/" + recipe._id}}
                > {recipe.title} </Link>
            </li>)
        )}
      </ul> ) :
      <div>
        You don't have any recipes yet.
        <br></br>
        Let's fix that
        <br></br>
        <br></br>
        You've got a few options.
        <br></br>
        <ul>
          <li>Import a recipe from anywhere.</li>
          <br></br>
          <li>Ask a friend.</li>
          <br></br>
          <li>Or add your own recipe.</li>
        </ul>
      </div>}
    </div>
  ):(
    <div></div>
  );
}

function mapStateToProps(state) {
  return { query: state.query };
}

export default connect(mapStateToProps)(RecipeList);
