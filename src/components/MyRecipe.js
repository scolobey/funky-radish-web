import React, { useState } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux'

import { warning, toggleLoader } from "../actions/Actions";

import useRecipe from "../graphql/useRecipe";
import EditRecipe from "../graphql/editRecipe";
import Builder from "./Builder";
import Popover from "./Popover";
import Loader from "./Loader";

import ServerService from '../services/ServerService'

import { setRedirect } from "../actions/Actions";

import { Helmet } from "react-helmet";

const serverService = new ServerService();

export default function MyRecipe(props) {

  // const redirector = useSelector((state) => state.redirect)
  const [ active, setActive ] = React.useState(false)
  const [ shareLink, setShareLink ] = React.useState('')

  const dispatch = useDispatch()

  let recId = props.match.params.recipeId

  let realmUser = localStorage.getItem('realm_user');

  const { loading, error, data } = useRecipe(recId);

  if (recId == null || recId == 'undefined') return <Builder />

  if (loading) {
    dispatch(toggleLoader(true))
  };

  if (error) {
    dispatch(warning("recipe loading error: " + error.message))
    dispatch(toggleLoader(false))
  };

  if (data) {
    dispatch(toggleLoader(false))
  };

  const segueToEdit = () => {
    dispatch(setRedirect("/builder/" + recId))
  };

  const generateShareToken = () => {
    serverService.generateRecipeToken(recId)
      .then(res => {
        console.log(res)
        setActive(true)
        setShareLink('https://www.funkyradish.com/claimRecipe/' + res.token)
      })
  };

  const dismissView = () => {
    setShareLink('')
    setActive(false)
  };

  return data? (
    <div className="Recipe">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{data.recipe.title}</title>
        <meta name="description" content= {"Recipe for: " + data.recipe.title + ". "} />
      </Helmet>

      <div className="Title">
        <b>{data.recipe.title}</b>

        {(data.recipe.author === realmUser ?
        <img className="share_button" src="/share_icon.svg" alt="share" onClick={e => {
          e.preventDefault();
          generateShareToken();
        }}/> : <div></div>)}
        <img className="edit_button" src="/edit_icon.svg" alt="Funky Radish" onClick={e => {
          e.preventDefault();
          segueToEdit();
        }}/>
      </div>

      <div className="Ingredients">
        {data.recipe.ingredients ? (
          <ul>
            {data.recipe.ingredients.map((ingredient, index) => (
              <li key={index.toString()}>
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
              <li key={index.toString()}>
                {direction.text}
              </li>
            ))}
          </ul>
        ):
        (<div></div>)}
      </div>
      {active ? (
        <Popover
          title="Share Your Recipe"
          message="Just copy the link below and send it to a friend. This is kinda awesome because we don't even have a chance to steal your friend's data along the way."
          url={shareLink}
          dismiss={dismissView}></Popover>
      ):
      (<div></div>)}

    </div>
  ) : (
    <div></div>
  );
}
