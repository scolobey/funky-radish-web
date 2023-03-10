import {
  ADD_RECIPE,
  UPDATE_RECIPE,
  RECIPES_LOADED,
  EXTERNAL_RECIPES_LOADED,
  SET_RECIPE,
  DELETE_LOCAL_RECIPE,
  CLEAR_RECIPES,
  SET_USERNAME,
  TOGGLE_MENU,
  TOGGLE_LOADER,
  WARNING,
  WARNING_TOGGLE,
  SET_REDIRECT,
  SEARCH,
  SET_VERIFIED,
  SET_IMPORT_QUEUE,
  SET_SEARCH_SUGGESTIONS,
  SET_DRAFT_RECIPE,
  SET_FEATURED_RECIPES,
  INGREDIENT_DATA_LOADED
 } from "../constants/action-types";

function rootReducer(state, action) {
  if (action.type === ADD_RECIPE) {
    return Object.assign({}, state, {
      recipes: state.recipes.concat(action.recipe)
    });
  }

  if (action.type === CLEAR_RECIPES) {
    return Object.assign({}, state, {
      recipes: []
    });
  }

  if (action.type === RECIPES_LOADED) {
    let recList = action.recipes.map(rec => {
       let recipeObject = {}
       recipeObject["_id"] = rec.id
       recipeObject["title"] = rec.title

       return recipeObject
    })

    return Object.assign({}, state, {
      recipes: recList,
      filteredRecipes: recList
    });
  }

  if (action.type === EXTERNAL_RECIPES_LOADED) {

    let recList = action.searchResponse.recipes.map(rec => {
       let recipeObject = {}
       recipeObject["_id"] = rec._id
       recipeObject["title"] = rec.title
       recipeObject["author"] = rec.author
       recipeObject["ing"] = rec.ing
       recipeObject["dir"] = rec.dir

       return recipeObject
    })

    let searchConfig = action.searchResponse.config || {}

    // set redirect...

    return Object.assign({}, state, {
      externalRecipes: recList,
      searchConfig: searchConfig
    });
  }

  if (action.type === UPDATE_RECIPE) {
    // find the recipes index position.
    var elementPos = state.recipes.map(function(rec) {return rec.clientID; }).indexOf(action.recipe.clientID);

    // replace with action.recipe
    if (elementPos !== -1 ) {
      state.recipes[elementPos] = action.recipe
    }

    return Object.assign({}, state, {
      recipes: state.recipes
    });
  }

  if (action.type === SET_USERNAME) {
    return Object.assign({}, state, {
      user: action.user
    });
  }

  if (action.type === SET_VERIFIED ) {
    console.log("setting verified: ", action.verificationMessage)
    return Object.assign({}, state, {
      verified: action.verificationMessage
    });
  }

  if (action.type === TOGGLE_MENU) {
    return Object.assign({}, state, {
      menu: !state.menu
    });
  }

  if (action.type === SET_RECIPE ) {
    return Object.assign({}, state, {
      recipe: action.recipe
    });
  }

  if (action.type === DELETE_LOCAL_RECIPE ) {
    let recipeList = state.recipes.filter(function(recipe ) {
      return recipe.clientID !== action.recipeID;
    });

    return Object.assign({}, state, {
      recipes: recipeList
    });
  }

  if (action.type === TOGGLE_LOADER) {
    return Object.assign({}, state, {
      loader: action.loader
    });
  }

  if (action.type === WARNING) {
    return Object.assign({}, state, {
      warnings: state.warnings.concat({message: action.error})
    });
  }

  if (action.type === WARNING_TOGGLE) {
    return Object.assign({}, state, {
      warnings: state.warnings.slice(1)
    });
  }

  if (action.type === SET_REDIRECT) {
    console.log("redirect set: " + action.redirect)
    return Object.assign({}, state, {
      redirect: action.redirect
    });
  }

  if (action.type === SET_DRAFT_RECIPE) {
    console.log("SET_DRAFT_RECIPE reducer called: " + JSON.stringify(action.recipe))

    return Object.assign({}, state, {
      draftRecipe: action.recipe
    });
  }

  if (action.type === SEARCH) {
    //
    // let recipeList = state.recipes.filter(function(recipe ) {
    //   return recipe.title.toLowerCase().includes(action.query.toLowerCase());
    // });
    //
    // return Object.assign({}, state, {
    //   filteredRecipes: recipeList
    // });

    return Object.assign({}, state, {
      query: action.query
    });
  }

  if (action.type === SET_IMPORT_QUEUE) {
    return Object.assign({}, state, {
      importQueue: action.queue
    });
  };

  if (action.type === SET_SEARCH_SUGGESTIONS) {
    return Object.assign({}, state, {
      suggestions: action.suggestions
    });
  };

  if (action.type === SET_FEATURED_RECIPES) {
    return Object.assign({}, state, {
      featuredRecipes: action.payload
    });
  }

  if (action.type === SET_FEATURED_RECIPES) {
    return Object.assign({}, state, {
      featuredRecipes: action.payload
    });
  }

  if (action.type === INGREDIENT_DATA_LOADED) {
    console.log("setting ing data");
    return Object.assign({}, state, {
      ingredientData: action.ingredientData
    });
  }

  return state;
};



export default rootReducer;
