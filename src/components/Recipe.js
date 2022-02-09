import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from 'react-redux'
import { getRecipe } from "../actions/Actions";
import Loader from "./Loader";

export default function Recipe(props) {

  let recipeIdentifier = props.match.params.recipeTitle

  const dispatch = useDispatch()
  var recipe = useSelector((state) => state.recipe)

  React.useEffect(() => {
    dispatch(getRecipe(recipeIdentifier))
  }, []);

  return recipe? (
    <div className="Recipe">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{recipe? recipe.title : ""}</title>
        <meta name="description" content= {recipe? "Recipe for " + recipe.title : "Recipe view page"} />
      </Helmet>

      <div className="Title">
        <b>{recipe? recipe.title  : ""}</b>
      </div>

      <div className="Ingredients">
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={ingredient._id}>
              {ingredient.name} 
            </li>
          ))}
        </ul>
      </div>

      <div className="Directions">
        <ul>
          {recipe.directions.map((direction, index) => (
            <li key={direction._id}>
              {direction.text}
            </li>
          ))}
        </ul>
      </div>

    </div>
  ) :
  (
    <Loader loader='true'/>
  );
}
