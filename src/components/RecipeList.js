import React from "react";
import useRecipes from "../graphql/useRecipes";
import { useRealmApp } from "../RealmApp";

export default function RecipeList() {

  const app = useRealmApp();

  console.log("loading the realm recipe list.")

  const { loading, data } = useRecipes();

  if(data) {
    console.log("hereweare: " + data.recipes)
  }

  return loading ? (
      <div>
        Loading
      </div>
    ) : (
      <div>
      { !data?.recipes ? (
        <div>
          <h1>No Recipes</h1>
        </div>
      ) : (
          data.recipes.map((recipe) => (
            <div key={recipe._id}>
              {recipe.title}
            </div>
          ))
      )}
      </div>
  );
}
