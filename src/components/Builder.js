// TODO: Remove useEffect
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import useNewRecipe from "../graphql/useNewRecipe";
import { ObjectId } from "bson";
import useRecipe from "../graphql/useRecipe";

import { setRedirect, importRecipe, warning } from "../actions/Actions";

import SVGService from '../services/SVGService'
import ServerService from '../services/ServerService'

import tagList from '../utils/TagList.json'

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
    [ draftRecipe, setDraftRecipe, baseIngredients, setBaseIngredients, baseDirections, setBaseDirections, loadingActive, setLoadingActive, recipeInProgress, setRecipeInProgress ],
    importAddress,
    newImportLink
  ) {

  const dispatch = useDispatch()

  // if there's a link in the url
  if (newImportLink && !recipeInProgress) {
    console.log("this is the link: " + newImportLink);

    setRecipeInProgress(true)

    setLoadingActive(true)
    serverService.importRecipe(decodeURIComponent(newImportLink))
    .then(res=> {
      console.log("response: " + JSON.stringify(res));
      let gqlIngredients = arrayToIngredients(res.ingredients)
      let gqlDirections = arrayToDirections(res.directions)

      setDraftRecipe({
        _id: newRecipeID,
        author: currentRealmUser,
        title: res.title,
        ingredients: gqlIngredients,
        directions: gqlDirections,
        ing: res.ingredients,
        dir: res.directions
      })

      console.log("setting to false after importRecipe")
      setRecipeInProgress(true)
      setLoadingActive(false)
    })
    .catch(err => {
      console.log("setting to false after importRecipe err")
      setLoadingActive(false)
      return dispatch(warning("Import failed: " + err))
    })

  }

  // Pass draftRecipe to GQL, get back ( Create | Update | Delete ) methods
  const { addRecipe, updateRecipe, deleteRecipe } = useNewRecipe(draftRecipe);

  const { loading, error, data } = useRecipe(recipeID);

  if (loading && !loadingActive) {
    console.log("loading from useRecipe, but !loadingActive");
    setLoadingActive(true)
  }

  if (error && loadingActive) {
    console.log("error: loading is active")
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
    console.log("data coming in. Recipe is not inProgress.")

    // ing
    let draftRecipeIng = draftRecipe.ing
    let dataRecipeIng = data.recipe.ing

    // dir
    let draftRecipeDir = draftRecipe.dir
    let dataRecipeDir = data.recipe.dir

    // If data is different from draftRecipe
    // Create a whole new set of ingredients and directions.
    if ((draftRecipeIng !== dataRecipeIng) || (draftRecipeDir !== dataRecipeDir) || (draftRecipe.title !== data.recipe.title)) {
      console.log("diff between incoming and draft " + dataRecipeIng);

      setDraftRecipe({
        _id: recipeID,
        author: data.recipe.author,
        title: data.recipe.title,
        ing: dataRecipeIng,
        dir: dataRecipeDir
      });

      setRecipeInProgress(false)
      setLoadingActive(false)
    }

  } else if (data && loadingActive) {
    console.log("data coming and loadingActive: " + JSON.stringify(data))

    // setLoadingActive(false)
  }

  /* Presenting... Your recipe interaction methods */
  const clearDraftRecipe = () => {
    // This empties a recipe, but the recipeID is still there.
    // So if you empty a recipe and hit save, it will erase your recipe.
    setRecipeInProgress(true)

    setDraftRecipe({
      _id: recipeID,
      author: currentRealmUser,
      title: "",
      dir: [],
      ing: []
    });
  };

  const setDraftRecipeTitle = (title) => {
    setRecipeInProgress(true)

    setDraftRecipe({
      _id: draftRecipe._id ,
      author: draftRecipe.author,
      title: title,
      dir: draftRecipe.dir,
      ing: draftRecipe.ing
    });
  };

  const setDraftRecipeIngredients = (ingredients) => {
    setRecipeInProgress(true)

    let ingArray = ingredients.split('\n')

    setDraftRecipe({
      _id: draftRecipe._id,
      author: draftRecipe.author,
      title: draftRecipe.title,
      ing:  ingArray,
      dir: draftRecipe.dir
    });
  };

  const setDraftRecipeDirections = (directions) => {
    setRecipeInProgress(true)

    let dirArray = directions.split('\n')

    setDraftRecipe({
      _id: draftRecipe._id,
      author: draftRecipe.author,
      title: draftRecipe.title,
      ing:  draftRecipe.ing,
      dir: dirArray
    });
  };

  const submitDraftRecipe = async (ing, dir) => {
    console.log("Saving Recipe")

    ing = ing.filter(line => line.length > 0)
    dir = dir.filter(line => line.length > 0)

    // Make sure the right fields are populated.
    if (draftRecipe.ing.length < 1 && draftRecipe.dir.length < 1 || draftRecipe.title.length < 1) {
      return dispatch(warning("Empty fields."))
    }

    if (!recipeID || recipeID == "") {
      setLoadingActive(true)

      console.log("Adding a recipe: " + JSON.stringify(draftRecipe))

      await addRecipe(draftRecipe).then((rec) => {
        console.log("callback after addRecipe")
        setLoadingActive(false)
        setRecipeInProgress(false)
        dispatch(setRedirect("/builder/" + draftRecipe._id))
      });
    }
    else {
      console.log("Editing recipe: " + JSON.stringify(draftRecipe))

      let rec = {
        recipeId: draftRecipe._id,
        updates: draftRecipe
      }

      setLoadingActive(true)

      await updateRecipe(rec).then((resp) => {
        console.log("update response: " + resp)

        // dispatch(warning("recipe updated"))
      }).catch(err => {
        console.log("setting to false after updateRecipe catch: " + err)
      });

      console.log("setting to false after the await from updateRecipe")
      setLoadingActive(false)
      setRecipeInProgress(false)
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

  const importFromAddress = async (address) => {
    setLoadingActive(true)
    serverService.importRecipe(address)
    .then(res=> {
      console.log("response: " + JSON.stringify(res));
      let gqlIngredients = arrayToIngredients(res.ingredients)
      let gqlDirections = arrayToDirections(res.directions)

      setDraftRecipe({
        _id: newRecipeID,
        author: currentRealmUser,
        title: res.title,
        ingredients: gqlIngredients,
        directions: gqlDirections,
        ing: res.ingredients,
        dir: res.directions
      })

      console.log("setting to false after importRecipe")
      setRecipeInProgress(true)
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

  const [ tag, setTag ] = React.useState("")
  const [ tags, setTags ] = React.useState(["tags", "stuff"])

  // A recipe diverges from Realm during editing.
  // recipeInProgress=true disables Realm synchronization.
  const [ recipeInProgress, setRecipeInProgress ] = React.useState(false)

  // If there's an ID in the URL, set the recipeID
  let paramID = props.match.params.recipeId
  let newImportLink = ""

  var checkForHex = new RegExp("^[0-9a-fA-F]{24}$")

  if (paramID && paramID.length > 0 && checkForHex.test(paramID)) {
    recipeID = props.match.params.recipeId
  } else if (paramID && paramID.includes("http")) {
    newImportLink = props.match.params.recipeId
    console.log(newImportLink);
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
      ing: [],
      dir: []
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
    [ draftRecipe, setDraftRecipe, baseIngredients, setBaseIngredients, baseDirections, setBaseDirections, loadingActive, setLoadingActive, recipeInProgress, setRecipeInProgress ],
    importAddress,
    newImportLink
  );

  return (
    <div className="builder">

      {/* Recipe controls: save, clear, delete */}
      <form onSubmit={e => {
          e.preventDefault();
          submitDraftRecipe(baseIngredients, baseDirections);
      }}>

      <div className="builder-controls">
        { loadingActive || recipeInProgress ?
          <div className="saveIndicatorRed">
          </div>
        :
          <div className="saveIndicatorGreen">
          </div>
        }

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
      </div>

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
            value={draftRecipe.ing && draftRecipe.ing.length > 0 ? draftRecipe.ing.join("\n") : ""}
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
            value={draftRecipe.dir && draftRecipe.dir.length > 0 ? draftRecipe.dir.join("\n") : ""}
            onChange={(event) => {
              setDraftRecipeDirections(event.target.value);
            }}
          />
        </div>

        <div className="tags">
          <input
            type="text"
            className="form-control"
            placeholder="tags"
            value={tag}
            id="tags"
            onChange={(event) => {
              setTag(event.target.value)
            }}
          />
          {tags.map((tag, index) => (
            <span className="tag" onClick={(event) => {
              setTags(tags.splice(index, 1))
            }}>{tag}</span>
          ))}
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
                importFromAddress(importAddress)
              }}>
              Import
            </button>
          </div>
        : <div></div>}

        {/* If admin, allow NFT creation */}
        { fullRealmUser && fullRealmUser.customData.admin ?
          <div className="mint_button">
            <button type="Create NFT" onClick={e => {
                e.preventDefault();
                mintNFT()
              }}>
              Mint NFT
            </button>
          </div>
        : <div></div> }

      </div>

      </form>
    </div>
  )
}
