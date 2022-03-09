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

// ID of an existing Realm Object, if present in the URL
var recipeID
// New ID, to be used in recipe creation
var newRecipeID = ObjectId().valueOf()

/* Key: */
// clearDraftRecipe
// setDraftRecipeTitle
// setDraftRecipeIngredients
// setDraftRecipeDirections
// submitDraftRecipe
// submitDeleteRecipe
// importFromAddress
// mintNFT

function useDraftRecipe(
    [ draftRecipe, setDraftRecipe, baseIngredients, setBaseIngredients, baseDirections, setBaseDirections, loadingActive, setLoadingActive ],
    importAddress
  ) {

  const dispatch = useDispatch()

  // Pass draftRecipe to GQL, get back ( Create | Update| Delete ) methods
  const { addRecipe, updateRecipe, deleteRecipe } = useNewRecipe(draftRecipe);

  // A recipe diverges from Realm during editing.
  // recipeInProgress=true disables Realm synchronization.
  const [ recipeInProgress, setRecipeInProgress ] = React.useState(false)

  const { loading, error, data } = useRecipe(recipeID);

  if (loading && !loadingActive) {
    setLoadingActive(true)
  }

  if (error && loadingActive) {
    console.log("error: loader to false")
    setLoadingActive(false)
    dispatch(warning(error.message))
  };

  // In a recipe
  // the recipe is either the same or different from the cloud
  // if the same, you can ignore it, but then when you go to save, you're saving and deleting the same shit.
  // this is either because the cloud has changed, youre editing the recipe, or the recipe has been downloaded from scratch.
  // if downloaded from scratch, you need to set the draft from the data.
  // if being edited, you need to ignore the data.
  // if the cloud has changed, you need
  if (data && !recipeInProgress) {
    console.log("data coming in.")

    // Convert recipe data to strings for comparison
    let draftRecipeIngredients = draftRecipe.ingredients.create.map(ingredientListing => {return ingredientListing.name}).join("\n")
    let dataRecipeIngredients = data.recipe.ingredients.map(ingListing => {return ingListing.name}).join("\n")

    let draftRecipeDirections = draftRecipe.directions.create.map(directionListing => {return directionListing.text}).join("\n")
    let dataRecipeDirections = data.recipe.directions.map(dirListing => {return dirListing.text}).join("\n")

    let baseIngList = data.recipe.ingredients.map(ingListing => {return ingListing._id})
    let baseDirList = data.recipe.directions.map(dirListing => {return dirListing._id})

    console.log("deleting list after incoming data")
    console.log("ing: " + baseIngList)
    console.log("dir: " + baseDirList)

    // If data is different from draftRecipe
    // Create a whole new set of ingredients and directions.
    if ((draftRecipeIngredients !== dataRecipeIngredients) || (draftRecipeDirections !== dataRecipeDirections) || (draftRecipe.title !== data.recipe.title)) {

      let dirObject = arrayToDirections(dataRecipeDirections.split(/\r?\n/))
      let ingObject = arrayToIngredients(dataRecipeIngredients.split(/\r?\n/))

      setDraftRecipe({
        _id: recipeID,
        author: data.recipe.author,
        title: data.recipe.title,
        ingredients: ingObject,
        directions: dirObject
      });

      setBaseIngredients(baseIngList)
      setBaseDirections(baseDirList)
    }

// this causes loading to turn off immediately when saving.
// How to turn off the loading after the recipe loads, but while the recipe is updating.
// Either setBaseIngredients to null
// or what's the difference between updating and loading?
// What's the data look like here?
    if (loadingActive && baseIngredients != null) {

      let draftRecipeIngredients = draftRecipe.ingredients.create.map(ingredientListing => {return ingredientListing.name}).join("\n")
      let dataRecipeIngredients = data.recipe.ingredients.map(ingListing => {return ingListing.name}).join("\n")

      console.log("setting loader to false: setting loading false")
      console.log("draft: " + draftRecipeIngredients)
      console.log("data: " + dataRecipeIngredients)

      setLoadingActive(false)
    }

  } else if (data && loadingActive) {
    console.log("data and loading - setting loader to false: setting loading false")
    setLoadingActive(false)
  }

  /* Presenting... Your recipe interaction methods */
  const clearDraftRecipe = () => {
    // This empties a recipe, but the recipeID is still there.
    // So if you empty a recipe and hit save, it will erase your recipe.
    setRecipeInProgress(true)

    console.log("id: " + recipeID)

    setDraftRecipe({
      _id: recipeID,
      author: currentRealmUser,
      title: "",
      ingredients: {create: [], link: [recipeID]},
      directions: {create: [], link: [recipeID]}
    });

    console.log("setting draft: " + JSON.stringify(draftRecipe))
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
  };

  const setDraftRecipeIngredients = (ingredients) => {
    setRecipeInProgress(true)

    let ingArray = ingredients.split(/\r?\n/)
    let ingObject = arrayToIngredients(ingArray)

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

    let directionArray = directions.split(/\r?\n/)
    let dirObject = arrayToDirections(directionArray)

    setDraftRecipe({
      _id: draftRecipe._id,
      author: draftRecipe.author,
      title: draftRecipe.title,
      ingredients: draftRecipe.ingredients,
      directions: dirObject
    });
  };

  const submitDraftRecipe = async (ing, dir) => {
    console.log("Saving Recipe")

    // Make sure the right fields are populated.
    if (draftRecipe.ingredients.create.length < 1 && draftRecipe.directions.create.length < 1 || draftRecipe.title.length < 1) {
      return dispatch(warning("Empty fields."))
    }

    if (!recipeID || recipeID == "") {
      setLoadingActive(true)
      console.log("Adding recipe: " + JSON.stringify(draftRecipe))

      await addRecipe(draftRecipe).then((rec) => {
        console.log("setting to false after addRecipe")
        setLoadingActive(false)
        dispatch(setRedirect("/builder/" + draftRecipe._id))
      });
    }
    else {
      // ing and dir are lists of the id's to ingredients and directions that should be removed from the db because they are no longer in use.
      // There is a special case where an id in ing or dir are also in draftRecipe.ingredients or draftRecipe.directions
      // This case occurs when a recipe has been updated previously but the page hasn't been reloaded yet to reset the baseIngredients and baseDirections.

      // Convert draftRecipe.ingredients and draftRecipe.directions to arrays of id's
      let currentIngredients = draftRecipe.ingredients.create.map((ing) => { return ing._id})
      let currentDirections = draftRecipe.directions.create.map((dir) => { return dir._id})

      console.log("deleting before filtering")
      console.log("ing: " + ing)
      console.log("dir: " + dir)

      // Remove those id's from ing and dir
      let finalIngredients = ing.filter( (el) => !currentIngredients.includes(el) );
      let finalDirections = dir.filter( (el) => !currentDirections.includes(el) );



      // But we also need to remove that _id from the array of ingredients or directions if it hasn't changed.

      // Adding ingredients and directions.
      console.log("adding")
      console.log("ing: " + currentIngredients)
      console.log("dir: " + currentDirections)

      // Deleting ingredients and directions
      console.log("deleting")
      console.log("ing: " + finalIngredients)
      console.log("dir: " + finalDirections)

      let rec = {
        recipeId: draftRecipe._id,
        oldIngredients: finalIngredients,
        oldDirections: finalDirections,
        updates: draftRecipe
      }

      console.log("Updating: loadingActive = true")
      setLoadingActive(true)

      await updateRecipe(rec).then((resp) => {
        console.log("this return is skipped when the thing tries to add an ingredient that's already there errors.")

        setLoadingActive(false)
        // dispatch(warning("recipe updated"))
      }).catch(err => {
        console.log("setting to false after updateRecipe catch: " + err)

        setLoadingActive(false)
      });

      console.log("setting to false after updateRecipe after the await")
      setLoadingActive(false)
    }
  };

  const submitDeleteRecipe = async () => {
    if (window.confirm('Are you sure you wish to delete this recipe?')) {
      //If it's a new recipe, just clear it out.
      if (draftRecipe._id === recipeID) {
        clearDraftRecipe()
      }
      else {
        setLoadingActive(true)

        await deleteRecipe(draftRecipe).then((obj) => {
          console.log("setting to false after deleteRecipe return")

          setLoadingActive(false)

          dispatch(setRedirect("/builder/"))
          recipeID = ObjectId()
          clearDraftRecipe()
        });
      }
    } else {
      console.log("delete canceled")
    }
  };

  const importFromAddress = async () => {
    setLoadingActive(true)
    serverService.importRecipe(importAddress)
    .then(res=> {
      let gqlIngredients = arrayToIngredients(res.ingredients)
      let gqlDirections = arrayToDirections(res.directions)

      setDraftRecipe({
        _id: newRecipeID,
        author: currentRealmUser,
        title: res.title,
        ingredients: gqlIngredients,
        directions: gqlDirections
      })

      console.log("setting to false after importRecipe")
      setLoadingActive(false)
    })
    .catch(err => {
      console.log("setting to false after importRecipe err")

      setLoadingActive(false)
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
  /* This concludes our presentation */

  /* helpers for the ^^ */
  // format string Arrays for GQL update
  function arrayToDirections(directionArray) {
    let directionObject = {
      create: directionArray
      .map((dir) => {
        return { _id: ObjectId().valueOf(), author: currentRealmUser, text: dir }
      }),
      link: [newRecipeID]
    }

    return directionObject
  }

  function arrayToIngredients(ingredientArray) {
    let ingredientObject = {
      create: ingredientArray
      .map((ing) => {
        return { _id: ObjectId().valueOf(), author: currentRealmUser, name: ing }
      }),
      link: [newRecipeID]
    }

    return ingredientObject
  }

  return {
    clearDraftRecipe,
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
  const redirector = useSelector((state) => state.redirect)

  const [ importAddress, setImportAddress ] = React.useState("")
  const [ loadingActive, setLoadingActive ] = React.useState(false)

  // Arrays of Realm ID's. This tells us which objects to delete before adding new ingredients.
  const [ baseIngredients, setBaseIngredients ] = React.useState([])
  const [ baseDirections, setBaseDirections ] = React.useState([])

  // If there's an ID in the URL, set the recipeID
  let paramID = props.match.params.recipeId
  var checkForHex = new RegExp("^[0-9a-fA-F]{24}$")

  if (paramID && paramID.length > 0 && checkForHex.test(paramID)) {
    recipeID = props.match.params.recipeId
  }

  // Initialize the draftRecipe.
  // If there's a recipeID, the draft recipe will be updated by the recipeInterface
  const [ draftRecipe, setDraftRecipe ] = React.useState(
    {
      _id: newRecipeID,
      author: currentRealmUser,
      title: "",
      ingredients: {create: [], link: [newRecipeID]},
      directions: {create: [], link: [newRecipeID]},
    }
  )

  // Pass CRUD methods and other important data to draftRecipeInterface, get back all of the tools that your view will need.
  const {
    clearDraftRecipe,
    setDraftRecipeTitle,
    setDraftRecipeIngredients,
    setDraftRecipeDirections,
    submitDraftRecipe,
    submitDeleteRecipe,
    importFromAddress,
    mintNFT
  } = useDraftRecipe(
    [ draftRecipe, setDraftRecipe, baseIngredients, setBaseIngredients, baseDirections, setBaseDirections, loadingActive, setLoadingActive ],
    importAddress
  );

  return (
    <div className="builder">

      {/* Recipe controls: save, clear, delete */}
      <form onSubmit={e => {
          e.preventDefault();
          submitDraftRecipe(baseIngredients, baseDirections);
      }}>
      <button type="submit">
        SAVE
      </button>
      <button type="clear" onClick={e => {
          e.preventDefault();
          if (window.confirm('Are you sure you want to clear the form? Unsaved changes will be lost.')) {
            clearDraftRecipe()
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

      {/* Recipe fields: title, ingredients, directions */}
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

        {/* Allow import for new recipes */}
        { !recipeID || recipeID.length === 0 ?
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
        : <div></div>}

        {/* If admin, allow NFT creation */}
        { fullRealmUser && fullRealmUser.customData.admin ?
          <button type="Create NFT" onClick={e => {
              e.preventDefault();
              mintNFT()
            }}>
            Mint NFT
          </button>
        : <div></div> }

        {/* state-based loader */}
        { loadingActive ?
          <div className="loader">Loading...</div>
        : <div></div> }

      </div>

      </form>
    </div>
  )
}
