import React, { useState, useEffect } from 'react';
import useNewRecipe from "../graphql/useNewRecipe";
import { ObjectId } from "bson";
import useRecipe from "../graphql/useRecipe";

let currentRealmUser = localStorage.getItem('realm_user');
let newID = new ObjectId()

function useDraftRecipe({ addRecipe }, [ draftRecipe, setDraftRecipe ]) {

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
    let ingList = ingredients.split(/\r?\n/).map(ingredientName => {
      console.log(ingredientName)
      return { _id: new ObjectId(), author: currentRealmUser, name: ingredientName }
    });

    let ingObject = {
      create: ingList,
      link: [newID]
    }

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

  const setDraftRecipeComplete = (id, title, ingredients, directions) => {
    let dirList = directions.split(/\r?\n/).map(directionText => {
      return { _id: new ObjectId(), author: currentRealmUser, text: directionText }
    });

    let dirObject = {
      create: dirList,
      link: [id]
    }

    let ingList = ingredients.split(/\r?\n/).map(ingredientName => {
      console.log(ingredientName)
      return { _id: new ObjectId(), author: currentRealmUser, name: ingredientName }
    });

    let ingObject = {
      create: ingList,
      link: [id]
    }

    setDraftRecipe({
      _id: id,
      author: currentRealmUser,
      title: title,
      ingredients: ingObject,
      directions: dirObject
    });
  };

  const submitDraftRecipe = async () => {


    // console.log(targ.target[2].value)
    // console.log(targ.target[3].value)
    // console.log(targ.target[4].value)

    console.log(draftRecipe)

    // let returnedRecipe = await addRecipe(draftRecipe);
    // console.log(returnedRecipe)
  };

  return {
    resetDraftRecipe,
    createDraftRecipe,
    deleteDraftRecipe,
    setDraftRecipeTitle,
    setDraftRecipeIngredients,
    setDraftRecipeDirections,
    submitDraftRecipe,
    setDraftRecipeComplete
  };
}

export default function BuilderProxy(props) {
  let recipeIdentification = props.match.params.recipeId

  const { loading, error, data } = useRecipe(recipeIdentification);

  const [ draftRecipe, setDraftRecipe ] = React.useState(
    {
      _id: newID,
      author: "",
      title: "",
      ingredients: {create: [], link: [newID]},
      directions: {create: [], link: [newID]}
    }
  )

  const { addRecipe } = useNewRecipe(draftRecipe);

  const {
    resetDraftRecipe,
    createDraftRecipe,
    deleteDraftRecipe,
    setDraftRecipeTitle,
    setDraftRecipeIngredients,
    setDraftRecipeDirections,
    submitDraftRecipe,
    setDraftRecipeComplete
  } = useDraftRecipe({ addRecipe }, [ draftRecipe, setDraftRecipe ]);

  if (loading) {
    return 'Loading...';
  }

  if (data) {
    let draftRecipeIngredients = draftRecipe.ingredients.create.map(ingredientListing => {return ingredientListing.name}).join("\n")
    let dataRecipeIngredients = data.recipe.ingredients.map(ingListing => {return ingListing.name}).join("\n")

    let draftRecipeDirections = draftRecipe.directions.create.map(directionListing => {return directionListing.text}).join("\n")
    let dataRecipeDirections = data.recipe.directions.map(dirListing => {return dirListing.text}).join("\n")

    if ((draftRecipeIngredients != dataRecipeIngredients) || (draftRecipeDirections != dataRecipeDirections) || (draftRecipe.title != data.recipe.title)) {
      console.log("gotta set stuff: " + dataRecipeDirections)
      console.log("done: " + JSON.stringify(data.recipe.directions))

      setDraftRecipeComplete(recipeIdentification, data.recipe.title, dataRecipeIngredients, dataRecipeDirections )
    }
  }

  return (
    <div className="builder">
      <form onSubmit={e => {
          e.preventDefault();
          submitDraftRecipe();
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
