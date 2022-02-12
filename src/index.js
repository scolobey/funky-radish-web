"use strict";

import "core-js/stable";
import 'url-search-params-polyfill';
import 'whatwg-fetch'

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import * as serviceWorker from './serviceWorker';

import RealmApolloProvider from "./graphql/RealmApolloProvider";

import store from "./store/index";
import throttle from "lodash/throttle";
import { saveState } from './stateLoader.js';
// import { addRecipe } from "./actions/Actions";

export const APP_ID = "funky-radish-twdxv";

const Loader = React.lazy(() => import('./components/Loader'));

store.subscribe(throttle(() => {
  saveState({
    recipes: store.getState().recipes,
    filteredRecipes: store.getState().recipes,
    warnings: []
  });
}, 1000));

window.store = store;
// window.addRecipe = addRecipe;

ReactDOM.render(
  <RealmApolloProvider>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </RealmApolloProvider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
