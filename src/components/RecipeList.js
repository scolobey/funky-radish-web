import React, { useState, useEffect } from "react";
import useRecipes from "../graphql/useRecipes";
import { Link } from 'react-router-dom';

export default function RecipeList(props) {

  const { loading, error, data } = useRecipes(props.author);
  let rec = data?.recipes ?? []

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
