import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Navigation from './components/Navigation';

import PrivacyPolicy from './components/PrivacyPolicy';
import RoadMap from './components/RoadMap';
import About from './components/About';
import Builder from "./components/Builder";
import Recipes from "./components/Recipes.js";

import AuthView from './components/AuthView';
import Loader from "./components/Loader";
import Warning from "./components/Warning";
import Redirector from './components/Redirector';

import './App.css';

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
          <Route path="/login/" exact component={AuthView} />
          <Route path="/signup/" exact component={AuthView} />
          <Route path="/about/" exact component={About} />
          <Route path="/roadmap/" component={RoadMap} />
          <Route path="/privacy/" component={PrivacyPolicy} />
          <Route path="/builder/:clientID?" component={Builder} />
        </div>
      </div>
    );
  }
}

export default App;
