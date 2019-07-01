import { ADD_RECIPE, UPDATE_RECIPE, RECIPES_LOADED, SET_RECIPE, DELETE_LOCAL_RECIPE, CLEAR_RECIPES, SET_USERNAME, TOGGLE_MENU, TOGGLE_LOADER, WARNING, WARNING_TOGGLE, SET_REDIRECT, SEARCH } from "../constants/action-types";

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
    return Object.assign({}, state, {
      redirect: "/",
      recipes: action.payload,
      filteredRecipes: action.payload
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
    if (state.recipes.length < 1) {
      return Object.assign({}, state, {
        loader: action.loader
      });
    }
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
    return Object.assign({}, state, {
      redirect: action.redirect
    });
  }

  if (action.type === SEARCH) {
    let recipeList = state.recipes.filter(function(recipe ) {
      return recipe.title.toLowerCase().includes(action.query.toLowerCase());
    });

    return Object.assign({}, state, {
      filteredRecipes: recipeList
    });
  }

  return state;
};

export default rootReducer;
