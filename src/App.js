import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withRouter } from 'react-router-dom'

import Navigation from './components/Navigation';

import Admin from './components/admin/Admin';
import ImporterAdmin from './components/admin/Importer';
import GraphAdmin from './components/admin/Graph';
import RecipesAdmin from './components/admin/Recipes';
import UsersAdmin from './components/admin/Users';

import PrivacyPolicy from './components/PrivacyPolicy';
import RoadMap from './components/RoadMap';
import About from './components/About';
import Support from './components/Support';
import Builder from "./components/Builder";
import Importer from "./components/Importer";

import Recipes from "./components/Recipes.js";
import Recipe from "./components/Recipe.js";
import MyRecipe from "./components/MyRecipe.js";
import Verification from './components/Verification.js';
import RecipeClaimer from './components/RecipeClaimer.js';

import AuthView from './components/AuthView';
import ChangePasswordView from './components/ChangePasswordView';
import Loader from "./components/Loader";
import Warning from "./components/Warning";
import Redirector from './components/Redirector';

import Minter from './components/Minter';

import './App.scss';

import ReactGA from 'react-ga';

function initializeReactGA() {
    ReactGA.initialize('UA-141908035-1');
    ReactGA.pageview('/');
}

class App extends Component {
  render() {
    return (
      <div>
        <Navigation />
        <Loader />
        <Redirector />
        <Warning />

        <div className="content">
          <Route path="/" exact component={Recipes} />
          <Route path="/login/" exact component={withRouter(AuthView)} />
          <Route path="/signup/" exact component={withRouter(AuthView)} />
          <Route path="/about/" exact component={About} />
          <Route path="/support/" exact component={Support} />
          <Route path="/roadmap/" component={RoadMap} />
          <Route path="/privacy/" component={PrivacyPolicy} />
          <Route path="/verify/:token?" component={Verification} />
          <Route path="/builder/:recipeId?" component={Builder} />
          <Route path="/importer/" component={Importer} />
          <Route path="/recipes/:recipeTitle?" component={Recipe} />
          <Route path="/myrecipes/:recipeId?" component={MyRecipe} />
          <Route path="/admin/" component={Admin} />
          <Route path="/admin/importer" component={ImporterAdmin} />
          <Route path="/admin/graph" component={GraphAdmin} />
          <Route path="/admin/recipes" component={RecipesAdmin} />
          <Route path="/admin/users" component={UsersAdmin} />
          <Route path="/claimRecipe/:token?" component={RecipeClaimer} />
          <Route path="/changePassword/:token?" component={ChangePasswordView} />
          <Route path="/minter" component={Minter} />
        </div>
      </div>
    );
  }
}

export default App;
