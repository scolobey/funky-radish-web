import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import NavBar from './components/NavBar';

import PrivacyPolicy from './components/PrivacyPolicy';
import RoadMap from './components/RoadMap';
import About from './components/About';
import Builder from "./components/Builder";
import Recipes from "./components/Recipes.js";

import AuthView from './components/AuthView';
import Loader from "./components/Loader";
import Warning from "./components/Warning";

import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Warning />
        <Loader />
        <NavBar />
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
