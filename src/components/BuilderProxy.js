import React, { useState, useEffect } from 'react';
import useNewRecipe from "../graphql/useNewRecipe";
import { ObjectId } from "bson";

let currentRealmUser = localStorage.getItem('realm_user');

let newID = new ObjectId()

console.log("id: " + newID)
console.log("realm user: " + currentRealmUser)



function useDraftRecipe({ addRecipe }) {
  const [ draftRecipe, setDraftRecipe ] = React.useState({ _id: newID, author: "", title: "", ingredients: {create: [], link: [newID]}, directions: {create: [], link: [newID]} });

  const createDraftRecipe = () => {
    setDraftRecipe({
      _id: newID,
      author: currentRealmUser,
      title: "",
      ingredients: {create: [], link: [newID]},
      directions: {create: [], link: [newID]}
    });
  };

  const deleteDraftRecipe = () => {
    setDraftRecipe({
      _id: newID,
      author: currentRealmUser,
      title: "",
      ingredients: {create: [], link: [newID]},
      directions: {create: [], link: [newID]}
    });
  };

  const resetDraftRecipe = () => {
    setDraftRecipe({
      _id: newID,
      author: currentRealmUser,
      title: "",
      ingredients: {create: [], link: [newID]},
      directions: {create: [], link: [newID]}
    });
  };

  const setDraftRecipeTitle = (title) => {
    setDraftRecipe({
      _id: newID,
      author: currentRealmUser,
      title: title,
      ingredients: draftRecipe.ingredients,
      directions: draftRecipe.directions
    });
  };

  const setDraftRecipeIngredients = (ingredients) => {
    console.log("ingredients: " + JSON.stringify(ingredients))

    let ingList = ingredients.split(/\r?\n/).map(ingredientName => {
      console.log(ingredientName)
      return { _id: new ObjectId(), author: currentRealmUser, name: ingredientName }
    });

    let ingObject = {
      create: ingList,
      link: [newID]
    }

    console.log(ingObject.create)

    setDraftRecipe({
      _id: newID,
      author: currentRealmUser,
      title: draftRecipe.title,
      ingredients:  ingObject,
      directions: draftRecipe.directions
    });
  };

  const setDraftRecipeDirections = (directions) => {
    let dirList = directions.split(/\r?\n/).map(directionText => {
      return { _id: new ObjectId(), author: currentRealmUser, text: directionText }
    });

    let dirObject = {
      create: dirList,
      link: [newID]
    }

    setDraftRecipe({
      _id: newID,
      author: currentRealmUser,
      title: draftRecipe.title,
      ingredients: draftRecipe.ingredients,
      directions: dirObject
    });
  };

  const submitDraftRecipe = async () => {
    console.log("Now we launch this MF: " + JSON.stringify(draftRecipe))
    let returnedRecipe = await addRecipe(draftRecipe);
    console.log(returnedRecipe)
  };

  return {
    draftRecipe,
    resetDraftRecipe,
    createDraftRecipe,
    deleteDraftRecipe,
    setDraftRecipeTitle,
    setDraftRecipeIngredients,
    setDraftRecipeDirections,
    submitDraftRecipe,
  };
}


export default function BuilderProxy() {

  const { addRecipe } = useNewRecipe(draftRecipe);

  const {
    draftRecipe,
    resetDraftRecipe,
    createDraftRecipe,
    deleteDraftRecipe,
    setDraftRecipeTitle,
    setDraftRecipeIngredients,
    setDraftRecipeDirections,
    submitDraftRecipe,
  } = useDraftRecipe({ addRecipe });


  return (
    <div className="builder">
      <form onSubmit={e => {
          e.preventDefault();
          submitDraftRecipe();
          console.log("submitted")
        }}
      >

      <button type="delete" onClick={e => {
          e.preventDefault();
          console.log("deleting")
          resetDraftRecipe()
        }}>
        Delete
      </button>

      <button type="submit">
        SAVE
      </button>

      <div className="recipe">

        <div className="title">
          <input
            type="text"
            className="form-control"
            placeholder="title"
            id="title"
            value={draftRecipe? draftRecipe.title : ""}
            onChange={(event) => {
              setDraftRecipeTitle(event.target.value);
            }}
          />
        </div>

        <div className="ingredients">
          <textarea
            type="text"
            className="form-control"
            placeholder="ingredients"
            id="ingredients"
            value={draftRecipe.ingredients.create.length > 0 ? draftRecipe.ingredients.create.map(ingredientListing => {return ingredientListing.name}).join("\n") : ""}
            onChange={(event) => {
              setDraftRecipeIngredients(event.target.value);
            }}
          />
        </div>

        <div className="directions">
          <textarea
            type="text"
            className="form-control"
            placeholder="directions"
            id="directions"
            value={draftRecipe.directions.create.length > 0 ? draftRecipe.directions.create.map(directionListing => {return directionListing.text}).join("\n") : ""}
            onChange={(event) => {
              setDraftRecipeDirections(event.target.value);
            }}
          />
        </div>

      </div>
      </form>
    </div>
  )
}
