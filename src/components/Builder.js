// TODO: Remove useEffect
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import useNewRecipe from "../graphql/useNewRecipe";
import { ObjectId } from "bson";
import useRecipe from "../graphql/useRecipe";

import { setRedirect, importRecipe, warning } from "../actions/Actions";

import SVGService from '../services/SVGService'
import ServerService from '../services/ServerService'

const svgService = new SVGService();
const serverService = new ServerService();

let currentRealmUser = localStorage.getItem('realm_user');
let fullRealmUser = JSON.parse(localStorage.getItem('realm_user_complete'));

// newID is rather confusing...
// Because...
// 1. this id is not new in the case of editing an existing recipe.
// 2. Sometimes I capitalize D, sometimes lowercase d
let newID = new ObjectId()

function useDraftRecipe({ addRecipe, updateRecipe, deleteRecipe }, [ draftRecipe, setDraftRecipe ], importAddress) {

  const dispatch = useDispatch()

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

    if (!id || id === "") {
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
      await updateRecipe(rec).then((resp) => {
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
        await deleteRecipe(draftRecipe).then((obj) => {
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
    })
    .catch(err => {
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
    importFromAddress,
    mintNFT
  };
}

export default function Builder(props) {
  let recipeIdentification = props.match.params.recipeId

  const redirector = useSelector((state) => state.redirect)

  //TODO: do something with the error?
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
    setDraftRecipeComplete,
    submitDeleteRecipe,
    importFromAddress,
    mintNFT
  } = useDraftRecipe({ addRecipe, updateRecipe, deleteRecipe }, [ draftRecipe, setDraftRecipe ], importAddress);

  if (loading) {
    return 'Loading...';
  }

  if (data && !recipeInProgress) {
    console.log("data arrived")

    let draftRecipeIngredients = draftRecipe.ingredients.create.map(ingredientListing => {return ingredientListing.name}).join("\n")
    let dataRecipeIngredients = data.recipe.ingredients.map(ingListing => {return ingListing.name}).join("\n")

    let draftRecipeDirections = draftRecipe.directions.create.map(directionListing => {return directionListing.text}).join("\n")
    let dataRecipeDirections = data.recipe.directions.map(dirListing => {return dirListing.text}).join("\n")

    if ((draftRecipeIngredients !== dataRecipeIngredients) || (draftRecipeDirections !== dataRecipeDirections) || (draftRecipe.title !== data.recipe.title)) {
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
