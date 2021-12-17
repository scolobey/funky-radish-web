// TODO: Remove useEffect
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import useNewRecipe from "../graphql/useNewRecipe";
import { ObjectId } from "bson";
import useRecipe from "../graphql/useRecipe";

import { setRedirect, warning } from "../actions/Actions";

import SVGService from '../services/SVGService'
const svgService = new SVGService();

let currentRealmUser = localStorage.getItem('realm_user');

// newID is rather confusing...
// Because...
// 1. this id is not new in the case of editing an existing recipe.
// 2. Sometimes I capitalize D, sometimes lowercase d
let newID = new ObjectId()

function useDraftRecipe({ addRecipe, updateRecipe, deleteRecipe }, [ draftRecipe, setDraftRecipe ]) {

  const dispatch = useDispatch()

  const createDraftRecipe = () => {
    console.log("setting to newId")
    setDraftRecipe({
      _id: newID,
      author: currentRealmUser,
      title: "",
      ingredients: {create: [], link: [newID]},
      directions: {create: [], link: [newID]}
    });
  };

  const deleteDraftRecipe = () => {
    console.log("setting to newId")

    setDraftRecipe({
      _id: newID,
      author: currentRealmUser,
      title: "",
      ingredients: {create: [], link: [newID]},
      directions: {create: [], link: [newID]}
    });
  };

  const resetDraftRecipe = () => {
    console.log("setting to newId")

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
      _id: draftRecipe._id,
      author: currentRealmUser,
      title: title,
      ingredients: draftRecipe.ingredients,
      directions: draftRecipe.directions
    });
  };

  const setDraftRecipeIngredients = (ingredients) => {

    let ingList = ingredients.split(/\r?\n/).map(ingredientName => {
      return { _id: new ObjectId(), author: currentRealmUser, name: ingredientName }
    });

    let ingObject = {
      create: ingList,
      link: [draftRecipe._id]
    }

    setDraftRecipe({
      _id: draftRecipe._id,
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
      link: [draftRecipe._id]
    }

    setDraftRecipe({
      _id: draftRecipe._id,
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

  const submitDraftRecipe = async (id, ing, dir) => {
    draftRecipe._id = draftRecipe._id.toString()

    console.log("inspecting with prop id: " + id)

    if (!id || id == "") {
      await addRecipe(draftRecipe).then((rec) => {
        dispatch(setRedirect("/builder/" + draftRecipe._id))
        console.log("returned recipe is: " + rec)
      });
    }
    else {

      let rec = {
        recipeId: draftRecipe._id,
        oldIngredients: ing,
        oldDirections: dir,
        updates: draftRecipe
      }

      console.log("passing this: " + JSON.stringify(rec))

      // console.log("this should be maybe not a new recipe. This should be a recipe downloadeded from the ole internet.")
      let returnedRecipe = await updateRecipe(rec).then((resp) => {
        console.log("recipe updated I think")
      });
    }
  };

  const submitDeleteRecipe = async () => {
    if (window.confirm('Are you sure you wish to delete this recipe?')) {
      //If it's a new recipe, just clear it out.
      if (draftRecipe._id == newID) {
        resetDraftRecipe()
      }
      else {
        let deletedResponse = await deleteRecipe(draftRecipe).then((obj) => {
          dispatch(setRedirect("/builder/"))
          newID = new ObjectId()
          resetDraftRecipe()
        });
      }
    } else {
      console.log("delete canceled")
    }
  };

  const mintNFT = () => {
    console.log("let's try and create the SVG")
    svgService.generate(draftRecipe)
    .then((image) => {
      // dispatch(setRedirect("/builder/" + draftRecipe._id))
      console.log("image returned: " + image)
      dispatch(setRedirect("/minter/" + image))
    })
    .catch((err) => {
      console.log("didn't work: " + err.message)
      dispatch(warning(err.message))
    });
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
    submitDeleteRecipe,
    mintNFT
  };
}

export default function Builder(props) {
  let recipeIdentification = props.match.params.recipeId

  const redirector = useSelector((state) => state.redirect)

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

  const [ baseIngredients, setBaseIngredients ] = React.useState([])

  const [ baseDirections, setBaseDirections ] = React.useState([])

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
    submitDeleteRecipe,
    mintNFT
  } = useDraftRecipe({ addRecipe, updateRecipe, deleteRecipe }, [ draftRecipe, setDraftRecipe ]);

  if (loading) {
    return 'Loading...';
  }

  if (data && !recipeInProgress) {
    console.log("data arrived")

    let draftRecipeIngredients = draftRecipe.ingredients.create.map(ingredientListing => {return ingredientListing.name}).join("\n")
    let dataRecipeIngredients = data.recipe.ingredients.map(ingListing => {return ingListing.name}).join("\n")

    let draftRecipeDirections = draftRecipe.directions.create.map(directionListing => {return directionListing.text}).join("\n")
    let dataRecipeDirections = data.recipe.directions.map(dirListing => {return dirListing.text}).join("\n")

    if ((draftRecipeIngredients != dataRecipeIngredients) || (draftRecipeDirections != dataRecipeDirections) || (draftRecipe.title != data.recipe.title)) {
      setDraftRecipeComplete(recipeIdentification, data.recipe.title, dataRecipeIngredients, dataRecipeDirections )

      let ingList = data.recipe.ingredients.map(ingListing => {return ingListing._id})
      let dirList = data.recipe.directions.map(dirListing => {return dirListing._id})

      setBaseIngredients(ingList)
      console.log("setting base ing: " + ingList)
      setBaseDirections(dirList)
      console.log("setting base ing: " + dirList)
    }
  }

  return (
    <div className="builder">
      <form onSubmit={e => {
          e.preventDefault();
          console.log("submitting with baseing: " + baseIngredients)
          console.log("submitting with basedir: " + baseDirections)
          setBaseIngredients(baseIngredients)
          setBaseDirections(baseDirections)

          submitDraftRecipe(recipeIdentification, baseIngredients, baseDirections);
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
          submitDeleteRecipe()
        }}>
        Delete
      </button>

      <button type="share" onClick={e => {
          e.preventDefault();
          console.log("share the recipe")
          // Just create a token with recipe access.
        }}>
        Clear
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

        <button type="Create NFT" onClick={e => {
            e.preventDefault();
            mintNFT()
          }}>
          Mint NFT
        </button>

      </div>
      </form>
    </div>
  )
}
