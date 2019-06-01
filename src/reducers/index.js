import { ADD_RECIPE, UPDATE_RECIPE, RECIPES_LOADED, VIEW_RECIPE, DELETE_LOCAL_RECIPE, CLEAR_RECIPES, SET_USERNAME, TOGGLE_MENU, TOGGLE_LOADER, WARNING, WARNING_TOGGLE } from "../constants/action-types";

function rootReducer(state, action) {
  if (action.type === ADD_RECIPE) {
    console.log(action.recipe);
    return Object.assign({}, state, {
      remoteRecipes: state.remoteRecipes.concat(action.recipe)
    });
  }

  if (action.type === CLEAR_RECIPES) {
    return Object.assign({}, state, {
      remoteRecipes: []
    });
  }

  if (action.type === RECIPES_LOADED) {
    return Object.assign({}, state, {
      redirect: true,
      remoteRecipes: action.payload
    });
  }

  if (action.type === UPDATE_RECIPE) {
    // find the recipes index position.
    var elementPos = state.remoteRecipes.map(function(rec) {return rec.clientID; }).indexOf(action.recipe.clientID);

    // replace with action.recipe
    if (elementPos !== -1 ) {
      console.log(elementPos);
      state.remoteRecipes[elementPos] = action.recipe
    }

    return Object.assign({}, state, {
      remoteRecipes: state.remoteRecipes
    });
  }

  if (action.type === SET_USERNAME) {
    return Object.assign({}, state, {
      user: action.user
    });
  }

  if (action.type === TOGGLE_MENU) {
    return Object.assign({}, state, {
      menu: !state.menu
    });
  }

  if (action.type === VIEW_RECIPE ) {
    return Object.assign({}, state, {
      recipe: action.recipe
    });
  }

  if (action.type === DELETE_LOCAL_RECIPE ) {
    console.log("calling reducer.");
    console.log(action.recipeID);

    let recipeList = state.remoteRecipes.filter(function(recipe ) {
      return recipe.clientID !== action.recipeID;
    });

    console.log(recipeList)

    return Object.assign({}, state, {
      remoteRecipes: recipeList
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

  return state;
};

export default rootReducer;
