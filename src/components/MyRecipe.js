import React, { useState } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux'

import useRecipe from "../graphql/useRecipe";
import EditRecipe from "../graphql/editRecipe";
import Builder from "./Builder";
import { setRedirect, getRecipeToken } from "../actions/Actions";

import { Helmet } from "react-helmet";

export default function MyRecipe(props) {

  // const redirector = useSelector((state) => state.redirect)

  const dispatch = useDispatch()

  let recId = props.match.params.recipeId

  let realmUser = localStorage.getItem('realm_user');

  const { loading, error, data } = useRecipe(recId);

  if (recId == null || recId == 'undefined') return <Builder />

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const segueToEdit = () => {
    dispatch(setRedirect("/builder/" + recId))
  };

  const generateShareToken = () => {
    dispatch(getRecipeToken(recId))
  };

  return (
    <div className="Recipe">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{data.recipe.title}</title>
        <meta name="description" content= {"Recipe for: " + data.recipe.title + ". "} />
      </Helmet>

      <div className="Title">
        <b>{data.recipe.title}</b>

        {(data.recipe.author === realmUser ? <img className="share_button" src="/share_icon.svg" alt="share" onClick={e => {
          e.preventDefault();
          generateShareToken();
        }}/> : <div></div>)}
        <img className="edit_button" src="/edit_icon.svg" height="30" alt="Funky Radish" onClick={e => {
          e.preventDefault();
          segueToEdit();
        }}/>
      </div>

      <div className="Ingredients">
        {data.recipe.ingredients ? (
          <ul>
            {data.recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.name}
              </li>
            ))}
          </ul>
        ):
        (<div></div>)}
      </div>

      <div className="Directions">
        {data.recipe.directions ? (
          <ul>
            {data.recipe.directions.map((direction, index) => (
              <li key={index}>
                {direction.text}
              </li>
            ))}
          </ul>
        ):
        (<div></div>)}
      </div>

    </div>
  );
}
