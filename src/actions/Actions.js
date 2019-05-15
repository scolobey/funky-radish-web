import {
  GET_RECIPES,
  ADD_RECIPE,
  FLAG_RECIPE,
  RECIPES_LOADED,
  GET_TOKEN,
  AUTH_FAILED,
  CREATE_USER,
  LOGIN,
  SIGNUP,
  WARNING,
  SET_USERNAME
} from "../constants/action-types"

/* other constants */
export const MenuOpen = false

/* action creators */

// Error handling
export function warning(error) {
  return { type: WARNING, error }
};

// Auth
export function login(user) {
  return { type: LOGIN, user }
};

export function signup(user) {
  return { type: SIGNUP, user }
};

export function getToken(authData) {
  return { type: GET_TOKEN, authData }
};

export function authFailed(message) {
  return { type: AUTH_FAILED, message }
};

export function createUser(email) {
  return { type: CREATE_USER, email }
};


// Recipes
export function getRecipes(token) {
  return { type: GET_RECIPES, token }
};

export function addRecipe(recipe) {
  return { type: ADD_RECIPE, recipe }
};

export function flagRecipe(recipeID) {
  return { type: FLAG_RECIPE, recipeID }
};

export function recipesLoaded(payload) {
  return { type: RECIPES_LOADED, payload }
};

export function setUsername(user) {
  return { type: SET_USERNAME, user }
};
