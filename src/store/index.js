import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "../reducers/index";

import {
  tokenCollectionMiddleware,
  emailVerificationMiddleware,
  recipeLoadingMiddleware,
  addRecipeMiddleware,
  getRecipeMiddleware,
  deleteRecipeMiddleware,
  loginMiddleware,
  signupMiddleware,
  warningCycleMiddleware
} from "../middleware";

import thunk from "redux-thunk";

import { loadState } from '../stateLoader.js';

const persistedState = loadState();

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  persistedState,
  storeEnhancers(applyMiddleware(
      tokenCollectionMiddleware,
      emailVerificationMiddleware,
      recipeLoadingMiddleware,
      addRecipeMiddleware,
      getRecipeMiddleware,
      deleteRecipeMiddleware,
      loginMiddleware,
      signupMiddleware,
      warningCycleMiddleware,
      thunk
  ))
);

export default store;
