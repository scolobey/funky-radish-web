import React, { Component } from 'react';
import { connect } from "react-redux";
import { toggleMenu } from "../actions/Actions";
import Menu from './Menu';
import icon from '../icon.png';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu(e) {
    e.stopPropagation();
    this.props.toggleMenu();
  }

  render() {
    return (
        <div className="App">

          <Menu/>

          <header className="header">
            <a href="/">
              <img className="icon" src={icon} alt="Logo"/>
            </a>
            <div id="Nav-Icon" className={this.props.menu ? 'open' : ''} onClick={this.toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </header>

          <div className="create-button"><a href="./builder">+</a></div>

        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    menu: state.menu
  };
}

export default connect(mapStateToProps, { toggleMenu })(NavBar);
