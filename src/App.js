import React, { Component, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withRouter } from 'react-router-dom'

import './App.scss';

import Loader from "./components/Loader";
import Warning from "./components/Warning";
import Redirector from './components/Redirector';
import { Redirect } from "react-router-dom";
import ScrollToTop from './components/ScrollToTop';

import Navigation from './components/Navigation';

import ReactGA from 'react-ga';

import RealmService from './services/RealmService'
const realmService = new RealmService();

function initializeReactGA() {
    ReactGA.initialize('UA-141908035-1');
    ReactGA.pageview('/');
}

const Admin = lazy(() => lazyRetry(() => import('./components/admin/Admin')) );
const GraphAdmin = lazy(() => lazyRetry(() => import('./components/admin/Graph')) );
const RecipesAdmin = lazy(() => lazyRetry(() => import('./components/admin/Recipes')) );
const UsersAdmin = lazy(() => lazyRetry(() => import('./components/admin/Users')) );

const PrivacyPolicy = lazy(() => lazyRetry(() => import('./components/PrivacyPolicy')) );
const RoadMap = lazy(() => lazyRetry(() => import('./components/RoadMap')) );
const About = lazy(() => lazyRetry(() => import('./components/About')) );
const Support = lazy(() => lazyRetry(() => import('./components/Support')) );
const Builder = lazy(() => lazyRetry(() => import("./components/Builder")) );
const Importer = lazy(() => lazyRetry(() => import("./components/admin/Importer")) );

const Recipes = lazy(() => lazyRetry(() => import("./components/Recipes.js")) );
const Recipe = lazy(() => lazyRetry(() => import("./components/Recipe.js")) );

const SearchLandingPage = lazy(() => lazyRetry(() => import("./components/SearchLandingPage")) );

const PerfectSearchPage = lazy(() => lazyRetry(() => import("./components/PerfectSearchPage")) );
const MyRecipe = lazy(() => lazyRetry(() => import("./components/MyRecipe.js")) );
const Verification = lazy(() => lazyRetry(() => import('./components/Verification.js')) );
const RecipeClaimer = lazy(() => lazyRetry(() => import('./components/RecipeClaimer.js')) );

const AuthView = lazy(() => lazyRetry(() => import('./components/AuthView')) );
const ChangePasswordView = lazy(() => lazyRetry(() => import('./components/ChangePasswordView')) );

const Minter = lazy(() => lazyRetry(() => import('./components/Minter')) );
const Blog = lazy(() => lazyRetry(() => import('./components/Blog')) );

const ExtensionLandingPage = lazy(() => lazyRetry(() => import('./components/ExtensionLandingPage.js')) );
const CornedBeefCountdown = lazy(() => lazyRetry(() => import('./components/CornedBeefCountdown')) );

const Loading = () => <div className="loader">Loading...</div>;

// https://www.codemzy.com/blog/fix-chunkloaderror-react
const lazyRetry = function(componentImport) {
  return new Promise((resolve, reject) => {
    // check if the window has already been refreshed
    const hasRefreshed = JSON.parse(
        window.sessionStorage.getItem('retry-lazy-refreshed') || 'false'
    );

    // try to import the component
    componentImport().then((component) => {
      window.sessionStorage.setItem('retry-lazy-refreshed', 'false');
      resolve(component);
    }).catch((error) => {
      if (!hasRefreshed) {
        window.sessionStorage.setItem('retry-lazy-refreshed', 'true');
        return window.location.reload();
      }
      reject(error);
    });
  });
};

function clearRecipe() {
  console.log("time to get rid of the recipe.");
}

class App extends Component {
  render() {
    return (
      <div>
        <Navigation />
        <Loader />
        <Redirector />
        <Warning />
        <ScrollToTop />

        <div className="content">
          { window.location.pathname && window.location.pathname.search(/:\d*/i) > 0 ?
            <Redirect to={window.location.pathname.split(':')[0]} /> :
            <div></div>
          }
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
            <Route path="/recipe/:recipeTitle?" onLeave={clearRecipe} component={Recipe} />
            <Route path="/myrecipes/:recipeId?" component={MyRecipe} />
            <Route path="/recipes/:searchQuery?" component={SearchLandingPage} />
            <Route path="/perfectSearch/:searchQuery?" component={PerfectSearchPage} />
            <Route path="/extension-onboarding/" component={ExtensionLandingPage} />

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
            <Route path="/blog/:post?" component={Blog} />
            <Route path="/minter" component={Minter} />
            <Route path="/corned-beef-countdown" component={CornedBeefCountdown} />
          </Suspense>
        </div>
      </div>
    );
  }
}

export default App;
