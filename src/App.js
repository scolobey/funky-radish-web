import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withRouter } from 'react-router-dom'

import Navigation from './components/Navigation';

import PrivacyPolicy from './components/PrivacyPolicy';
import RoadMap from './components/RoadMap';
import About from './components/About';
import Support from './components/Support';
import Builder from "./components/Builder";
import Recipes from "./components/Recipes.js";
import Recipe from "./components/Recipe.js";
import Verification from './components/Verification.js';

import AuthView from './components/AuthView';
import Loader from "./components/Loader";
import Warning from "./components/Warning";
import Redirector from './components/Redirector';

import './App.css';

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
          <Route path="/builder/:clientID?" component={Builder} />
          <Route path="/recipes/:recipeTitle?" component={Recipe} />
        </div>
      </div>
    );
  }
}

export default App;
