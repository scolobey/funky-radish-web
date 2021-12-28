import React, { useState, useEffect } from "react";
import { connect, useSelector } from 'react-redux'

import useRecipes from "../graphql/useRecipes";
import { Link } from 'react-router-dom';

function RecipeList(props) {

  // const query = useSelector((state) => {
  //   console.log("useSelector")
  //   return state.query
  // })

  console.log("query on list: " + Object.keys(props.author))
  console.log("query on list: " + props.author.recipes)
  console.log("query on mist: " + props.query)

  const { loading, error, data } = useRecipes(props.author.id, ["617ee621638d87c7faf71c9f"]);

  let rec = data?.recipes.filter(function(recipe) {
    if(props.query && props.query.length > 0) {
      console.log("filtering recipe: " + recipe.title.toLowerCase() + " on: " + props.query)
      console.log("includes? : " + recipe.title.toLowerCase().includes(props.query))
      return recipe.title.toLowerCase().includes(props.query)
    } else {
      return true
    }
  })
  ?? []

  return data?.recipes? (
    <div className="recipeView">
      {rec.map((recipe) =>
        <li key={recipe._id}>
            <Link
              className="recipeListing"
              key={recipe._id}
              to={{ pathname: "/myrecipes/" + recipe._id}}
            > {recipe.title} </Link>
        </li>
      )}
    </div>
  ): (
      <div> Loading... </div>
  );
}

function mapStateToProps(state) {
  return { query: state.query };
}

export default connect(mapStateToProps)(RecipeList);
