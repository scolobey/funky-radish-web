import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import useNewRecipe from "../graphql/useNewRecipe";
import { ObjectId } from "bson";
import useRecipe from "../graphql/useRecipe";

import { setRedirect, importRecipe, addDatabaseRecipe, setDraftRecipe } from "../actions/Actions";

let currentRealmUser = localStorage.getItem('realm_user');

// newID is rather confusing...
// Because...
// 1. this id is not new in the case of editing an existing recipe.
// 2. Sometimes I cpitalize D, sometimes lowercase d
let newID = new ObjectId()

function useDraftRecipe({ addRecipe, updateRecipe, deleteRecipe }, recipeSetter, importAddress) {

  const dispatch = useDispatch()

  const createDraftRecipe = () => {
    console.log("setting to newId")
    dispatch(
      setDraftRecipe({
        _id: newID,
        author: currentRealmUser,
        title: "",
        ingredients: {create: [], link: [newID]},
        directions: {create: [], link: [newID]}
      })
    );
  };

  const deleteDraftRecipe = () => {
    console.log("setting to newId")

    dispatch(
      setDraftRecipe({
        _id: newID,
        author: currentRealmUser,
        title: "",
        ingredients: {create: [], link: [newID]},
        directions: {create: [], link: [newID]}
      })
    );
  };

  const resetDraftRecipe = () => {
    console.log("setting to newId")
    dispatch(
      setDraftRecipe({
        _id: newID,
        author: currentRealmUser,
        title: "",
        ingredients: {create: [], link: [newID]},
        directions: {create: [], link: [newID]}
      })
    );
  };

  const setDraftRecipeTitle = (title) => {
    console.log("title set: " + title)
    dispatch(
      setDraftRecipe({
        _id: recipeSetter._id,
        author: currentRealmUser,
        title: title,
        ingredients: recipeSetter.ingredients,
        directions: recipeSetter.directions
      })
    );
  };

  const setDraftRecipeIngredients = (ingredients) => {

    let ingList = ingredients.split(/\r?\n/).map(ingredientName => {
      return { _id: new ObjectId(), author: currentRealmUser, name: ingredientName }
    });

    let ingObject = {
      create: ingList,
      link: [recipeSetter._id]
    }

    dispatch(
      setDraftRecipe({
        _id: recipeSetter._id,
        author: currentRealmUser,
        title: recipeSetter.title,
        ingredients:  ingObject,
        directions: recipeSetter.directions
      })
    );
  };

  const setDraftRecipeDirections = (directions) => {

    let dirList = directions.split(/\r?\n/).map(directionText => {
      return { _id: new ObjectId(), author: currentRealmUser, text: directionText }
    });

    let dirObject = {
      create: dirList,
      link: [recipeSetter._id]
    }

    dispatch(
      setDraftRecipe({
        _id: recipeSetter._id,
        author: currentRealmUser,
        title: recipeSetter.title,
        ingredients: recipeSetter.ingredients,
        directions: dirObject
      })
    );
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

    dispatch(
      setDraftRecipe({
        _id: id,
        author: currentRealmUser,
        title: title,
        ingredients: ingObject,
        directions: dirObject
      })
    );
  };

  const submitDraftRecipe = async (id, ing, dir, dbToggle) => {
    // this gets quite unreasonably complex
    // Handling too many states.
    // 1. adding recipe to master DB
    // 2. adding recipe to account
    // 3. editing recipe in account
    // 4. editing recipe in master DB (not yet implemented)
    // And ing and dir params look different depending on this state.

    // TODO: Should I add a validation statement to escape all of this when empty recipes are identified?

    if (!dbToggle) {
      // Saving to Master DB
      // TODO: Enable editing too
      console.log("time to send to the db.")


      let rec = {
        _id: id,
        title: "noodles",
        ingredients: ing,
        directions: dir
      }

      console.log(rec)

      dispatch(addDatabaseRecipe(rec))
      return
    }
    else {
      recipeSetter._id = recipeSetter._id.toString() || ""

      if (!id || id == "") {
        await addRecipe(recipeSetter).then((rec) => {
          dispatch(setRedirect("/builder/" + recipeSetter._id))
          console.log("returned recipe is: " + rec)
        });
      }
      else {
        let rec = {
          recipeId: recipeSetter._id,
          oldIngredients: ing,
          oldDirections: dir,
          updates: recipeSetter
        }

        console.log("passing this: " + JSON.stringify(rec))

        // console.log("this should be maybe not a new recipe. This should be a recipe downloadeded from the ole internet.")
        let returnedRecipe = await updateRecipe(rec).then((resp) => {
          console.log("recipe updated I think")
        });
      }
    }
  };

  const submitDeleteRecipe = async () => {
    if (window.confirm('Are you sure you wish to delete this recipe?')) {
      //If it's a new recipe, just clear it out.
      if (recipeSetter._id == newID) {
        resetDraftRecipe()
      }
      else {
        let deletedResponse = await deleteRecipe(recipeSetter).then((obj) => {
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
    console.log("importing: " + importAddress)
    dispatch(importRecipe(importAddress))
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
    importFromAddress
  };
}

export default function Builder(props) {
  let recipeIdentification = props.match.params.recipeId

  const redirector = useSelector((state) => state.redirect)
  const recipeSetter = useSelector((state) => {

    return state.draftRecipe
  })

  React.useEffect(() => {
     createDraftRecipe()
  },[])

  const { loading, error, data } = useRecipe(recipeIdentification);

  // We have this issue where a recipe being edited maintains a different state than what has been saved to Realm cloud.
  // In progress means we've disabled the seamless reloading from cloud.
  const [ recipeInProgress, setRecipeInProgress ] = React.useState(false)

  // const [ draftRecipe, setDraftRecipe ] = React.useState(
  //   {
  //     _id: newID,
  //     author: currentRealmUser,
  //     title: "",
  //     ingredients: { create: [], link: [newID] },
  //     directions: { create: [], link: [newID] }
  //   }
  // )

  const [ baseIngredients, setBaseIngredients ] = React.useState([])

  const [ baseDirections, setBaseDirections ] = React.useState([])

  const [ importAddress, setImportAddress ] = React.useState("")

  const [ masterDatabaseToggle, setMasterDatabaseToggle ] = React.useState(true)

  const { addRecipe, updateRecipe, deleteRecipe } = useNewRecipe(recipeSetter);

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
    importFromAddress
  } = useDraftRecipe({ addRecipe, updateRecipe, deleteRecipe }, recipeSetter, importAddress);


  return (
    <div className="builder">
      <form
        onSubmit={e => {
          e.preventDefault();
          console.log("submitting with baseing: " + baseIngredients)
          console.log("submitting with basedir: " + baseDirections)
          setBaseIngredients(baseIngredients)
          setBaseDirections(baseDirections)
          if(!masterDatabaseToggle) {
            console.log(e)
            setDraftRecipeComplete(newID, e.target[4].value, e.target[5].value, e.target[6].value)
            submitDraftRecipe(newID, [], [], masterDatabaseToggle);
          } else {
            submitDraftRecipe(recipeIdentification, baseIngredients, baseDirections, masterDatabaseToggle);
          }
        }}
      >

      <label class="switch" >
        <input type="checkbox" onClick={e => {
          setMasterDatabaseToggle(!masterDatabaseToggle)
        }}></input>
        <span class="slider round"></span>
      </label>

      <div class="db_indicator">
        Import to: {masterDatabaseToggle? "Current User" : "Master DB"}
      </div>

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
            value={recipeSetter? recipeSetter.title : ""}
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
            value={recipeSetter && recipeSetter.ingredients.create.length > 0 ? recipeSetter.ingredients.create.map(ingredientListing => {return ingredientListing.name}).join("\n") : ""}
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
            value={recipeSetter && recipeSetter.directions.create.length > 0 ? recipeSetter.directions.create.map(directionListing => {return directionListing.text}).join("\n") : ""}
            onChange={(event) => {
              setRecipeInProgress(true)
              setDraftRecipeDirections(event.target.value);
            }}
          />
        </div>

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
      </form>
    </div>
  )
}
