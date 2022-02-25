import React, { Component, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withRouter } from 'react-router-dom'

import './App.scss';

import Loader from "./components/Loader";
import Warning from "./components/Warning";
import Redirector from './components/Redirector';

import Navigation from './components/Navigation';

import ReactGA from 'react-ga';

import RealmService from './services/RealmService'
const realmService = new RealmService();

function initializeReactGA() {
    ReactGA.initialize('UA-141908035-1');
    ReactGA.pageview('/');
}

const Admin = lazy(() => import('./components/admin/Admin'));
const GraphAdmin = lazy(() => import('./components/admin/Graph'));
const RecipesAdmin = lazy(() => import('./components/admin/Recipes'));
const UsersAdmin = lazy(() => import('./components/admin/Users'));

const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const RoadMap = lazy(() => import('./components/RoadMap'));
const About = lazy(() => import('./components/About'));
const Support = lazy(() => import('./components/Support'));
const Builder = lazy(() => import("./components/Builder"));
const Importer = lazy(() => import("./components/admin/Importer"));

const Recipes = lazy(() => import("./components/Recipes.js"));
const Recipe = lazy(() => import("./components/Recipe.js"));
const SearchLandingPage = lazy(() => import("./components/SearchLandingPage"));
const MyRecipe = lazy(() => import("./components/MyRecipe.js"));
const Verification = lazy(() => import('./components/Verification.js'));
const RecipeClaimer = lazy(() => import('./components/RecipeClaimer.js'));

const AuthView = lazy(() => import('./components/AuthView'));
const ChangePasswordView = lazy(() => import('./components/ChangePasswordView'));

const Minter = lazy(() => import('./components/Minter'));

const Loading = () => <div className="loader">Loading...</div>;

class App extends Component {
  render() {
    return (
      <div>
        <Navigation />
        <Loader />
        <Redirector />
        <Warning />

        <div className="content">
          <Suspense fallback=<Loading/>>
            <Route path="/" exact component={Recipes} />
            <Route path="/login/" exact component={withRouter(AuthView)} />
            <Route path="/signup/" exact component={withRouter(AuthView)} />
            <Route path="/about/" exact component={About} />
            <Route path="/support/" exact component={Support} />
            <Route path="/roadmap/" component={RoadMap} />
            <Route path="/privacy/" component={PrivacyPolicy} />
            <Route path="/verify/:token?" component={Verification} />
            <Route path="/builder/:recipeId?" component={Builder} />
            <Route path="/recipe/:recipeTitle?" component={Recipe} />
            <Route path="/myrecipes/:recipeId?" component={MyRecipe} />
            <Route path="/recipes/:searchQuery?" component={SearchLandingPage} />

            { (realmService.getUser() && realmService.getUser()["customData"]["admin"]) ? ([
              <Route path="/admin/" component={Admin} />,
              <Route path="/admin/importer/:recipeId?" component={Importer} />,
              <Route path="/admin/graph" component={GraphAdmin} />,
              <Route path="/admin/recipes" component={RecipesAdmin} />,
              <Route path="/admin/users" component={UsersAdmin} />
            ]): (
              <Route path="/admin/" component={Recipes} />
            )}

            <Route path="/claimRecipe/:token?" component={RecipeClaimer} />
            <Route path="/changePassword/:token?" component={ChangePasswordView} />
            <Route path="/minter" component={Minter} />
          </Suspense>
        </div>
      </div>
    );
  }
}

export default App;
