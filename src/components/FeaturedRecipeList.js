import React, { useState, useEffect } from "react";
import { connect, useSelector, useDispatch } from 'react-redux'

import { loadFeaturedRecipes, warning } from "../actions/Actions";

// import useFeaturedRecipes from "../graphql/useFeaturedRecipes";

import { Link } from 'react-router-dom';

export default function FeaturedRecipeList(props) {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(loadFeaturedRecipes())
  }, []);

   // const { loading, error, data } = useFeaturedRecipes();

  // if(loading) {
  //   console.log("load")
  // }
  // if(error) {
  //   console.log("err" + error)
  // }
  // if(data) {
  //   console.log("data: " + data)
  // }

  var externalRecipes = useSelector((state) => state.featuredRecipes)

  // let data = { recipes: [{_id: "123", title: "burgers"}, {_id: "321", title: "shakes"}]}
  let rec = externalRecipes ?? []

  return (rec.length > 0) ? (
    <div className="featuredRecipeView">
      { rec.length > 0 ?  (
        <div className="featuredRecipeList">
          {rec.map((recipe) =>
            <div className="featuredRecipeListing" key={recipe._id.toString()}>
              <Link
                to={{
                  pathname: "/recipe/" + recipe.title.toLowerCase().replaceAll(' ', '-'),
                  state: {
                    title: recipe.title,
                    ingredients: recipe.ing
                  }
              }}>
                {recipe.title}

                {rec.ing.length > 0 ? (
                  <ul className="featuredRecipeIngredients">
                    {recipe.ing.map((ingredient) =>
                      <li>
                        {ingredient}
                      </li>
                    )}
                  </ul>
                ) : (
                  <ul className="featuredRecipeIngredients"></ul>
                )}

              </Link>
            </div>
          )}
        </div> ) : (<div></div>)
      }
    </div>
  ):(
    <div>

    </div>
  );
}
