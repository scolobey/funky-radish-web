import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "../reducers/index";
import {
  recipeModerationMiddleware,
  tokenCollectionMiddleware,
  recipeLoadingMiddleware,
  loginMiddleware,
  signupMiddleware
} from "../middleware";
import thunk from "redux-thunk";

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  storeEnhancers(applyMiddleware(
      recipeModerationMiddleware,
      tokenCollectionMiddleware,
      recipeLoadingMiddleware,
      loginMiddleware,
      signupMiddleware,
      thunk
  ))
);

export default store;
