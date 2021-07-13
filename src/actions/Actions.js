import {
  GET_RECIPES,
  GET_RECIPE,
  ADD_RECIPE,
  UPDATE_RECIPE,
  RECIPES_LOADED,
  EXTERNAL_RECIPES_LOADED,
  CLEAR_RECIPES,
  DELETE_REMOTE_RECIPE,
  DELETE_LOCAL_RECIPE,
  GET_TOKEN,
  AUTH_FAILED,
  VERIFY_EMAIL,
  SET_VERIFIED,
  CREATE_USER,
  LOGIN,
  SIGNUP,
  WARNING,
  SET_USERNAME,
  TOGGLE_MENU,
  TOGGLE_LOADER,
  SET_RECIPE,
  WARNING_TOGGLE,
  SET_REDIRECT,
  SEARCH,
  SET_IMPORT_QUEUE,
  EXTERNAL_RECIPE_SEARCH,
  AUTOCOMPLETE,
  SET_SEARCH_SUGGESTIONS
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

export function verifyEmail(token) {
  return { type: VERIFY_EMAIL, token }
};

export function setVerified(verificationMessage) {
  return { type: SET_VERIFIED, verificationMessage }
};

export function createUser(email) {
  return { type: CREATE_USER, email }
};

// Recipes
export function getRecipes(token) {
  return { type: GET_RECIPES, token }
};

export function getRecipe(recipeTitle) {
  return { type: GET_RECIPE, recipeTitle }
};

export function addRecipe(recipe) {
  return { type: ADD_RECIPE, recipe }
};

export function updateRecipe(recipe) {
  return { type: UPDATE_RECIPE, recipe }
};

export function recipesLoaded(recipes) {
  return { type: RECIPES_LOADED, recipes }
};

export function externalRecipesLoaded(recipes) {
  return { type: EXTERNAL_RECIPES_LOADED, recipes }
};

export function clearRecipes() {
  return { type: CLEAR_RECIPES }
};

export function setRecipe(recipe) {
  return { type: SET_RECIPE, recipe }
};

export function deleteLocalRecipe(recipeID) {
  return { type: DELETE_LOCAL_RECIPE, recipeID }
};

export function deleteRemoteRecipe(recipe) {
  return { type: DELETE_REMOTE_RECIPE, recipe }
};

export function setUsername(user) {
  return { type: SET_USERNAME, user }
};

export function toggleMenu() {
  return { type: TOGGLE_MENU }
};

export function toggleLoader(loader) {
  return { type: TOGGLE_LOADER, loader }
};

export function warningToggle() {
  return { type: WARNING_TOGGLE }
};

export function setRedirect(redirect) {
  return { type: SET_REDIRECT, redirect }
};

export function search(query) {
  return { type: SEARCH, query }
};

export function setImportQueue(queue) {
  return { type: SET_IMPORT_QUEUE, queue }
};

export function externalRecipeSearch(query) {
  return { type: EXTERNAL_RECIPE_SEARCH, query }
};

export function autocomplete(query) {
  return { type: AUTOCOMPLETE, query }
};

export function setSearchSuggestions(suggestions) {
  return { type: SET_SEARCH_SUGGESTIONS, suggestions }
};
