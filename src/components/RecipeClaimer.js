import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import useNewRecipe from "../graphql/useNewRecipe";

import { setRedirect, claimRecipe, warning } from "../actions/Actions";

// import RealmService from '../services/RealmService'
// const realmService = new RealmService();

let fullRealmUser = localStorage.getItem('realm_user_complete');

export default function RecipeClaimer(props) {
  const redirector = useSelector((state) => state.redirect)

  const dispatch = useDispatch()

  const [ recipeToken, setRecipeToken ] = React.useState("")
  const [ recipeAccepted, setRecipeAccepted ] = React.useState("")

  React.useEffect(() => {
    let token = props.match.params.token
     setRecipeToken(token)

     if(token && token.length < 10) {
       dispatch(warning("You need a token to claim a recipe."))
       dispatch(setRedirect("/"))
       setRecipeAccepted("")
     }

     if (fullRealmUser) {
       console.log("user: " + JSON.parse(fullRealmUser).customData._id)
       console.log("token: " + token)
       let payload = {
         member: JSON.parse(fullRealmUser).customData._id,
         token: token
       }

       setRecipeAccepted("Just a moment while we find that recipe...")

       dispatch(claimRecipe(payload))
     }
     else {
       localStorage.setItem('recipe_claim_token', token);
     }
  },[])

  return (
    <div className="verificationView">
      <b>{recipeAccepted}</b>
      <br></br>
      { fullRealmUser && fullRealmUser.length > 0 ?
        <div>{JSON.parse(fullRealmUser).customData.name}</div>
      : <div className="accept_recipe_flow">
        <b>Access your account,</b>
        <br></br>
        <b>to claim this recipe.</b>
        <ul className="not-logged-in-banner">
          <li key='1'>
            <a href="/login">
              <div className="login-text login-text--pushDown login-text--shadow">Login</div>
            </a>
          </li>
          <li key='2'>
            <a href="/signup">
              <div className="login-text login-text--pushDown login-text--shadow">Signup</div>
            </a>
          </li>
        </ul>
      </div>}
    </div>
  )
}
