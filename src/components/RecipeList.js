import React, { useState, useEffect } from "react";
import useRecipes from "../graphql/useRecipes";
import { Link } from 'react-router-dom';

export default function RecipeList() {

  const { loading, error, data } = useRecipes();

  if(error) {console.log("gql error: " + error)}
  if(loading) {
    console.log("loading")
  }

  let rec = data?.recipes ?? [];

  return (
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
    )
  }
