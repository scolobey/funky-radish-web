import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import NavBar from './components/NavBar';

import RecipeList from './components/RecipeList';
import PrivacyPolicy from './components/PrivacyPolicy';
import RoadMap from './components/RoadMap';
import About from './components/About';
import List from "./components/List";
import Builder from "./components/Builder";
import Post from "./components/Posts.js";

import AuthView from './components/AuthView';

import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <div className="content">
          <Route path="/:filter?" component={RecipeList} />
          <Route path="/login/" exact component={AuthView} />
          <Route path="/signup/" exact render={(props) => <AuthView {...props} login={false} />}  />
          <Route path="/about/" exact component={About} />
          <Route path="/roadmap/" component={RoadMap} />
          <Route path="/privacy/" component={PrivacyPolicy} />
          <Route path="/list/" component={List} />
          <Route path="/builder/" component={Builder} />
          <Route path="/posts/" component={Post} />
        </div>
      </div>
    );
  }
}

export default App;
