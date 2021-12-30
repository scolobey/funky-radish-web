import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import useNewRecipe from "../graphql/useNewRecipe";

import { setRedirect, claimRecipe } from "../actions/Actions";

import RealmService from '../services/RealmService'
const realmService = new RealmService();

let fullRealmUser = localStorage.getItem('realm_user_complete');

export default function RecipeClaimer(props) {
  const redirector = useSelector((state) => state.redirect)

  const dispatch = useDispatch()

  const [ recipeToken, setRecipeToken ] = React.useState("")
  const [ recipeAccepted, setRecipeAccepted ] = React.useState("Just a moment while we check your key...")

  React.useEffect(() => {
    let token = props.match.params.token
     setRecipeToken(token)

     if (fullRealmUser) {
       console.log("user: " + JSON.parse(fullRealmUser).customData._id)
       console.log("token: " + token)
       let payload = {
         member: JSON.parse(fullRealmUser).customData._id,
         token: token
       }
       dispatch(claimRecipe(payload))
     }
     else {
       console.log("user not logged in")
       // Gotta show people what's going on.
     }
  },[])

  return (
    <div className="verificationView">
      <b>{recipeToken? recipeToken : "abc"}</b>
      <b>{recipeAccepted? recipeAccepted : "def"}</b>
    </div>
  )
}
