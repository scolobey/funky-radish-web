import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from 'react-redux'
import { setRecipe, getRecipe, setRedirect } from "../actions/Actions";

import Popover from "./Popover";

import ServerService from '../services/ServerService'
const serverService = new ServerService();

export default function Recipe(props) {

  let recipeIdentifier = props.match.params.recipeTitle
  //TODO: This is probably more acurately named realmUserId
  let realmUser = localStorage.getItem('realm_user');

  const [ popoverActive, setPopoverActive ] = React.useState(false)
  const [ shareLink, setShareLink ] = React.useState('')

  const dispatch = useDispatch()
  var recipe = useSelector((state) => state.recipe)

  const segueToEdit = () => {
    // This should only be called if the recipe identifier is a recipe id.
    // This function is accessed via a button which only appears when a recipe is viewed by its author.
    dispatch(setRedirect("/builder/" + recipeIdentifier))
  };

  const generateShareToken = () => {
    // This should only be called if the recipe identifier is a recipe id.
    // This function is accessed via a button which only appears when a recipe is viewed by its author.
    serverService.generateRecipeToken(recipeIdentifier)
      .then(res => {
        setPopoverActive(true)
        setShareLink('https://www.funkyradish.com/claimRecipe/' + res.token)
      })
  };

  const dismissPopover = () => {
    setShareLink('')
    setPopoverActive(false)
  };

  React.useEffect(() => {
    if (recipeIdentifier == null || recipeIdentifier == 'undefined') {
      dispatch(setRedirect("/builder/"))
    } else {
      dispatch(getRecipe(recipeIdentifier))
    }
  }, []);

  return (recipe && recipe.title) ? (
    <div className="Recipe">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{recipe.title}</title>
        <meta name="description" content= {"Recipe for " + recipe.title} />

        // https://jsonld.com/recipe/
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
             "@type": "Recipe",
             "author": "FunkyRadish.com",
             "datePublished": "2021-12-15",
             "description": "No pictures, no stories, just a simple recipe for ${recipe.title}",
             "recipeIngredient": [ ${recipe.ingredients.map((ingredient, index) => (
               '"' + ingredient.name + '"'
             ))} ],
             "name": "${recipe.title}",
             "recipeInstructions": "${recipe.directions.map((direction, index) => (
               direction.text.replace('"',"%22").replace("\\", "%5C")
             )).join("\n")}"
         }
        `}</script>
      </Helmet>

      <div className="Title">
        <b>{recipe.title}</b>

        {recipe.author === realmUser ? (
          <div>
            <img className="share_button" src="/share_icon.svg" alt="share" onClick={e => {
              e.preventDefault();
              generateShareToken();
            }}/>
            <img className="edit_button" src="/edit_icon.svg" alt="Funky Radish" onClick={e => {
              e.preventDefault();
              segueToEdit();
            }}/>
          </div>
        ): (
          <div></div>
        )}
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

      { popoverActive ? (
        <Popover
          title="Share Your Recipe"
          message="Just copy the link below and send it to a friend. This is kinda awesome because we don't even have a chance to steal your friend's data along the way."
          url={shareLink}
          dismiss={dismissPopover}></Popover>
      ):
      (<div></div>)}

    </div>
  ) :
  (
    <div></div>
  );
}
