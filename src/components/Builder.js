// TODO: Remove useEffect
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import useNewRecipe from "../graphql/useNewRecipe";
import { ObjectId } from "bson";
import useRecipe from "../graphql/useRecipe";

import { setRedirect, importRecipe, warning, toggleLoader } from "../actions/Actions";

import SVGService from '../services/SVGService'
import ServerService from '../services/ServerService'

import Loader from "./Loader";

const svgService = new SVGService();
const serverService = new ServerService();

let currentRealmUser = localStorage.getItem('realm_user');
let fullRealmUser = JSON.parse(localStorage.getItem('realm_user_complete'));

// newID is rather confusing...
// Because...
// 1. this id is not new in the case of editing an existing recipe.
// 2. Sometimes I capitalize D, sometimes lowercase d
let newID = new ObjectId()

// Key:
// createDraftRecipe
// deleteDraftRecipe
// resetDraftRecipe
// setDraftRecipeTitle
// setDraftRecipeIngredients
// setDraftRecipeDirections
// submitDraftRecipe
// submitDeleteRecipe
// mintNFT
// setDraftRecipeComplete

function useDraftRecipe({ addRecipe, updateRecipe, deleteRecipe }, [ draftRecipe, setDraftRecipe, setBaseIngredients, setBaseDirections ], importAddress, recipeIdentification) {

  const dispatch = useDispatch()

  // A recipe which is being edited maintains a different state than what has been saved to Realm cloud.
  // In progress means we've disabled the seamless reloading from cloud.
  const [ recipeInProgress, setRecipeInProgress ] = React.useState(false)

  const { loading, error, data } = useRecipe(recipeIdentification);

  if (loading) {
    dispatch(toggleLoader(true))
  }

  if (error) {
    dispatch(toggleLoader(false))
    dispatch(warning(error.message))
  };

  // So, if the recipe comes in, and it's not currently being worked on.
  // That's when you might wanna set the recipe.
  if (data && !recipeInProgress) {
    dispatch(toggleLoader(false))

    let draftRecipeIngredients = draftRecipe.ingredients.create.map(ingredientListing => {return ingredientListing.name}).join("\n")
    let dataRecipeIngredients = data.recipe.ingredients.map(ingListing => {return ingListing.name}).join("\n")

    let draftRecipeDirections = draftRecipe.directions.create.map(directionListing => {return directionListing.text}).join("\n")
    let dataRecipeDirections = data.recipe.directions.map(dirListing => {return dirListing.text}).join("\n")

    // First check if anything has changed.
    if ((draftRecipeIngredients !== dataRecipeIngredients) || (draftRecipeDirections !== dataRecipeDirections) || (draftRecipe.title !== data.recipe.title)) {
      setDraftRecipeComplete(recipeIdentification, data.recipe.title, dataRecipeIngredients, dataRecipeDirections )

      let ingList = data.recipe.ingredients.map(ingListing => {return ingListing._id})
      let dirList = data.recipe.directions.map(dirListing => {return dirListing._id})

      setBaseIngredients(ingList)
      setBaseDirections(dirList)
    }
  }

  const createDraftRecipe = () => {
    setDraftRecipe({
      _id: newID,
      author: currentRealmUser,
      title: "",
      ingredients: {create: [], link: [newID]},
      directions: {create: [], link: [newID]}
    });
    console.log("created draft: " + newID + " " + currentRealmUser)
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
    setRecipeInProgress(true)

    setDraftRecipe({
      _id: newID,
      author: currentRealmUser,
      title: "",
      ingredients: {create: [], link: [newID]},
      directions: {create: [], link: [newID]}
    });
  };

  const setDraftRecipeTitle = (title) => {
    setRecipeInProgress(true)

    setDraftRecipe({
      _id: draftRecipe._id ,
      author: draftRecipe.author,
      title: title,
      ingredients: draftRecipe.ingredients,
      directions: draftRecipe.directions
    });

    console.log("set title. Author: " + draftRecipe.author + " _id: " + draftRecipe._id)
  };

  const setDraftRecipeIngredients = (ingredients) => {
    setRecipeInProgress(true)

    let ingList = ingredients.split(/\r?\n/).map(ingredientName => {
      return { _id: new ObjectId(), author: draftRecipe.author, name: ingredientName }
    });

    let ingObject = {
      create: ingList,
      link: [draftRecipe._id]
    }

    setDraftRecipe({
      _id: draftRecipe._id,
      author: draftRecipe.author,
      title: draftRecipe.title,
      ingredients:  ingObject,
      directions: draftRecipe.directions
    });
  };

  const setDraftRecipeDirections = (directions) => {
    setRecipeInProgress(true)

    let dirList = directions.split(/\r?\n/).map(directionText => {
      return { _id: new ObjectId(), author: draftRecipe.author, text: directionText }
    });

    let dirObject = {
      create: dirList,
      link: [draftRecipe._id]
    }

    setDraftRecipe({
      _id: draftRecipe._id,
      author: draftRecipe.author,
      title: draftRecipe.title,
      ingredients: draftRecipe.ingredients,
      directions: dirObject
    });
  };

  const submitDraftRecipe = async (id, ing, dir) => {
    draftRecipe._id = draftRecipe._id.toString()

    console.log("Saving recipe: " + draftRecipe)

    dispatch(toggleLoader(true))

    if (!id || id === "") {
      await addRecipe(draftRecipe).then((rec) => {
        dispatch(toggleLoader(false))
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


      // console.log("this should be maybe not a new recipe. This should be a recipe downloadeded from the ole internet.")
      await updateRecipe(rec).then((resp) => {
        dispatch(toggleLoader(false))
        console.log("recipe updated I think")
      });
    }
  };

  const submitDeleteRecipe = async () => {
    if (window.confirm('Are you sure you wish to delete this recipe?')) {
      //If it's a new recipe, just clear it out.
      if (draftRecipe._id === newID) {
        resetDraftRecipe()
      }
      else {
        dispatch(toggleLoader(true))

        await deleteRecipe(draftRecipe).then((obj) => {
          dispatch(toggleLoader(false))
          dispatch(setRedirect("/builder/"))
          newID = new ObjectId()
          resetDraftRecipe()
        });
      }
    } else {
      console.log("delete canceled")
    }
  };

  const importFromAddress = async () => {
    dispatch(toggleLoader(true))
    serverService.importRecipe(importAddress)
    .then(res=> {
      let dirObject = {
        create: res.directions.map((dir) => {return { _id: new ObjectId(), author: currentRealmUser, text: dir }}),
        link: [newID]
      }

      let ingObject = {
        create: res.ingredients.map((ing) => { return { _id: new ObjectId(), author: currentRealmUser, name: ing }}),
        link: [newID]
      }

      setDraftRecipe({
        _id: newID,
        author: currentRealmUser,
        title: res.title,
        ingredients: ingObject,
        directions: dirObject
      });

      dispatch(toggleLoader(false))
    })
    .catch(err => {
      dispatch(toggleLoader(false))
      return dispatch(warning("Import failed: " + err))
    })
  }

  const mintNFT = () => {
    console.log("let's try and create the SVG")
    svgService.generate(draftRecipe)
    .then((image) => {
      // dispatch(setRedirect("/builder/" + draftRecipe._id))
      console.log("image returned: " + image)
      dispatch(setRedirect("/minter/"))
    })
    .catch((err) => {
      console.log("didn't work: " + err.message)
      dispatch(warning(err.message))
    });
  };

  function setDraftRecipeComplete(id, title, ingredients, directions) {
    let dirList = directions.split(/\r?\n/).map(directionText => {
      return { _id: new ObjectId(), author: draftRecipe.author, text: directionText }
    });

    let dirObject = {
      create: dirList,
      link: [id]
    }

    let ingList = ingredients.split(/\r?\n/).map(ingredientName => {
      return { _id: new ObjectId(), author: draftRecipe.author, name: ingredientName }
    });

    let ingObject = {
      create: ingList,
      link: [id]
    }

    setDraftRecipe({
      _id: id,
      author: draftRecipe.author,
      title: title,
      ingredients: ingObject,
      directions: dirObject
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
    submitDeleteRecipe,
    importFromAddress,
    mintNFT
  };
}

export default function Builder(props) {
  let recipeIdentification = props.match.params.recipeId

  const redirector = useSelector((state) => state.redirect)

  const [ draftRecipe, setDraftRecipe ] = React.useState(
    {
      _id: newID,
      author: currentRealmUser,
      title: "",
      ingredients: {create: [], link: [newID]},
      directions: {create: [], link: [newID]}
    }
  )

  const [ baseIngredients, setBaseIngredients ] = React.useState([])
  const [ baseDirections, setBaseDirections ] = React.useState([])
  const [ importAddress, setImportAddress ] = React.useState("")

  const { addRecipe, updateRecipe, deleteRecipe } = useNewRecipe(draftRecipe);

  const {
    resetDraftRecipe,
    createDraftRecipe,
    deleteDraftRecipe,
    setDraftRecipeTitle,
    setDraftRecipeIngredients,
    setDraftRecipeDirections,
    submitDraftRecipe,
    submitDeleteRecipe,
    importFromAddress,
    mintNFT
  } = useDraftRecipe({ addRecipe, updateRecipe, deleteRecipe }, [ draftRecipe, setDraftRecipe, setBaseIngredients, setBaseDirections ], importAddress, recipeIdentification);

  return (
    <div className="builder">
      <form onSubmit={e => {
          e.preventDefault();
          setBaseIngredients(baseIngredients)
          setBaseDirections(baseDirections)

          submitDraftRecipe(recipeIdentification, baseIngredients, baseDirections);
        }}
      >

      <button type="clear" onClick={e => {
          e.preventDefault();
          if (window.confirm('Are you sure you want to clear the form? Unsaved changes will be lost.')) {
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

        { !recipeIdentification || recipeIdentification.length === 0 ?
          <div>
            <div className="title">
              <input
                type="text"
                placeholder="import url"
                id="import"
                onChange={(event) => {
                  setImportAddress(event.target.value);
                }}
              />
            </div>

            <button type="import"
              onClick={e => {
                e.preventDefault();
                importFromAddress()
              }}>
              Import
            </button>
          </div>
          : <div></div>
        }

        { fullRealmUser && fullRealmUser.customData.admin ?
          <button type="Create NFT" onClick={e => {
              e.preventDefault();
              mintNFT()
            }}>
            Mint NFT
          </button>
        : <div></div> }
      </div>
      </form>
    </div>
  )
}
