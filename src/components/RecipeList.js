import React, { useState, useEffect } from "react";
import useRecipes from "../graphql/useRecipes";
import { Link } from 'react-router-dom';

import RealmService from '../services/RealmService'
const realmService = new RealmService();

export default function RecipeList(props) {

  const { loading, error, data } = useRecipes(props.author);

  let rec = data?.recipes ?? []
  let realmObj = realmService.getRealm()

  if (rec) {
    console.log("user: " + realmObj.currentUser.accessToken)
    console.log("recipes: " + rec)
  }
  if (error) {
    console.log("error on apollo hook: " + error )
    console.log("user: " + Object.keys(realmObj.currentUser))
  }
  if (loading) {
    console.log("loading apollo hook")
  }

  return data?.recipes? (
      <div className="recipeView">
        {data.recipes.map((recipe) =>
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
