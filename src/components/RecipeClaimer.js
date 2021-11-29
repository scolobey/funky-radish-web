import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import useNewRecipe from "../graphql/useNewRecipe";

import { setRedirect } from "../actions/Actions";
let currentRealmUser = localStorage.getItem('realm_user');


export default function RecipeClaimer(props) {
  // let recipeIdentification = props.match.params.recipeId


  const { addRecipe, updateRecipe, deleteRecipe } = useNewRecipe({});



  const redirector = useSelector((state) => state.redirect)

  const [ recipeToken, setRecipeToken ] = React.useState("")
  const [ recipeAccepted, setRecipeAccepted ] = React.useState("Just a moment while we check your key...")

  React.useEffect(() => {
    let theToken = props.match.params.token

     console.log("some effect: " + theToken)
  },[])

  return (
    <div className="verificationView">
      <b>{recipeToken? recipeToken : "abc"}</b>
      <b>{recipeAccepted? recipeAccepted : "def"}</b>
    </div>
  )
}
