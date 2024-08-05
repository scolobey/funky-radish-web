import React, { useState, useEffect } from "react";
import { connect, useSelector, useDispatch } from 'react-redux'
import { Helmet } from "react-helmet";

import { loadIngredients, warning } from "../actions/Actions";

// import useFeaturedRecipes from "../graphql/useFeaturedRecipes";

import { Link } from 'react-router-dom';

export default function MultiIngredientView(props) {

  let ingredientName = props.match.params.ingredientQuery

  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(loadIngredients(ingredientName))
  }, []);

  var ingredients = useSelector((state) => state.ingredientData)

  // let ingredients = [{"id":6,"created_at":"2023-02-20T00:48:18.595757+00:00","name":"grated ginger","recipes":["60e396cde6c060bf7f0fb294"],"units":["tablespoon"]}, {"id":6,"created_at":"2023-02-20T00:48:18.595757+00:00","name":"grated ginger","recipes":["60e396cde6c060bf7f0fb294"],"units":["tablespoon"]}]
  let ings = ingredients ?? []

  return (ings.length ? (
    <div className="ingredientView">
      <Helmet>
        <title>{ ings[0].name + " culinary uses"}</title>
        <meta name="title" content={ ings[0].name + " and its origin and culinary use."} data-react-helmet="true" />
      </Helmet>

      <h1> { ings[0].name } </h1>

      <div className="ingredient_description">
        <h3>Typical measurements for this ingredient include: <span className="highlightedIngredient">{ ings[0].units.join(", ") }</span></h3>

        <h3>{ ings[0].name } was detected in <span className="highlightedIngredient">{ ings[0].recipes.length }</span> { ings[0].recipes.length > 1 ? ('recipes') : ('recipe')} in our database.</h3>

        { ings[0].ingredientFrequency ? (
          <div>
            <h3>Ingredients: </h3>
            <div className="relatedIngredients">
              {ings[0].ingredientFrequency.reverse().map((ingTuple, index) => (
                  <a href={"/ingredients/" + ingTuple[0]}> {ingTuple[0]} {Math.round(ingTuple[1]/ings[0].recipes.length*100)}% </a>
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )}

      </div>

      { ings[0].recipes.length > 1 ? (
        <div className="recipeListContainer">
          <h3>Recipes:</h3>

          <div className="ingredientRecipeList">
            {ings[0].recipes.map((recipe, index) => (
              <div className="ingredientRecipeListRecipe">

                <Link
                  to={{
                    pathname: "/recipe/" + recipe.title.toLowerCase().replaceAll(' ', '-')
                  }}
                >
                  <div className="ingredientRecipeListing">
                    {recipe.title}
                    <ul className="featuredRecipeIngredients">
                      {recipe.ing.map((ingredientText, index) => (
                        <div className="recipeListIngredientList">
                          {ingredientText.toLowerCase().includes("brown sugar") ? (
                            <li className="highlightedIngredient">
                              {ingredientText}
                            </li>
                          ) : (
                            <li>
                              {ingredientText}
                            </li>
                          )}
                        </div>
                      ))}
                    </ul>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  ):(
    <div></div>
  ));
}
