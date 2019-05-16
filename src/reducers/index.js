import { ADD_RECIPE, FLAG_RECIPE, RECIPES_LOADED, SET_USERNAME, TOGGLE_MENU, TOGGLE_LOADER, WARNING, WARNING_TOGGLE } from "../constants/action-types";

const initialState = {
  recipes: [],
  warnings: [],
  remoteRecipes: []
};

function rootReducer(state = initialState, action) {
  if (action.type === ADD_RECIPE) {
     return Object.assign({}, state, {
       recipes: state.recipes.concat(action.recipe)
     });
   }

    if (action.type === RECIPES_LOADED) {
      return Object.assign({}, state, {
        redirect: true,
        remoteRecipes: action.payload
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

    // ERRORS - probably better to structure as an error action that includes specific error messages?
    if (action.type === FLAG_RECIPE) {
      return Object.assign({}, state, {
        warnings: state.warnings.concat({message: "This recipe may be inappropriate.", id: action.recipeID})
      });
     }

   return state;
};

export default rootReducer;
