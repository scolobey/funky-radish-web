import React from "react";
import useRecipes from "../graphql/useRecipes";
import { useRealmApp } from "../RealmApp";

export default function RecipeList() {

  const app = useRealmApp();
  const { loading, data } = useRecipes();

  return loading ? (
      <div>
        Loading
      </div>
    ) : (
      <div>
      { !data?.recipes ? (
        <div></div>
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
