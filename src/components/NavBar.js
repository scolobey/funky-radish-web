import React, { Component } from 'react';
import Menu from './Menu';
import icon from '../icon.png';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: false
    };

    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu(e) {
    e.stopPropagation();
    this.setState({ menu: !this.state.menu });
  }

  render() {
    return (
        <div className="App">

          <Menu open={this.state.menu ? true : false}/>

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

        </div>
    );
  }
}

export default NavBar;
