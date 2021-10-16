import React, { useState, useEffect } from 'react';
import useNewRecipe from "../graphql/useNewRecipe";
import { ObjectId } from "bson";
import useRecipe from "../graphql/useRecipe";

let currentRealmUser = localStorage.getItem('realm_user');
let newID = new ObjectId()

function useDraftRecipe({ addRecipe, updateRecipe, deleteRecipe }, [ draftRecipe, setDraftRecipe ]) {

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
    console.log("title set: " + title)
    setDraftRecipe({
      _id: newID,
      author: currentRealmUser,
      title: title,
      ingredients: draftRecipe.ingredients,
      directions: draftRecipe.directions
    });
  };

  const setDraftRecipeIngredients = (ingredients) => {
    console.log("ingredients set")

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
    console.log("directions set")

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
    if (draftRecipe._id == newID) {
      console.log("this is a new recipe. On the return, we should set newID to something new again.")
      let returnedRecipe = await addRecipe(draftRecipe).then(() => {console.log("some kinda returnage I guess")});
      console.log("returned recipe is: " + returnedRecipe)
      newID = new ObjectId()
    }
    else {
      console.log("this should be a not a new recipe. This shoudl be a recipe downloadeded from the ole internet.")
      let returnedRecipe = await updateRecipe(draftRecipe).then(() => {console.log("some kinda returnage I guess")});
      console.log("returned recipe is: " + returnedRecipe)
    }
  };

  const submitDeleteRecipe = async () => {

    if (window.confirm('Are you sure you wish to delete this item?')) {
      console.log("deleting: " + draftRecipe._id)

      //If it's a new recipe, just clear it out.
      if (draftRecipe._id == newID) {
        console.log("a new recipe. We'll just clear the form")
        // If this doesn't work, maybe this.resetDraftRecipe() will work. Or we just do it the easy way and reuse code.
        resetDraftRecipe()
      }
      else {
        // here we gotta delete for real.
        console.log("deleting recipe: " + draftRecipe._id)
        let deletedResponse = await deleteRecipe(draftRecipe).then((obj) => {console.log("some kinda returnage from rec delete: " + obj)});
        console.log("returned recipe is: " + deletedResponse)

        //After deleting, we should set newID to something new again.
        newID = new ObjectId()
      }
    } else {
      console.log("deleting canceled")
    }
  };

  return {
    resetDraftRecipe,
    createDraftRecipe,
    deleteDraftRecipe,
    setDraftRecipeTitle,
    setDraftRecipeIngredients,
    setDraftRecipeDirections,
    submitDraftRecipe,
    setDraftRecipeComplete,
    submitDeleteRecipe
  };
}

export default function Builder(props) {
  let recipeIdentification = props.match.params.recipeId

  const { loading, error, data } = useRecipe(recipeIdentification);

  // We have this issue where a recipe being edited maintains a different state than what has been saved to Realm cloud.
  // In progress means we've disabled the seamless reloading from cloud.
  const [ recipeInProgress, setRecipeInProgress ] = React.useState(false)

  const [ draftRecipe, setDraftRecipe ] = React.useState(
    {
      _id: newID,
      author: "",
      title: "",
      ingredients: {create: [], link: [newID]},
      directions: {create: [], link: [newID]}
    }
  )

  const { addRecipe, updateRecipe, deleteRecipe } = useNewRecipe(draftRecipe);

  const {
    resetDraftRecipe,
    createDraftRecipe,
    deleteDraftRecipe,
    setDraftRecipeTitle,
    setDraftRecipeIngredients,
    setDraftRecipeDirections,
    submitDraftRecipe,
    setDraftRecipeComplete,
    submitDeleteRecipe
  } = useDraftRecipe({ addRecipe, updateRecipe, deleteRecipe }, [ draftRecipe, setDraftRecipe ]);

  if (loading) {
    return 'Loading...';
  }

  if (data && !recipeInProgress) {
    let draftRecipeIngredients = draftRecipe.ingredients.create.map(ingredientListing => {return ingredientListing.name}).join("\n")
    let dataRecipeIngredients = data.recipe.ingredients.map(ingListing => {return ingListing.name}).join("\n")

    let draftRecipeDirections = draftRecipe.directions.create.map(directionListing => {return directionListing.text}).join("\n")
    let dataRecipeDirections = data.recipe.directions.map(dirListing => {return dirListing.text}).join("\n")

    if ((draftRecipeIngredients != dataRecipeIngredients) || (draftRecipeDirections != dataRecipeDirections) || (draftRecipe.title != data.recipe.title)) {
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

      <button type="clear" onClick={e => {
          e.preventDefault();
          if (window.confirm('Are you sure you want to clear the form? Unsaved changes will be lost.')) {
            setRecipeInProgress(true)
            resetDraftRecipe()
          } else {
            console.log("clear canceled")
          }
        }}>
        Clear
      </button>

      <button type="delete" onClick={e => {
          e.preventDefault();
          console.log("deleting")
          submitDeleteRecipe()
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
              setRecipeInProgress(true)
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
              setRecipeInProgress(true)
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
              setRecipeInProgress(true)
              setDraftRecipeDirections(event.target.value);
            }}
          />
        </div>

      </div>
      </form>
    </div>
  )
}
