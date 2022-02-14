import React, { useState, useEffect } from "react";
import { connect, useSelector, useDispatch } from 'react-redux'

import useRecipes from "../../graphql/useRecipes";
import { Link } from 'react-router-dom';

import { warning } from "../../actions/Actions";

function RecipesAdmin(props) {
  const dispatch = useDispatch()
  let list = []

  const { loading, error, data } = useRecipes("all", list);

  if(error) {
    dispatch(warning(error.message))
  }

  if(data) {
    console.log(data)
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

    Total Recipes: {rec.length}

    { rec.length > 0 ?  (
      <ul>
        {rec.map((recipe) =>
          <li key={recipe._id.toString()}>
            <Link
              className="recipeListing"
              to={{ pathname: "/admin/importer/" + recipe._id}}
            > {recipe.title} / {recipe.author}</Link>
          </li>
        )}
      </ul> ) :
      <div>
        No recipes.
      </div> }
    </div>
  ):(
    <div> Loading... </div>
  );
}

function mapStateToProps(state) {
  return { query: state.query };
}

export default connect(mapStateToProps)(RecipesAdmin);
