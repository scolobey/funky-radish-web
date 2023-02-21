import React, { useState, useEffect } from "react";
import { connect, useSelector, useDispatch } from 'react-redux'
import { Helmet } from "react-helmet";

import { loadIngredients, warning } from "../actions/Actions";

// import useFeaturedRecipes from "../graphql/useFeaturedRecipes";

import { Link } from 'react-router-dom';

export default function IngredientView(props) {

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

      <div className="search_description">
        <h2>{ ings[0].name } was detected in { ings[0].recipes.length } { ings[0].recipes.length > 1 ? ('recipes') : ('recipe')} in our database.</h2>

        <h2>Typical measurements for this ingredient include: { ings[0].units.join(", ") }</h2>

        { ings.length > 1 ? (
          <div>
            <h2>Related Ingredients:</h2>
            <ul>
              {ings.slice(1).map((ingredient, index) => (
                <li key={index + "-" +ingredient.name}>
                  {ingredient.name}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div></div>
        )}
      </div>

    </div>
  ):(
    <div></div>
  ));
}
