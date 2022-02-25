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

      { fullRealmUser && fullRealmUser.length > 0 ?
        <div>{JSON.parse(fullRealmUser).customData.name}</div>
      : <div className="accept_recipe_flow">
        <b>Access your account,</b>
        <br></br>
        <b>to claim this recipe.</b>

        <div className="not-logged-in-banner">
          <div className="not-logged-in-cta">


            <a href="./login">
              <div className="login-text login-text--pushDown login-text--shadow">Login</div>
            </a>

            <a href="./signup">
              <div className="login-text login-text--pushDown login-text--shadow">Signup</div>
            </a>

            <div className="download-icons">
              <h2>Or download the apps...</h2>
              <a href='https://play.google.com/store/apps/details?id=com.funkyradish.funky_radish&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='/play_store_badge.svg' height='75'/></a>
              <a href='https://apps.apple.com/us/app/funky-radish/id1447293832?ls=1'><img alt='Download on the App Store' src='/app_store_badge.svg' height='75'/></a>
            </div>
          </div>

        </div>

      </div>}
    </div>
  )
}
