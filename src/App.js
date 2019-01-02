import React, { Component } from 'react';
import icon from './icon.png';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import RecipeList from './components/RecipeList';
import Menu from './components/Menu';
import './App.css';

import PrivacyPolicy from './components/PrivacyPolicy';

const About = () => <h2>About</h2>;

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
            <Route path="/about/" component={About} />
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
