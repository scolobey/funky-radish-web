import React, { useState, useEffect } from "react";
import { connect, useSelector } from 'react-redux'

import useRecipes from "../graphql/useRecipes";
import { Link } from 'react-router-dom';

function RecipeList(props) {

  let list = []

  if (props.author.customData && props.author.customData["recipes"]) {
    list = props.author.customData["recipes"].map((item) => {
      return item.$oid
    })
  }

  const { loading, error, data } = useRecipes(props.author.id, list);

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
      {rec.map((recipe) =>
        (recipe.author == props.author.id ? <li key={recipe._id}>
            <Link
              className="recipeListing"
              key={recipe._id}
              to={{ pathname: "/myrecipes/" + recipe._id}}
            > {recipe.title} </Link>
        </li> :
        <li key={recipe._id}>
            <Link
              className="watchedRecipeListing"
              key={recipe._id}
              to={{ pathname: "/myrecipes/" + recipe._id}}
            > {recipe.title} </Link>
        </li>)

      )}
    </div>
  ):(
    <div> Loading... </div>
  );
}

function mapStateToProps(state) {
  return { query: state.query };
}

export default connect(mapStateToProps)(RecipeList);
