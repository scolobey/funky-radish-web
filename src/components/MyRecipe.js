import React from "react";
import useRecipe from "../graphql/useRecipe";
import { Helmet } from "react-helmet";

export default function MyRecipe(props) {

  console.log(typeof props.match.params.recipeId)
  let recId = props.match.params.recipeId

  const { loading, error, data } = useRecipe(recId);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div className="Recipe">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{data.recipe.title}</title>
        <meta name="description" content= {"Recipe for: " + data.recipe.title + ". "} />
      </Helmet>

      <div className="Title">
        <b>{data.recipe.title}</b>
      </div>

      <div className="Ingredients">
        {data.recipe.ingredients ? (
          <ul>
            {data.recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.name}
              </li>
            ))}
          </ul>
        ):
        (<div></div>)}
      </div>)

      <div className="Directions">
        {data.recipe.directions ? (
          <ol>
            {data.recipe.directions.map((direction, index) => (
              <li key={index}>
                {direction.text}
              </li>
            ))}
          </ol>
        ):
        (<div></div>)}
      </div>

    </div>
  );
}
