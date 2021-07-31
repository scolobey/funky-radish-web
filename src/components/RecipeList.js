import React from "react";
import useRecipes from "../graphql/useRecipes";
import { useRealmApp } from "../RealmApp";
import { Link } from 'react-router-dom';

export default function RecipeList() {

  const app = useRealmApp();
  const { loading, data } = useRecipes();

  return loading ? (
      <div>
        Loading
      </div>
    ) : (
      <div className="recipeView">
      { !data?.recipes ? (
        <div></div>
      ) : (
          data.recipes.map((recipe) => (
            <li key={recipe._id}>
              <Link
                class="recipeListing"
                key={recipe._id}
                to={{
                  pathname: "/recipes/" + recipe._id,
                  state: {
                    title: recipe.title
                  }
                }}
              > {recipe.title} </Link>
            </li>
          ))
      )}
      </div>
  );
}
