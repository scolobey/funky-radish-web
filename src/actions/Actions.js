import {
  GET_RECIPES,
  ADD_RECIPE,
  UPDATE_RECIPE,
  RECIPES_LOADED,
  CLEAR_RECIPES,
  GET_TOKEN,
  AUTH_FAILED,
  CREATE_USER,
  LOGIN,
  SIGNUP,
  WARNING,
  SET_USERNAME,
  TOGGLE_MENU,
  TOGGLE_LOADER,
  WARNING_TOGGLE
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

export function updateRecipe(recipe) {
  return { type: UPDATE_RECIPE, recipe }
};

export function recipesLoaded(payload) {
  return { type: RECIPES_LOADED, payload }
};

export function clearRecipes() {
  return { type: CLEAR_RECIPES }
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
