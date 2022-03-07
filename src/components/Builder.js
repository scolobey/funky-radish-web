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
    [ draftRecipe, setDraftRecipe, setBaseIngredients, setBaseDirections, loadingActive, setLoadingActive ],
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

  // Data incoming?
  if (data && !recipeInProgress) {
    console.log("data coming in. And recipe is not in progress.")

    // Convert recipe data to strings for comparison
    let draftRecipeIngredients = draftRecipe.ingredients.create.map(ingredientListing => {return ingredientListing.name}).join("\n")
    let dataRecipeIngredients = data.recipe.ingredients.map(ingListing => {return ingListing.name}).join("\n")

    let draftRecipeDirections = draftRecipe.directions.create.map(directionListing => {return directionListing.text}).join("\n")
    let dataRecipeDirections = data.recipe.directions.map(dirListing => {return dirListing.text}).join("\n")

    // If incoming data is different from draftRecipe
    // Make the draftRecipe look like the data
    // and reset the base lists
    if ((draftRecipeIngredients !== dataRecipeIngredients) || (draftRecipeDirections !== dataRecipeDirections) || (draftRecipe.title !== data.recipe.title)) {

      let dirList = dataRecipeDirections.split(/\r?\n/).map(directionText => {
        return { _id: ObjectId().valueOf(), author: data.recipe.author, text: directionText }
      });

      let dirObject = {
        create: dirList,
        link: [recipeID]
      }

      let ingList = dataRecipeIngredients.split(/\r?\n/).map(ingredientName => {
        return { _id: new ObjectId(), author: draftRecipe.author, name: ingredientName }
      });

      let ingObject = {
        create: ingList,
        link: [recipeID]
      }

      setDraftRecipe({
        _id: recipeID,
        author: data.recipe.author,
        title: data.recipe.title,
        ingredients: ingObject,
        directions: dirObject
      });

      let baseIngList = data.recipe.ingredients.map(ingListing => {return ingListing._id})
      let baseDirList = data.recipe.directions.map(dirListing => {return dirListing._id})

      setBaseIngredients(baseIngList)
      setBaseDirections(baseDirList)
    }

    // Barrier against run conditions.
    if (loadingActive) {
      console.log("setting loader to false")
      setLoadingActive(false)
    };
  } else if (data && loadingActive){
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

    let ingList = ingredients.split(/\r?\n/).map(ingredientName => {
      return { _id: ObjectId().valueOf(), author: draftRecipe.author, name: ingredientName }
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

    console.log("changin direc: " + directions)

    // gotta check for 1 liners. where this split doesnt work.
    // let gqlDirections = arrayToDirections(directions.split(/\r?\n/))

    // console.log("direc obj: " + JSON.stringify(gqlDirections))

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

  const submitDraftRecipe = async (ing, dir) => {
    console.log("Saving recipe: " + JSON.stringify(draftRecipe))

    // Make sure the right fields are populated
    if (draftRecipe.ingredients.create.length < 1 && draftRecipe.directions.create.length < 1 || draftRecipe.title.length < 1) {
      return dispatch(warning("Empty fields."))
    }

    setLoadingActive(true)

    if (!recipeID || recipeID == "") {
      console.log("adding new recipe")
      await addRecipe(draftRecipe).then((rec) => {
        console.log("the recipe should be there.")
        setLoadingActive(false)

        dispatch(setRedirect("/builder/" + draftRecipe._id))
      });


    }
    else {
      let rec = {
        recipeId: draftRecipe._id,
        oldIngredients: ing,
        oldDirections: dir,
        updates: draftRecipe
      }

      console.log("updating recipe: " + JSON.stringify(rec))

      await updateRecipe(rec).then((resp) => {
        setLoadingActive(false)
        return dispatch(warning("recipe updated"))
      }).catch(err => {
        setLoadingActive(false)
        return dispatch(warning("recipe updated error: " + err))
      });
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

      setLoadingActive(false)
    })
    .catch(err => {
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
    console.log("dir arr: " + directionArray.length)
      let directionObject = {
        create: directionArray
        .map((dir) => {
          console.log(dir)
          return { _id: ObjectId().valueOf(), author: currentRealmUser, text: dir }
        })
        .filter(x => x.text != null),
        link: [newRecipeID]
      }
      return directionObject
  }

  function arrayToIngredients(ingredientString) {
    let ingredientObject = {
      create: ingredientString
      .map((ing) => {
        return { _id: ObjectId().valueOf(), author: currentRealmUser, name: ing }
      })
      .filter(x => x.name != null),
      link: [newRecipeID]
    }

    return ingredientObject
  }

  // format GQl data for display
  function directionsToString(directionObject) {

      // return directionString
  }

  function ingredientsToString(ingredientObject) {

      // return directionString
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
      directions: {create: [], link: [newRecipeID]}
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
    [ draftRecipe, setDraftRecipe, setBaseIngredients, setBaseDirections, loadingActive, setLoadingActive ],
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
