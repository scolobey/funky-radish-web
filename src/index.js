import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import * as serviceWorker from './serviceWorker';

import store from "./store/index";
import throttle from "lodash/throttle";
import { saveState } from './stateLoader.js';
import { addRecipe } from "./actions/Actions";

store.subscribe(throttle(() => {
  saveState({
    remoteRecipes: store.getState().remoteRecipes,
    warnings: []
  });
}, 1000));

window.store = store;
window.addRecipe = addRecipe;

ReactDOM.render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
