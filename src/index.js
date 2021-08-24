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
import { RealmAppProvider } from "./RealmApp";

import store from "./store/index";
import throttle from "lodash/throttle";
import { saveState } from './stateLoader.js';
import { addRecipe } from "./actions/Actions";

export const APP_ID = "funky-radish-twdxv";

store.subscribe(throttle(() => {
  saveState({
    recipes: store.getState().recipes,
    filteredRecipes: store.getState().recipes,
    warnings: []
  });
}, 1000));

window.store = store;
window.addRecipe = addRecipe;

ReactDOM.render(
  <RealmAppProvider appId={APP_ID}>
    <RealmApolloProvider>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </RealmApolloProvider>
  </RealmAppProvider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
