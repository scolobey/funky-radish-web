import React, { Component } from 'react';
import icon from './icon.png';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import RecipeList from './components/RecipeList';
import PrivacyPolicy from './components/PrivacyPolicy';
import RoadMap from './components/RoadMap';
import About from './components/About';

import Menu from './components/Menu';
import AuthView from './components/AuthView';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false
    };

    this.toggleMenu = this.toggleMenu.bind(this);
  }

  render() {
    return (
      <Router>
        <div className="App">

          <Menu open={this.state.menu ? true : false} />

          <header className="header">
            <a href="/">
              <img className="icon" src={icon} alt="Logo"/>
            </a>
            <div id="Nav-Icon" className={this.state.menu ? 'open' : ''} onClick={this.toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </header>

          <div className="content">
            <Route path="/" exact component={RecipeList} />
            <Route path="/login/" component={AuthView} />
            <Route path="/about/" component={About} />
            <Route path="/roadmap/" component={RoadMap} />
            <Route path="/privacy/" component={PrivacyPolicy} />
          </div>

        </div>
      </Router>
    );
  }

  toggleMenu(e) {
    e.stopPropagation();
    this.setState({ menu: !this.state.menu });
  }
}

export default App;
