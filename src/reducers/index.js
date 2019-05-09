import { ADD_RECIPE, FLAG_RECIPE, RECIPES_LOADED, RECIPE_LOAD_FAILED } from "../constants/action-types";

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
      console.log(action.payload);
      return Object.assign({}, state, {
        remoteRecipes: state.remoteRecipes.concat(action.payload)
      });
    }

    // ERRORS - probably better to structure as an error action that includes specific error messages?
    if (action.type === FLAG_RECIPE) {
      return Object.assign({}, state, {
        warnings: state.warnings.concat({message: "This recipe may be inappropriate.", id: action.recipeID})
      });
     }

     if (action.type === RECIPE_LOAD_FAILED) {
       return Object.assign({}, state, {
         warnings: state.warnings.concat({message: "Recipes failed to load.", error: action.error})
       });
      }

   return state;
};

export default rootReducer;
